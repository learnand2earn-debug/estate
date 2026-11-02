import type { Auth } from 'firebase-admin/auth';

let cachedAuth: Auth | null = null;

export async function getAdminAuth(): Promise<Auth> {
  if (cachedAuth) return cachedAuth;

  const { initializeApp, getApps } = await import('firebase-admin/app');
  const { getAuth } = await import('firebase-admin/auth');
  const firebaseConfig = (await import('../../firebase-applet-config.json')).default;

  if (!getApps().length) {
    initializeApp({
      projectId: firebaseConfig.projectId,
    });
  }

  cachedAuth = getAuth();
  return cachedAuth;
}
