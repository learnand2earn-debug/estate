export interface PropertyVisual {
  id: string;
  title: string;
  caption: string;
  sceneType:
    | 'villa-sunset'
    | 'cottage-mist'
    | 'penthouse-clouds'
    | 'glass-house'
    | 'pine-plot'
    | 'commercial-ridge'
    | 'resort-twilight'
    | 'interior-hearth';
  palette: [string, string, string];
}

export interface PropertyRecord {
  id: number;
  slug: string;
  referenceId: string;
  title: string;
  subtitle: string;
  locationSlug: string;
  locationName: string;
  propertyType: string;
  pricePkr: string;
  priceNumeric: number; // in PKR Millions (e.g. 45 = PKR 45,000,000)
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  areaLabel: string;
  availabilityStatus: 'Available' | 'Reserved' | 'Sold';
  isFeatured: boolean;
  isSample: boolean;
  elevationFt: string;
  description: string;
  architecturalNotes: string;
  amenities: string[];
  galleryVisuals: PropertyVisual[];
  coordinates: { x: number; z: number };
}

export interface GaliyatLocation {
  slug: string;
  name: string;
  tagline: string;
  elevationSummary: string;
  character: string;
  description: string;
  highlights: string[];
  coordinates3D: { x: number; y: number; z: number };
  mapPinPercent: { left: string; top: string };
  palette: [string, string, string];
}

export interface TourismLandmark {
  id: string;
  name: string;
  region: string;
  category: string;
  summary: string;
  experienceNotes: string;
  sceneType: PropertyVisual['sceneType'];
  palette: [string, string, string];
}

export interface GalleryItem {
  id: string;
  title: string;
  category:
    | 'Mountain Landscapes'
    | 'Luxury Villas'
    | 'Wooden Cottages'
    | 'Interior Architecture'
    | 'Snow & Winter'
    | 'Sunrise & Golden Hour';
  location: string;
  caption: string;
  aspect: 'tall' | 'wide' | 'square';
  sceneType: PropertyVisual['sceneType'];
  palette: [string, string, string];
}

export const PROPERTY_CATEGORIES = [
  'All Categories',
  'Luxury Mountain Villas',
  'Wooden Cottages',
  'Mountain View Houses',
  'Luxury Apartments',
  'Residential Plots',
  'Commercial Properties',
  'Resorts and Hotels',
] as const;

export const GALIYAT_LOCATIONS: GaliyatLocation[] = [
  {
    slug: 'wholdings',
    name: 'Wholdings',
    tagline: 'The Crown Jewel of the Himalayan Foothills',
    elevationSummary: '8,200 ft Alpine Sanctuary',
    character: 'Sovereign Estates, Heritage Timber Chalets & Alpine Ridges',
    description:
      'Known for its dense Himalayan deodar cedar forests, misty mountain ridges, and historic summer residences, Wholdings represents the pinnacle of private mountain living with Wholdings.',
    highlights: [
      'Old Governor House Ridge & Scenic Promenades',
      'Panoramic Views Toward Miranjani & Mukshpuri Peaks',
      'Mature Deodar, Pine, Oak, and Maple Canopies',
      'Year-Round Four-Season Alpine Microclimate',
    ],
    coordinates3D: { x: -4.5, y: 3.4, z: -1.5 },
    mapPinPercent: { left: '24%', top: '52%' },
    palette: ['#102B24', '#C7A66A', '#1B4338'],
  },
  {
    slug: 'dunga-gali',
    name: 'Dunga Gali',
    tagline: 'Whispering Pines & Historic Pipeline Trails',
    elevationSummary: '7,800 ft Forested Escarpment',
    character: 'Secluded Wooden Cottages & Forest-Edge Sanctuaries',
    description:
      'Anchored by the famous colonial-era Pipeline Track leading toward Ayubia, Dunga Gali offers serene woodland privacy, dramatic valley drops, and tranquil cedar-scented air.',
    highlights: [
      'Direct Access to the Scenic Pipeline Forest Walk',
      'Gateway Trailhead to Mukshpuri Top',
      'Sheltered Western Slopes with Sunset Vistas',
      'Boutique Timber Cottages & Private Retreats',
    ],
    coordinates3D: { x: -1.8, y: 2.9, z: 1.8 },
    mapPinPercent: { left: '68%', top: '34%' },
    palette: ['#14362D', '#D4B475', '#0D211B'],
  },
  {
    slug: 'ayubia',
    name: 'Ayubia',
    tagline: 'Protected National Park & Alpine Meadow Vistas',
    elevationSummary: '8,000 ft National Park Belt',
    character: 'Mountain View Houses, Family Chalets & Eco-Resorts',
    description:
      'Surrounding the protected forests of Ayubia National Park, this vibrant mountain hub combines lush biodiversity with refined family hospitality and effortless road connectivity.',
    highlights: [
      'Adjacent to Protected Conifer Reserves of Ayubia National Park',
      'Vibrant Mountain Town Center & Dining Promenade',
      'Ideal for Turnkey Serviced Apartments & Holiday Homes',
      'Rich Wildlife & Botanical Forest Trails',
    ],
    coordinates3D: { x: 1.2, y: 2.6, z: 2.4 },
    mapPinPercent: { left: '44%', top: '20%' },
    palette: ['#173D32', '#C7A66A', '#0E241E'],
  },
  {
    slug: 'changla-gali',
    name: 'Changla Gali',
    tagline: 'Skyline Summits Above the Cloud Sea',
    elevationSummary: '8,400 ft Summit Crest',
    character: 'Cantilevered Glass Houses & High-Altitude Penthouses',
    description:
      'Positioned along one of the highest ridges along the Galiyat corridor, Changla Gali commands sweeping 360-degree views of rolling cloud valleys and snow-draped winter peaks.',
    highlights: [
      'Commanding Ridge-Top Elevation with Dramatic Cloud Inversions',
      'Heavy Winter Snowfall & Crisp Summer Breezes',
      'Architectural Glass & Stone Cliffside Residences',
      'Convenient Access Between Murree and Wholdings',
    ],
    coordinates3D: { x: 4.2, y: 3.8, z: -0.8 },
    mapPinPercent: { left: '58%', top: '65%' },
    palette: ['#0F2922', '#E2C389', '#1F4B3E'],
  },
  {
    slug: 'khanspur',
    name: 'Khanspur',
    tagline: 'Tranquil Slopes & Open Alpine Pastures',
    elevationSummary: '7,400 ft Southern Spur',
    character: 'Custom Residential Plots, Stone Houses & Private Orchards',
    description:
      'Set along peaceful terraced slopes near Ayubia, Khanspur is prized by discerning families and custom home builders seeking generous land parcels and unhurried mountain solitude.',
    highlights: [
      'Generous Terraced Land Parcels for Bespoke Villas',
      'Peaceful Low-Density Residential Neighborhoods',
      'Open Valley Sightlines & Gentle Forest Walks',
      'Strong Long-Term Land Appreciation Fundamentals',
    ],
    coordinates3D: { x: 2.8, y: 2.2, z: 3.6 },
    mapPinPercent: { left: '35%', top: '74%' },
    palette: ['#16382E', '#C7A66A', '#102620'],
  },
  {
    slug: 'bara-gali',
    name: 'Bara Gali',
    tagline: 'Northern Gateway of Pine & Emerald Valleys',
    elevationSummary: '7,700 ft Northern Ridge',
    character: 'Boutique Hospitality Estates, Retreats & Viewpoint Villas',
    description:
      'Situated on the northern side of the Galiyat range toward Abbottabad, Bara Gali blends milder winter accessibility with sweeping emerald ridges and institutional tranquility.',
    highlights: [
      'Seamless Connectivity Toward Abbottabad & Hazara Motorway',
      'Expansive Ridge Plots Suitable for Boutique Resorts',
      'Lush Summer Greenery & Mild Mountain Climate',
      'Panoramic Northern Valley Overlooks',
    ],
    coordinates3D: { x: -5.4, y: 2.5, z: -3.4 },
    mapPinPercent: { left: '18%', top: '30%' },
    palette: ['#123027', '#C7A66A', '#1B4237'],
  },
];

export const INITIAL_SAMPLE_PROPERTIES: Omit<PropertyRecord, 'id'>[] = [
  {
    slug: 'governors-ridge-sovereign-villa',
    referenceId: 'GE-NG-101',
    title: 'Luxury Mountain Villa',
    subtitle: 'SAMPLE PROPERTY — Bespoke 4-Bedroom Stone & Deodar Estate in Wholdings',
    locationSlug: 'wholdings',
    locationName: 'Wholdings',
    propertyType: 'Luxury Mountain Villas',
    pricePkr: 'PKR 45,000,000',
    priceNumeric: 45,
    bedrooms: 4,
    bathrooms: 4,
    areaSqFt: 5000,
    areaLabel: '5000 Sq Ft',
    availabilityStatus: 'Available',
    isFeatured: true,
    isSample: true,
    elevationFt: 'Upper Ridge Sanctuary',
    description:
      'SAMPLE PROPERTY FOR DEMONSTRATION: Perched on a secluded pine-clad spur in Wholdings, this Luxury Mountain Villa harmonizes hand-dressed Himalayan slate with kiln-dried deodar timber and double-height thermal glass curtain walls. Features heated viewing decks, cobblestone driveway, and uninterrupted sightlines across the misty Galiyat peaks.',
    architecturalNotes:
      'Engineered with seismic-grade reinforced concrete foundations, hydronic underfloor heating, rainwater harvesting cisterns, and dedicated staff quarters.',
    amenities: [
      'Hydronic Underfloor Heating',
      'Double-Height Stone Fireplace',
      'Panoramic Cedar Viewing Deck',
      'Private Heated Conservatory',
      'Backup Solar & Hybrid Generator System',
      'Dedicated Staff & Security Quarters',
      'Cobblestone Heated Driveway',
      'Private Forest Trail Access',
    ],
    galleryVisuals: [
      {
        id: 'ng-101-1',
        title: 'Twilight Exterior Elevation',
        caption: 'Warm architectural lighting across hand-cut stone and cedar cantilevers.',
        sceneType: 'villa-sunset',
        palette: ['#102B24', '#C7A66A', '#101614'],
      },
      {
        id: 'ng-101-2',
        title: 'Double-Height Great Hall',
        caption: 'Floor-to-ceiling thermal glass framing the misty deodar forest canopy.',
        sceneType: 'interior-hearth',
        palette: ['#1A382F', '#D9B87C', '#101614'],
      },
      {
        id: 'ng-101-3',
        title: 'Morning Cloud Inversion Deck',
        caption: 'Cantilevered timber terrace suspended above the valley mist.',
        sceneType: 'penthouse-clouds',
        palette: ['#14332A', '#C7A66A', '#0D1714'],
      },
    ],
    coordinates: { x: -4.2, z: -1.4 },
  },
  {
    slug: 'deodar-mist-alpine-cottage',
    referenceId: 'GE-DG-102',
    title: 'Wooden Cottage',
    subtitle: 'SAMPLE PROPERTY — Handcrafted 2-Bedroom Woodland Sanctuary in Dunga Gali',
    locationSlug: 'dunga-gali',
    locationName: 'Dunga Gali',
    propertyType: 'Wooden Cottages',
    pricePkr: 'PKR 18,000,000',
    priceNumeric: 18,
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 2500,
    areaLabel: '2500 Sq Ft',
    availabilityStatus: 'Available',
    isFeatured: true,
    isSample: true,
    elevationFt: 'Pipeline Forest Belt',
    description:
      'SAMPLE PROPERTY FOR DEMONSTRATION: Tucked among century-old pines in Dunga Gali near the historic Pipeline Track, this steep-pitched alpine Wooden Cottage celebrates authentic mountain craftsmanship with aromatic cedar interiors and a wrap-around forest veranda.',
    architecturalNotes:
      'Constructed with treated structural timber frames, steep snow-shedding roofing, acoustic thermal insulation, and natural river-stone retaining walls.',
    amenities: [
      'Authentic Cedar & Pine Joinery',
      'Cast-Iron Wood-Burning Hearth',
      'Wrap-Around Forest Veranda',
      'Outdoor Stone Firepit Lounge',
      'Dual-Source Water Storage & Filtration',
      'Private Gated Driveway',
    ],
    galleryVisuals: [
      {
        id: 'dg-102-1',
        title: 'A-Frame Gables in Morning Fog',
        caption: 'Steep cedar gables glowing softly amidst Dunga Gali pine mist.',
        sceneType: 'cottage-mist',
        palette: ['#123329', '#C7A66A', '#0E1815'],
      },
      {
        id: 'dg-102-2',
        title: 'Timber Hearth & Reading Loft',
        caption: 'Warm natural wood grain and bespoke artisan furniture.',
        sceneType: 'interior-hearth',
        palette: ['#1E3E34', '#D5B272', '#101614'],
      },
    ],
    coordinates: { x: -1.8, z: 1.8 },
  },
  {
    slug: 'ayubia-mountain-view-house',
    referenceId: 'GE-AY-103',
    title: 'Mountain View House',
    subtitle: 'SAMPLE PROPERTY — 3-Bedroom Panoramic Glass & Timber Residence in Ayubia',
    locationSlug: 'ayubia',
    locationName: 'Ayubia',
    propertyType: 'Mountain View Houses',
    pricePkr: 'PKR 32,000,000',
    priceNumeric: 32,
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 3500,
    areaLabel: '3500 Sq Ft',
    availabilityStatus: 'Available',
    isFeatured: true,
    isSample: true,
    elevationFt: 'National Park Overlook',
    description:
      'SAMPLE PROPERTY FOR DEMONSTRATION: Commanding unobstructed views across the evergreen canopy of Ayubia National Park, this 3-bedroom Mountain View House features double-height sunset glazing, manicured alpine gardens, and private terrace dining.',
    architecturalNotes:
      'Reinforced hillside foundation with double-glazed acoustic thermal windows, central heating, and backup solar power.',
    amenities: [
      'Panoramic National Park Sightlines',
      'Double-Height Glass Living Pavilion',
      'Private Landscaped Pine Lawn',
      'Centralized Heating & Climate Control',
      'Covered Heated Parking Bay',
      '24/7 Estate Security',
    ],
    galleryVisuals: [
      {
        id: 'ay-103-1',
        title: 'Sunset Glass Facade at Ayubia',
        caption: 'Floor-to-ceiling glazing overlooking the protected conifer valley.',
        sceneType: 'glass-house',
        palette: ['#15382E', '#C7A66A', '#101614'],
      },
      {
        id: 'ay-103-2',
        title: 'Mountain View Living Salon',
        caption: 'Contemporary alpine minimalism with warm brass and oak detailing.',
        sceneType: 'interior-hearth',
        palette: ['#193B31', '#C7A66A', '#0F1513'],
      },
    ],
    coordinates: { x: 1.2, z: 2.4 },
  },
  {
    slug: 'changla-summit-glass-house',
    referenceId: 'GE-CG-104',
    title: 'Changla Summit Cantilevered Villa',
    subtitle: 'SAMPLE PROPERTY — 5-Bedroom Contemporary Cliffside Residence at High Elevation',
    locationSlug: 'changla-gali',
    locationName: 'Changla Gali',
    propertyType: 'Luxury Mountain Villas',
    pricePkr: 'PKR 85,000,000',
    priceNumeric: 85,
    bedrooms: 5,
    bathrooms: 6,
    areaSqFt: 6800,
    areaLabel: '6800 Sq Ft',
    availabilityStatus: 'Available',
    isFeatured: true,
    isSample: true,
    elevationFt: 'High Summit Crest',
    description:
      'SAMPLE PROPERTY FOR DEMONSTRATION: Poised along the dramatic high ridge of Changla Gali, this architectural tour de force projects over the mountainside on structural steel and stone piers.',
    architecturalNotes:
      'Structural steel frame anchored to bedrock with low-emissivity argon-filled triple glazing and snow-load engineered roof decks.',
    amenities: [
      '270-Degree Panoramic Glass Pavilion',
      'Private Finnish Cedar Sauna',
      'Heated Driveway & Snow-Melt System',
      'Smart Home Lighting & Climate Automation',
    ],
    galleryVisuals: [
      {
        id: 'cg-104-1',
        title: 'Cantilevered Cliffside Structure',
        caption: 'Dramatic architectural silhouette suspended above the Changla Gali clouds.',
        sceneType: 'penthouse-clouds',
        palette: ['#0F2922', '#E2C389', '#101614'],
      },
    ],
    coordinates: { x: 4.2, z: -0.8 },
  },
  {
    slug: 'cloudline-penthouse-residences',
    referenceId: 'GE-NG-105',
    title: 'Governor’s Ridge Duplex Penthouse',
    subtitle: 'SAMPLE PROPERTY — 3-Bedroom Serviced Alpine Apartment in Wholdings',
    locationSlug: 'wholdings',
    locationName: 'Wholdings',
    propertyType: 'Luxury Apartments',
    pricePkr: 'PKR 28,000,000',
    priceNumeric: 28,
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 2850,
    areaLabel: '2850 Sq Ft',
    availabilityStatus: 'Available',
    isFeatured: false,
    isSample: true,
    elevationFt: 'Wholdings Ridge',
    description:
      'SAMPLE PROPERTY FOR DEMONSTRATION: Offering lock-and-leave convenience in the heart of Wholdings, complete with concierge management, heated indoor parking, and private sky-terrace dining.',
    architecturalNotes:
      'Low-density boutique building with winter-rated elevators and centralized backup power.',
    amenities: [
      '24/7 Concierge & Estate Security',
      'Private Heated Sky Terrace',
      'Reserved Underground Heated Parking',
      'Turnkey Rental Management Option',
    ],
    galleryVisuals: [
      {
        id: 'ng-105-1',
        title: 'Skyline Terrace Above Wholdings',
        caption: 'Panoramic glass balustrade overlooking the pine valley.',
        sceneType: 'penthouse-clouds',
        palette: ['#15382E', '#C7A66A', '#101614'],
      },
    ],
    coordinates: { x: -3.6, z: -2.1 },
  },
  {
    slug: 'khanspur-snowline-estate-plot',
    referenceId: 'GE-KP-106',
    title: 'Khanspur Snowline Terraced Estate Plot',
    subtitle: 'SAMPLE PROPERTY — 4-Kanal Developed Residential Land Parcel with Mature Pines',
    locationSlug: 'khanspur',
    locationName: 'Khanspur',
    propertyType: 'Residential Plots',
    pricePkr: 'PKR 38,000,000',
    priceNumeric: 38,
    bedrooms: 0,
    bathrooms: 0,
    areaSqFt: 18000,
    areaLabel: '18000 Sq Ft (4 Kanal)',
    availabilityStatus: 'Available',
    isFeatured: false,
    isSample: true,
    elevationFt: 'Southern Terraced Spur',
    description:
      'SAMPLE PROPERTY FOR DEMONSTRATION: A rare contiguous 4-Kanal terraced estate parcel in Khanspur featuring natural stone retaining walls, private blacktop road approach, and unobstructed southern valley views.',
    architecturalNotes:
      'Topological survey completed; retaining perimeter walls in place; electricity and spring-water line adjacent to boundary.',
    amenities: [
      'Completed Stone Retaining Terraces',
      'Direct Blacktop Road Frontage',
      'Mature Deodar Trees on Perimeter',
      'Southern Sun Exposure Year-Round',
    ],
    galleryVisuals: [
      {
        id: 'kp-106-1',
        title: 'Terraced Forest Land Parcel',
        caption: 'Sun-dappled ridge land overlooking the emerald valleys of Khanspur.',
        sceneType: 'pine-plot',
        palette: ['#16382E', '#C7A66A', '#101614'],
      },
    ],
    coordinates: { x: 2.8, z: 3.6 },
  },
  {
    slug: 'ayubia-promenade-commercial-plaza',
    referenceId: 'GE-AY-107',
    title: 'The Alpine Arcade — Commercial Pavilion',
    subtitle: 'SAMPLE PROPERTY — Prime Hospitality & Retail Frontage in Ayubia Town Center',
    locationSlug: 'ayubia',
    locationName: 'Ayubia',
    propertyType: 'Commercial Properties',
    pricePkr: 'PKR 65,000,000',
    priceNumeric: 65,
    bedrooms: 2,
    bathrooms: 5,
    areaSqFt: 5600,
    areaLabel: '5600 Sq Ft',
    availabilityStatus: 'Available',
    isFeatured: false,
    isSample: true,
    elevationFt: 'Main Tourism Corridor',
    description:
      'SAMPLE PROPERTY FOR DEMONSTRATION: Purpose-built for an artisanal mountain roastery, fine-dining restaurant, or luxury outdoor outfitter along the main Galiyat tourism corridor in Ayubia.',
    architecturalNotes:
      'Three-story commercial structure with rooftop dining terrace and dedicated customer parking bay.',
    amenities: [
      'Rooftop Panorama Dining Terrace',
      'High-Footfall Main Road Frontage',
      'Dedicated Visitor Parking Forecourt',
    ],
    galleryVisuals: [
      {
        id: 'ay-107-1',
        title: 'Timber & Stone Commercial Facade',
        caption: 'Refined alpine commercial architecture designed for luxury hospitality brands.',
        sceneType: 'commercial-ridge',
        palette: ['#173D32', '#C7A66A', '#101614'],
      },
    ],
    coordinates: { x: 1.5, z: 2.1 },
  },
  {
    slug: 'bara-gali-heritage-retreat-hotel',
    referenceId: 'GE-BG-108',
    title: 'Emerald Crest Boutique Mountain Resort',
    subtitle: 'SAMPLE PROPERTY — 12-Suite Operational Luxury Hospitality Estate in Bara Gali',
    locationSlug: 'bara-gali',
    locationName: 'Bara Gali',
    propertyType: 'Resorts and Hotels',
    pricePkr: 'PKR 140,000,000',
    priceNumeric: 140,
    bedrooms: 12,
    bathrooms: 14,
    areaSqFt: 14500,
    areaLabel: '14500 Sq Ft',
    availabilityStatus: 'Available',
    isFeatured: true,
    isSample: true,
    elevationFt: 'Northern Emerald Ridge',
    description:
      'SAMPLE PROPERTY FOR DEMONSTRATION: Spanning lush terraced lawns in Bara Gali, Emerald Crest is a boutique 12-suite mountain resort concept featuring private forest cabanas and a glass-enclosed wellness pavilion.',
    architecturalNotes:
      'Master-planned hospitality enclave with central reception lodge, standalone cedar chalets, and commercial kitchen.',
    amenities: [
      '12 Luxury Mountain View Suites',
      'Glass-Enclosed Fine Dining Pavilion',
      'Alpine Wellness & Steam Sanctuary',
      'Manicured Terraced Pine Lawns',
    ],
    galleryVisuals: [
      {
        id: 'bg-108-1',
        title: 'Resort Courtyard at Dusk',
        caption: 'Lantern-lit pathways linking private cedar chalets along the northern ridge.',
        sceneType: 'resort-twilight',
        palette: ['#123027', '#C7A66A', '#101614'],
      },
    ],
    coordinates: { x: -5.4, z: -3.4 },
  },
];

export const TOURISM_LANDMARKS: TourismLandmark[] = [
  {
    id: 'wholdings-scenery',
    name: 'Wholdings Mountain Scenery',
    region: 'Wholdings',
    category: 'Alpine Ridge & Forest Sanctuary',
    summary:
      'Mist-draped deodar cedar forests, historic ridge walks, and sweeping views across the western Himalayan foothills.',
    experienceNotes:
      'Visitors experience dramatic cloud inversions drifting through towering pine canopies, colonial-era wooden architecture, and tranquil mountain air.',
    sceneType: 'villa-sunset',
    palette: ['#102B24', '#C7A66A', '#101614'],
  },
  {
    id: 'ayubia-national-park',
    name: 'Ayubia National Park',
    region: 'Ayubia',
    category: 'Protected Temperate Conifer Forest',
    summary:
      'A protected sanctuary of western Himalayan broadleaf and coniferous forests home to diverse alpine flora, birdlife, and shaded woodland trails.',
    experienceNotes:
      'Explore centuries-old deodar, blue pine, and silver fir trees along well-preserved conservation footpaths.',
    sceneType: 'pine-plot',
    palette: ['#173D32', '#C7A66A', '#0E1815'],
  },
  {
    id: 'pipeline-track',
    name: 'Dunga Gali Pipeline Track',
    region: 'Dunga Gali to Ayubia',
    category: 'Historic Forest Promenade',
    summary:
      'Follow the scenic contour trail originally laid alongside the historic water pipeline connecting Dunga Gali and Ayubia.',
    experienceNotes:
      'Level cliffside forest walk shaded by overhanging pines with constant views into the deep emerald valleys below.',
    sceneType: 'cottage-mist',
    palette: ['#14362D', '#D4B475', '#101614'],
  },
  {
    id: 'mukshpuri-top',
    name: 'Mukshpuri Top',
    region: 'Wholdings / Dunga Gali',
    category: 'High-Altitude Meadow Summit',
    summary:
      'One of the most celebrated summit meadows in the Galiyat range, crowned by open grassy slopes and panoramic horizon views.',
    experienceNotes:
      'Accessible via forest trails through pine and oak groves, rewarding trekkers with expansive vistas across Kashmir and the Indus basin.',
    sceneType: 'penthouse-clouds',
    palette: ['#102B24', '#E2C389', '#0D1714'],
  },
  {
    id: 'miranjani-trek',
    name: 'Miranjani Trek',
    region: 'Wholdings',
    category: 'Premier Galiyat Summit Trail',
    summary:
      'The highest peak in the Galiyat region, offering commanding ridge-line perspectives and unspoiled alpine wilderness.',
    experienceNotes:
      'On clear days, the summit ridge reveals distant snow-capped ranges and the dramatic topography of northern Wholdings.',
    sceneType: 'glass-house',
    palette: ['#0F2922', '#C7A66A', '#101614'],
  },
  {
    id: 'himalayan-pine-forests',
    name: 'Deodar & Blue Pine Forests',
    region: 'Across Galiyat',
    category: 'Botanical Heritage',
    summary:
      'Dense evergreen canopies that filter golden sunlight into cathedral-like beams during autumn evenings and winter snowfalls.',
    experienceNotes:
      'The signature scent of cedar wood and pine needles defines the sensory atmosphere of every estate in Galiyat.',
    sceneType: 'cottage-mist',
    palette: ['#123329', '#C7A66A', '#101614'],
  },
  {
    id: 'galiyat-viewpoints',
    name: 'Cloud-Sea Ridge Viewpoints',
    region: 'Changla Gali & Wholdings',
    category: 'Scenic Overlooks',
    summary:
      'Elevated escarpments where monsoon and winter clouds pool in the valleys below like a tranquil silver ocean.',
    experienceNotes:
      'Prime vantage points for sunrise photography, quiet contemplation, and bespoke cliffside architecture.',
    sceneType: 'penthouse-clouds',
    palette: ['#15382E', '#D8B77A', '#101614'],
  },
  {
    id: 'luxury-resorts-cottages',
    name: 'Boutique Mountain Resorts & Retreats',
    region: 'Wholdings, Ayubia & Bara Gali',
    category: 'Architectural Hospitality',
    summary:
      'Intimate timber-and-stone lodges blending warm Wholdings mountain hospitality with refined contemporary comfort.',
    experienceNotes:
      'Fireside lounges, cedar-lined suites, and private dining terraces overlooking the mist.',
    sceneType: 'resort-twilight',
    palette: ['#123027', '#C7A66A', '#101614'],
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Golden Hour Over Governor’s Ridge',
    category: 'Sunrise & Golden Hour',
    location: 'Wholdings',
    caption: 'Warm evening sunbeams piercing through Himalayan deodar cedars.',
    aspect: 'wide',
    sceneType: 'villa-sunset',
    palette: ['#102B24', '#C7A66A', '#101614'],
  },
  {
    id: 'gal-2',
    title: 'The Sovereign Villa Exterior',
    category: 'Luxury Villas',
    location: 'Wholdings',
    caption: 'Hand-cut mountain slate and cantilevered cedar terraces.',
    aspect: 'tall',
    sceneType: 'glass-house',
    palette: ['#14332A', '#D5B272', '#101614'],
  },
  {
    id: 'gal-3',
    title: 'Dunga Gali A-Frame in Morning Fog',
    category: 'Wooden Cottages',
    location: 'Dunga Gali',
    caption: 'Steep timber gables surrounded by drifting valley mist.',
    aspect: 'square',
    sceneType: 'cottage-mist',
    palette: ['#123329', '#C7A66A', '#0E1815'],
  },
  {
    id: 'gal-4',
    title: 'Double-Height Stone Hearth Lounge',
    category: 'Interior Architecture',
    location: 'Wholdings',
    caption: 'Bespoke alpine interior with floor-to-ceiling forest glazing.',
    aspect: 'wide',
    sceneType: 'interior-hearth',
    palette: ['#1A382F', '#C7A66A', '#101614'],
  },
  {
    id: 'gal-5',
    title: 'Snow-Draped Summit Pines at Changla',
    category: 'Snow & Winter',
    location: 'Changla Gali',
    caption: 'Pristine winter blanket across the high-altitude ridge corridor.',
    aspect: 'tall',
    sceneType: 'penthouse-clouds',
    palette: ['#173830', '#DCE5E0', '#101614'],
  },
  {
    id: 'gal-6',
    title: 'Ayubia Canopy & Cloud Sea',
    category: 'Mountain Landscapes',
    location: 'Ayubia',
    caption: 'Endless evergreen ridges fading into the Himalayan horizon.',
    aspect: 'wide',
    sceneType: 'pine-plot',
    palette: ['#16382E', '#C7A66A', '#101614'],
  },
  {
    id: 'gal-7',
    title: 'Emerald Crest Resort Lantern Courtyard',
    category: 'Luxury Villas',
    location: 'Bara Gali',
    caption: 'Evening architectural illumination across private resort chalets.',
    aspect: 'square',
    sceneType: 'resort-twilight',
    palette: ['#123027', '#C7A66A', '#101614'],
  },
  {
    id: 'gal-8',
    title: 'Master Suite Cedar Balcony',
    category: 'Interior Architecture',
    location: 'Dunga Gali',
    caption: 'Private morning tea terrace suspended in the treetops.',
    aspect: 'square',
    sceneType: 'interior-hearth',
    palette: ['#1E3E34', '#C7A66A', '#101614'],
  },
];

export const SAMPLE_TESTIMONIALS = [
  {
    id: 'test-1',
    isSample: true,
    quote:
      'The private site inspection in Wholdings was organized with remarkable precision. Every topographical detail, access road contour, and architectural feasibility note was presented transparently before we shortlisted our family cottage parcel.',
    author: 'Tariq Mahmood & Family',
    role: 'Private Estate Inquirer — Islamabad',
    context: 'Evaluated Ridge Parcel in Wholdings (Sample Demonstration Feedback)',
  },
  {
    id: 'test-2',
    isSample: true,
    quote:
      'Exploring Dunga Gali and Ayubia through the 3D terrain overview helped our overseas family compare elevation, winter snow exposure, and proximity to the Pipeline Track before flying in for an in-person viewing.',
    author: 'Dr. Saira Kamal',
    role: 'Overseas Property Buyer — London & Lahore',
    context: 'Shortlisted Residence in Ayubia (Sample Demonstration Feedback)',
  },
  {
    id: 'test-3',
    isSample: true,
    quote:
      'What sets Wholdings apart is their architectural sensibility. Rather than pushing generic concrete structures, their portfolio focuses on low-impact stone and deodar timber residences that respect the mountain ecology.',
    author: 'Kamran Sikandar',
    role: 'Hospitality Investor — Karachi',
    context: 'Consulted on Boutique Retreat Land in Bara Gali (Sample Demonstration Feedback)',
  },
];

export const FAQ_ITEMS = [
  {
    question: 'How can I inquire about a property or schedule a private viewing?',
    answer:
      'You can submit an inquiry directly on any property page, use the Investment Inquiry form, or click the WhatsApp Inquiry button (+92 331 2345678). Every WhatsApp inquiry automatically pre-fills the Property Name, Location, and Reference ID so our advisory desk can coordinate a private on-site viewing in Galiyat.',
  },
  {
    question: 'Which locations in the Galiyat region are covered?',
    answer:
      'We specialize exclusively with Wholdings’s Galiyat mountain corridor, covering Wholdings, Dunga Gali, Ayubia, Changla Gali, Khanspur, Bara Gali, and select surrounding ridge estates.',
  },
  {
    question: 'Are the properties shown on the platform verified real listings or sample demonstrations?',
    answer:
      'In accordance with our strict transparency standards, all demonstration listings pre-loaded in this showcase are clearly labeled as SAMPLE PROPERTY. Property owners and administrators can add, edit, or update live listings through the protected Admin Dashboard.',
  },
  {
    question: 'How can I list my mountain villa, cottage, or land parcel with Wholdings?',
    answer:
      'Property owners and developers can reach our advisory team via the Contact Us page or WhatsApp with property photographs, land title documentation, and location coordinates. Authorized administrators can also publish listings directly via the Admin Portal.',
  },
  {
    question: 'What should buyers consider regarding mountain construction and utilities in Galiyat?',
    answer:
      'Mountain properties require careful evaluation of slope stability, retaining wall engineering, winter snow-load roofing, hydronic heating insulation, rainwater/spring water storage, and road access during winter months. Our team assists buyers in reviewing these practical parameters during site visits.',
  },
];

export interface CompanyConfig {
  companyName: string;
  tagline: string;
  whatsappNumber: string;
  email: string;
  officeAddress: string;
  advisoryNotice: string;
  aboutHeadline: string;
  aboutStory: string;
}

export const DEFAULT_COMPANY_CONFIG: CompanyConfig = {
  companyName: 'WHOLDINGS',
  tagline: 'Discover Luxury Above the Clouds',
  whatsappNumber: '+92 331 2345678',
  email: 'concierge@wholdings.pk',
  officeAddress: 'Governor’s Ridge Road, Near Pine View Enclave, Wholdings, Khyber Pakhtunkhwa, Wholdings',
  advisoryNotice:
    'All sample properties are clearly marked for demonstration. All company details, WhatsApp numbers, and property portfolios are fully editable via the Admin Panel.',
  aboutHeadline: 'Bringing You Closer to the Mountains',
  aboutStory:
    'Wholdings is a dedicated mountain real estate discovery and private advisory platform focused exclusively on Wholdings, Dunga Gali, Ayubia, Changla Gali, Khanspur, and Bara Gali. We connect discerning families, architectural enthusiasts, and hospitality investors with curated mountain villas, heritage wooden cottages, serviced apartments, and scenic land parcels.',
};
