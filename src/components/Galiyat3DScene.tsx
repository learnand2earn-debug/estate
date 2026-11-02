'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GALIYAT_LOCATIONS, type GaliyatLocation } from '@/src/lib/galiyat-data';

interface Galiyat3DSceneProps {
  mode: 'hero' | 'explorer';
  selectedLocationSlug?: string;
  onSelectLocation?: (location: GaliyatLocation) => void;
  scrollProgress?: number;
}

// Deterministic terrain elevation function so all villas, trees, and beacons sit flush on the ground
export function groundHeightAt(x: number, z: number): number {
  const ridge1 = Math.sin(x * 0.32 + 0.4) * Math.cos(z * 0.28 - 0.2) * 2.1;
  const ridge2 = Math.cos(x * 0.65 - z * 0.45) * 0.85;
  const peakBoost = Math.exp(-((x * x + z * z) * 0.025)) * 1.4;
  const valleyCarve = Math.sin(x * 0.18 - z * 0.22) * 0.6;
  return ridge1 + ridge2 + peakBoost + valleyCarve;
}

// Reusable module-scope math helpers to guarantee zero GC in the render loop
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _dummyObj = new THREE.Object3D();
const _color = new THREE.Color();

export function Galiyat3DScene({
  mode,
  selectedLocationSlug = 'wholdings',
  onSelectLocation,
  scrollProgress = 0,
}: Galiyat3DSceneProps) {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const selectedSlugRef = useRef(selectedLocationSlug);
  const scrollProgressRef = useRef(scrollProgress);
  const lightingPresetRef = useRef<'golden' | 'mist' | 'night'>('golden');

  const [lightingPreset, setLightingPreset] = useState<'golden' | 'mist' | 'night'>('golden');
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [webglFallback, setWebglFallback] = useState(false);

  useEffect(() => {
    selectedSlugRef.current = selectedLocationSlug;
  }, [selectedLocationSlug]);

  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    lightingPresetRef.current = lightingPreset;
  }, [lightingPreset]);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    // Detect software WebGL from GPU renderer string
    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFallback(true);
      return;
    }

    const width = container.clientWidth || 1200;
    const height = container.clientHeight || 700;
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x101614, 0.032);

    // Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 120);
    camera.position.set(0, 7.2, 13.5);
    const currentLookAt = new THREE.Vector3(0, 1.5, 0);
    camera.lookAt(currentLookAt);

    // 3-Point Warm/Cool Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xdce5e0, 0x102b24, 0.85);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffd699, 2.2);
    keyLight.position.set(12, 16, 8);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.left = -14;
      keyLight.shadow.camera.right = 14;
      keyLight.shadow.camera.top = 14;
      keyLight.shadow.camera.bottom = -14;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x88b3a4, 0.9);
    rimLight.position.set(-12, 9, -10);
    scene.add(rimLight);

    // Procedural Bump Texture for Mountain Terrain
    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = 128;
    bumpCanvas.height = 128;
    const bCtx = bumpCanvas.getContext('2d');
    if (bCtx) {
      bCtx.fillStyle = '#808080';
      bCtx.fillRect(0, 0, 128, 128);
      for (let i = 0; i < 600; i++) {
        const v = 90 + ((i * 37) % 110);
        bCtx.fillStyle = `rgb(${v},${v},${v})`;
        bCtx.fillRect((i * 19) % 128, (i * 29) % 128, 3, 3);
      }
    }
    const bumpTex = new THREE.CanvasTexture(bumpCanvas);
    bumpTex.wrapS = THREE.RepeatWrapping;
    bumpTex.wrapT = THREE.RepeatWrapping;
    bumpTex.repeat.set(8, 8);

    // 1. Sculpted 3D Galiyat Mountain Terrain
    const terrainGeo = new THREE.PlaneGeometry(34, 34, 64, 64);
    terrainGeo.rotateX(-Math.PI / 2);
    const posAttr = terrainGeo.attributes.position;
    const colors: number[] = [];

    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vz = posAttr.getZ(i);
      const vy = groundHeightAt(vx, vz);
      posAttr.setY(i, vy);

      // Vertex color gradient from deep forest valley to snowy/misty ridge crest
      if (vy > 2.3) {
        _color.setHex(0x365249);
      } else if (vy > 0.8) {
        _color.setHex(0x16382e);
      } else {
        _color.setHex(0x0d211b);
      }
      colors.push(_color.r, _color.g, _color.b);
    }
    terrainGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.82,
      metalness: 0.08,
      bumpMap: bumpTex,
      bumpScale: 0.08,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = !isSoftwareGl;
    scene.add(terrainMesh);

    // 2. Instanced Himalayan Deodar Pine Forest (Composite Multi-Part Silhouette)
    const treeCount = 110;
    const trunkGeo = new THREE.CylinderGeometry(0.04, 0.07, 0.35, 6);
    trunkGeo.translate(0, 0.175, 0);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3b281a, roughness: 0.9 });
    const trunkInstanced = new THREE.InstancedMesh(trunkGeo, trunkMat, treeCount);

    const foliageLowerGeo = new THREE.ConeGeometry(0.28, 0.55, 7);
    foliageLowerGeo.translate(0, 0.45, 0);
    const foliageUpperGeo = new THREE.ConeGeometry(0.2, 0.48, 7);
    foliageUpperGeo.translate(0, 0.72, 0);
    const foliageMat = new THREE.MeshStandardMaterial({
      color: 0x184235,
      roughness: 0.75,
      metalness: 0.05,
    });
    const foliageLowerInstanced = new THREE.InstancedMesh(
      foliageLowerGeo,
      foliageMat,
      treeCount
    );
    const foliageUpperInstanced = new THREE.InstancedMesh(
      foliageUpperGeo,
      foliageMat,
      treeCount
    );

    for (let i = 0; i < treeCount; i++) {
      const angle = i * 2.39996;
      const radius = 2.2 + ((i * 17) % 105) * 0.11;
      const tx = Math.cos(angle) * radius;
      const tz = Math.sin(angle) * radius;
      const ty = groundHeightAt(tx, tz);
      const scale = 0.75 + (i % 5) * 0.14;

      _dummyObj.position.set(tx, ty, tz);
      _dummyObj.rotation.set(0, (i * 0.7) % Math.PI, 0);
      _dummyObj.scale.set(scale, scale, scale);
      _dummyObj.updateMatrix();

      trunkInstanced.setMatrixAt(i, _dummyObj.matrix);
      foliageLowerInstanced.setMatrixAt(i, _dummyObj.matrix);
      foliageUpperInstanced.setMatrixAt(i, _dummyObj.matrix);

      _color.setHSL(0.44, 0.48, 0.14 + (i % 4) * 0.03);
      foliageLowerInstanced.setColorAt(i, _color);
      foliageUpperInstanced.setColorAt(i, _color);
    }
    trunkInstanced.computeBoundingSphere();
    foliageLowerInstanced.computeBoundingSphere();
    foliageUpperInstanced.computeBoundingSphere();
    scene.add(trunkInstanced, foliageLowerInstanced, foliageUpperInstanced);

    // 3. Composite 7-Part 3D Luxury Mountain Villas & Chalets on Galiyat Ridges
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x2f3b37,
      roughness: 0.85,
      metalness: 0.12,
    });
    const cedarMat = new THREE.MeshStandardMaterial({
      color: 0x5c3e26,
      roughness: 0.55,
      metalness: 0.15,
    });
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x182420,
      roughness: 0.35,
      metalness: 0.45,
    });
    const windowGlowMat = new THREE.MeshStandardMaterial({
      color: 0xffe4a8,
      emissive: 0xffb84d,
      emissiveIntensity: 1.6,
      roughness: 0.15,
      metalness: 0.1,
    });
    const goldBeaconMat = new THREE.MeshStandardMaterial({
      color: 0xc7a66a,
      emissive: 0xc7a66a,
      emissiveIntensity: 0.35,
      roughness: 0.2,
      metalness: 0.9,
    });
    const shadowDiscGeo = new THREE.CircleGeometry(0.85, 20);
    shadowDiscGeo.rotateX(-Math.PI / 2);
    const shadowDiscMat = new THREE.MeshBasicMaterial({
      color: 0x050908,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });

    const beaconMeshes: THREE.Mesh[] = [];

    GALIYAT_LOCATIONS.forEach((loc) => {
      const vx = loc.coordinates3D.x;
      const vz = loc.coordinates3D.z;
      const vy = groundHeightAt(vx, vz);

      const villaGroup = new THREE.Group();
      villaGroup.position.set(vx, vy, vz);

      // Soft Contact Shadow Disc (offset +0.02 on Y to prevent Z-fighting)
      const contactShadow = new THREE.Mesh(shadowDiscGeo, shadowDiscMat);
      contactShadow.position.y = 0.02;
      villaGroup.add(contactShadow);

      // Part 1: Stone Foundation Plinth
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.24, 0.72), stoneMat);
      plinth.position.y = 0.12;
      villaGroup.add(plinth);

      // Part 2: Cantilevered Cedar Deck
      const deck = new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.05, 0.88), cedarMat);
      deck.position.set(0.05, 0.26, 0.06);
      villaGroup.add(deck);

      // Part 3: Main Timber Chalet Body
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.36, 0.58), cedarMat);
      body.position.y = 0.44;
      villaGroup.add(body);

      // Part 4: Upper Glass Observatory Wing
      const wing = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.44, 0.48), stoneMat);
      wing.position.set(0.18, 0.52, 0.04);
      villaGroup.add(wing);

      // Part 5: Warm Glowing Architectural Windows
      const winFront = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.22, 0.61), windowGlowMat);
      winFront.position.set(-0.02, 0.44, 0);
      villaGroup.add(winFront);

      // Part 6: Pitched Alpine Gable Roof
      const roof = new THREE.Mesh(new THREE.ConeGeometry(0.64, 0.32, 4), roofMat);
      roof.rotation.y = Math.PI / 4;
      roof.position.set(0, 0.82, 0);
      villaGroup.add(roof);

      // Part 7: Stone Chimney & Interactive Gold Location Beacon
      const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.45, 0.12), stoneMat);
      chimney.position.set(-0.22, 0.75, -0.14);
      villaGroup.add(chimney);

      const beaconPin = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.18, 0),
        goldBeaconMat.clone()
      );
      beaconPin.position.set(0, 1.35, 0);
      beaconPin.userData = { locationSlug: loc.slug };
      villaGroup.add(beaconPin);
      beaconMeshes.push(beaconPin);

      scene.add(villaGroup);
    });

    // 4. Floating Volumetric 3D Cloud Clusters
    const cloudGroup = new THREE.Group();
    const cloudGeo = new THREE.DodecahedronGeometry(0.55, 1);
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xdce5e0,
      transparent: true,
      opacity: 0.24,
      roughness: 1,
      metalness: 0,
      depthWrite: false,
    });

    for (let c = 0; c < 14; c++) {
      const cluster = new THREE.Group();
      const cx = -9 + ((c * 3.1) % 18);
      const cz = -7 + ((c * 2.3) % 14);
      const cy = 2.6 + (c % 3) * 0.55;
      cluster.position.set(cx, cy, cz);

      for (let p = 0; p < 3; p++) {
        const puff = new THREE.Mesh(cloudGeo, cloudMat);
        puff.position.set((p - 1) * 0.48, (p % 2) * 0.12, 0);
        puff.scale.set(1.4, 0.42, 0.9);
        cluster.add(puff);
      }
      cloudGroup.add(cluster);
    }
    scene.add(cloudGroup);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Pointer parallax & click raycasting on location beacons
    const mouse = { x: 0, y: 0 };
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();

    const handlePointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (mode !== 'explorer' || !onSelectLocation) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(beaconMeshes, false);
      if (hits.length > 0) {
        const slug = hits[0].object.userData?.locationSlug;
        const found = GALIYAT_LOCATIONS.find((l) => l.slug === slug);
        if (found) onSelectLocation(found);
      }
    };

    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 1200;
      const h = container.clientHeight || 700;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Render loop with software-WebGL fenceSync pacing
    let frameId = 0;
    const startTime = performance.now();
    let prevTime = startTime;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    function tick() {
      const now = performance.now();
      const dt = Math.min((now - prevTime) * 0.001, 0.1);
      prevTime = now;
      const elapsed = (now - startTime) * 0.001;

      // Apply lighting preset smoothly
      if (lightingPresetRef.current === 'golden') {
        keyLight.color.setHex(0xffd699);
        keyLight.intensity = 2.2;
        hemiLight.intensity = 0.85;
      } else if (lightingPresetRef.current === 'mist') {
        keyLight.color.setHex(0xdce5e0);
        keyLight.intensity = 1.4;
        hemiLight.intensity = 1.1;
      } else {
        keyLight.color.setHex(0x7fa6c4);
        keyLight.intensity = 0.75;
        hemiLight.intensity = 0.45;
      }

      // Rotate beacons & float clouds gently
      beaconMeshes.forEach((b, idx) => {
        b.rotation.y = elapsed * 1.1 + idx;
        const isSelected = b.userData.locationSlug === selectedSlugRef.current;
        const targetScale = isSelected ? 1.55 : 1.0;
        b.scale.setScalar(THREE.MathUtils.damp(b.scale.x, targetScale, 5, dt));
      });

      cloudGroup.children.forEach((cl, idx) => {
        cl.position.x += dt * (0.18 + (idx % 3) * 0.05);
        if (cl.position.x > 10) cl.position.x = -10;
      });

      // Camera choreography
      if (mode === 'explorer') {
        const activeLoc =
          GALIYAT_LOCATIONS.find((l) => l.slug === selectedSlugRef.current) ||
          GALIYAT_LOCATIONS[0];
        const gy = groundHeightAt(activeLoc.coordinates3D.x, activeLoc.coordinates3D.z);
        _targetLookAt.set(activeLoc.coordinates3D.x, gy + 0.5, activeLoc.coordinates3D.z);
        _targetCamPos.set(
          activeLoc.coordinates3D.x + 3.8 + mouse.x * 0.8,
          gy + 3.4 + mouse.y * 0.4,
          activeLoc.coordinates3D.z + 5.6
        );
      } else {
        const sp = scrollProgressRef.current;
        _targetLookAt.set(-1.5 + mouse.x * 1.1, 1.3 - sp * 1.0, 0);
        _targetCamPos.set(
          -1.8 + Math.sin(elapsed * 0.14) * 1.8 + mouse.x * 1.4,
          6.2 - sp * 1.8 + mouse.y * 0.6,
          12.0 - sp * 3.5
        );
      }

      camera.position.x = THREE.MathUtils.damp(camera.position.x, _targetCamPos.x, 3.5, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, _targetCamPos.y, 3.5, dt);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, _targetCamPos.z, 3.5, dt);

      currentLookAt.x = THREE.MathUtils.damp(currentLookAt.x, _targetLookAt.x, 4, dt);
      currentLookAt.y = THREE.MathUtils.damp(currentLookAt.y, _targetLookAt.y, 4, dt);
      currentLookAt.z = THREE.MathUtils.damp(currentLookAt.z, _targetLookAt.z, 4, dt);
      camera.lookAt(currentLookAt);

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.dispose();
    };
  }, [mode, onSelectLocation]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Dedicated WebGL Mount Container */}
      <div
        ref={canvasMountRef}
        data-testid={mode === 'hero' ? 'hero-3d-canvas' : 'explorer-3d-canvas'}
        className="w-full h-full"
      />

      {webglFallback && (
        <div className=" inset-0 flex items-center justify-center bg-[#102B24] text-[#DCE5E0] p-6 text-center">
          <p className="text-sm">Interactive 3D Galiyat Topographical Terrain View</p>
        </div>
      )}

      {/* Collapsible Unified Bottom Control Dock for Explorer Mode (No backdrop-filter over WebGL) */}
      {mode === 'explorer' && (
        <div
          className="absolute left-1/2 -translate-x-1/2 z-20 transition-transform duration-300"
          style={{
            bottom: '16px',
            width: 'min(920px, 94vw)',
            transform: `translateX(-50%) translateY(${dockCollapsed ? 'calc(100% - 34px)' : '0'})`,
          }}
        >
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setDockCollapsed((prev) => !prev)}
              className="px-4 py-1.5 rounded-t-lg bg-[#101614] border border-b-0 border-[#C7A66A]/35 text-[11px] font-medium text-[#C7A66A] hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              {dockCollapsed ? '▴ Show 3D Terrain Controls' : '▾ Hide Controls'}
            </button>
          </div>

          <div className="p-3 rounded-xl bg-[#101614] border border-[#C7A66A]/35 shadow-2xl flex flex-wrap items-center justify-between gap-3">
            {/* Location Beacons Selector */}
            <div className="flex flex-wrap items-center gap-1.5">
              {GALIYAT_LOCATIONS.map((loc) => {
                const active = selectedLocationSlug === loc.slug;
                return (
                  <button
                    key={loc.slug}
                    type="button"
                    onClick={() => onSelectLocation && onSelectLocation(loc)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-[#C7A66A] text-[#101614] font-semibold'
                        : 'bg-[#102B24] text-[#DCE5E0] hover:bg-[#193F35]'
                    }`}
                  >
                    {loc.name}
                  </button>
                );
              })}
            </div>

            {/* Atmosphere Lighting Switcher */}
            <div className="flex items-center gap-1.5 bg-[#102B24] p-1 rounded-lg">
              {(['golden', 'mist', 'night'] as const).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setLightingPreset(preset)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium capitalize transition-colors whitespace-nowrap shrink-0 ${
                    lightingPreset === preset
                      ? 'bg-[#C7A66A] text-[#101614]'
                      : 'text-[#DCE5E0]/80 hover:text-white'
                  }`}
                >
                  {preset === 'golden'
                    ? 'Golden Sunset'
                    : preset === 'mist'
                    ? 'Alpine Fog'
                    : 'Starlight'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
