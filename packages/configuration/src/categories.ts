import { COUNTRIES } from './countries';
import type { CountryCode, LocalizedText } from './types';

const t = (en: string, es: string): LocalizedText => ({ en, es });

export type AttributeType = 'text' | 'number' | 'select' | 'boolean';

export interface CategoryAttribute {
  key: string;
  label: LocalizedText;
  type: AttributeType;
  options?: LocalizedText[];
  required?: boolean;
}

export interface SubcategoryDefinition {
  id: string;
  slug: string;
  names: LocalizedText;
}

export interface CategoryDefinition {
  id: string;
  slug: string;
  names: LocalizedText;
  description: LocalizedText;
  icon: string;
  subcategories: SubcategoryDefinition[];
  attributes: CategoryAttribute[];
  moderationRequired: boolean;
  enabled: boolean;
}

const sub = (id: string, slug: string, en: string, es: string): SubcategoryDefinition => ({
  id,
  slug,
  names: t(en, es),
});

export const CATEGORIES: CategoryDefinition[] = [
  {
    id: 'general', slug: 'general', icon: '📦',
    names: t('General merchandise', 'Artículos generales'),
    description: t('Everyday goods and household items', 'Artículos cotidianos y del hogar'),
    subcategories: [sub('general-other', 'other', 'Other', 'Otro'), sub('general-collectibles', 'collectibles', 'Collectibles', 'Coleccionables')],
    attributes: [], moderationRequired: false, enabled: true,
  },
  {
    id: 'electronics', slug: 'electronics', icon: '💻',
    names: t('Electronics and computers', 'Electrónica y computadoras'),
    description: t('Phones, computers, cameras and accessories', 'Teléfonos, computadoras, cámaras y accesorios'),
    subcategories: [sub('electronics-phones', 'phones', 'Phones', 'Teléfonos'), sub('electronics-computers', 'computers', 'Computers', 'Computadoras'), sub('electronics-accessories', 'accessories', 'Accessories', 'Accesorios')],
    attributes: [
      { key: 'brand', label: t('Brand', 'Marca'), type: 'text' },
      { key: 'condition', label: t('Condition', 'Condición'), type: 'select', options: [t('New', 'Nuevo'), t('Used', 'Usado'), t('For parts', 'Para piezas')] },
    ],
    moderationRequired: false, enabled: true,
  },
  {
    id: 'vehicles', slug: 'vehicles', icon: '🚗',
    names: t('Vehicles and automotive parts', 'Vehículos y repuestos'),
    description: t('Cars, trucks, parts and accessories', 'Autos, camiones, repuestos y accesorios'),
    subcategories: [sub('vehicles-cars', 'cars', 'Cars', 'Autos'), sub('vehicles-trucks', 'trucks', 'Trucks and vans', 'Camiones y furgonetas'), sub('vehicles-parts', 'parts', 'Parts', 'Repuestos')],
    attributes: [
      { key: 'make', label: t('Make', 'Marca'), type: 'text', required: true },
      { key: 'model', label: t('Model', 'Modelo'), type: 'text', required: true },
      { key: 'year', label: t('Year', 'Año'), type: 'number', required: true },
      { key: 'mileage', label: t('Mileage (km)', 'Kilometraje (km)'), type: 'number' },
      { key: 'transmission', label: t('Transmission', 'Transmisión'), type: 'select', options: [t('Automatic', 'Automática'), t('Manual', 'Manual')] },
      { key: 'condition', label: t('Condition', 'Condición'), type: 'select', options: [t('New', 'Nuevo'), t('Used', 'Usado')] },
    ],
    moderationRequired: true, enabled: true,
  },
  {
    id: 'motorcycles', slug: 'motorcycles', icon: '🏍️',
    names: t('Motorcycles', 'Motocicletas'),
    description: t('Motorcycles, scooters and gear', 'Motocicletas, scooters y equipos'),
    subcategories: [sub('motorcycles-bikes', 'bikes', 'Motorcycles', 'Motocicletas'), sub('motorcycles-gear', 'gear', 'Riding gear', 'Equipo de montar')],
    attributes: [
      { key: 'make', label: t('Make', 'Marca'), type: 'text' },
      { key: 'engineSize', label: t('Engine size (cc)', 'Cilindrada (cc)'), type: 'number' },
    ],
    moderationRequired: false, enabled: true,
  },
  {
    id: 'housing', slug: 'housing', icon: '🏠',
    names: t('Housing and real estate', 'Vivienda e inmuebles'),
    description: t('Property for sale and long-term arrangements', 'Propiedades en venta y arrendamientos a largo plazo'),
    subcategories: [sub('housing-house', 'house', 'Houses', 'Casas'), sub('housing-land', 'land', 'Land', 'Terrenos'), sub('housing-commercial', 'commercial', 'Commercial', 'Comercial')],
    attributes: [
      { key: 'bedrooms', label: t('Bedrooms', 'Habitaciones'), type: 'number' },
      { key: 'bathrooms', label: t('Bathrooms', 'Baños'), type: 'number' },
      { key: 'propertyType', label: t('Property type', 'Tipo de propiedad'), type: 'select', options: [t('House', 'Casa'), t('Apartment', 'Apartamento'), t('Land', 'Terreno')] },
      { key: 'approximateLocation', label: t('Approximate location', 'Ubicación aproximada'), type: 'text' },
    ],
    moderationRequired: true, enabled: true,
  },
  {
    id: 'rentals', slug: 'rentals', icon: '🔑',
    names: t('Apartments and rooms for rent', 'Apartamentos y habitaciones en alquiler'),
    description: t('Short and long term rentals', 'Alquileres a corto y largo plazo'),
    subcategories: [sub('rentals-apartment', 'apartments', 'Apartments', 'Apartamentos'), sub('rentals-room', 'rooms', 'Rooms', 'Habitaciones')],
    attributes: [
      { key: 'bedrooms', label: t('Bedrooms', 'Habitaciones'), type: 'number' },
      { key: 'bathrooms', label: t('Bathrooms', 'Baños'), type: 'number' },
      { key: 'rentalFrequency', label: t('Rental frequency', 'Frecuencia de alquiler'), type: 'select', options: [t('Monthly', 'Mensual'), t('Weekly', 'Semanal'), t('Daily', 'Diario')] },
      { key: 'approximateLocation', label: t('Approximate location', 'Ubicación aproximada'), type: 'text' },
    ],
    moderationRequired: true, enabled: true,
  },
  {
    id: 'jobs', slug: 'jobs', icon: '💼',
    names: t('Jobs and employment', 'Empleo y trabajo'),
    description: t('Full-time and part-time positions', 'Puestos de tiempo completo y parcial'),
    subcategories: [sub('jobs-fulltime', 'full-time', 'Full-time', 'Tiempo completo'), sub('jobs-parttime', 'part-time', 'Part-time', 'Medio tiempo')],
    attributes: [
      { key: 'employmentType', label: t('Employment type', 'Tipo de contrato'), type: 'select', options: [t('Permanent', 'Indefinido'), t('Contract', 'Por contrato'), t('Temporary', 'Temporal')] },
      { key: 'compensationRange', label: t('Compensation range', 'Rango salarial'), type: 'text' },
      { key: 'workArrangement', label: t('Work arrangement', 'Modalidad de trabajo'), type: 'select', options: [t('On-site', 'Presencial'), t('Hybrid', 'Híbrido'), t('Remote', 'Remoto')] },
      { key: 'employer', label: t('Employer', 'Empleador'), type: 'text' },
    ],
    moderationRequired: true, enabled: true,
  },
  {
    id: 'freelance', slug: 'freelance', icon: '🧑‍💻',
    names: t('Freelance opportunities', 'Oportunidades freelance'),
    description: t('Short-term projects and gigs', 'Proyectos y trabajos por encargo'),
    subcategories: [sub('freelance-remote', 'remote', 'Remote', 'Remoto'), sub('freelance-local', 'local', 'Local', 'Local')],
    attributes: [{ key: 'skill', label: t('Skill required', 'Habilidad requerida'), type: 'text' }],
    moderationRequired: false, enabled: true,
  },
  {
    id: 'professional', slug: 'professional', icon: '🧾',
    names: t('Professional services', 'Servicios profesionales'),
    description: t('Services offered by qualified professionals', 'Servicios ofrecidos por profesionales'),
    subcategories: [sub('professional-consulting', 'consulting', 'Consulting', 'Consultoría'), sub('professional-repairs', 'repairs', 'Repairs', 'Reparaciones')],
    attributes: [{ key: 'qualification', label: t('Qualification', 'Calificación'), type: 'text' }],
    moderationRequired: false, enabled: true,
  },
  {
    id: 'home-improvement', slug: 'home-improvement', icon: '🛠️',
    names: t('Home improvement', 'Mejoras del hogar'),
    description: t('Tools, materials and renovation services', 'Herramientas, materiales y renovación'),
    subcategories: [sub('home-tools', 'tools', 'Tools', 'Herramientas'), sub('home-materials', 'materials', 'Materials', 'Materiales')],
    attributes: [], moderationRequired: false, enabled: true,
  },
  {
    id: 'furniture', slug: 'furniture', icon: '🛋️',
    names: t('Furniture and appliances', 'Muebles y electrodomésticos'),
    description: t('Home furnishings and large appliances', 'Muebles y electrodomésticos grandes'),
    subcategories: [sub('furniture-indoor', 'indoor', 'Indoor furniture', 'Muebles de interior'), sub('furniture-appliances', 'appliances', 'Appliances', 'Electrodomésticos')],
    attributes: [{ key: 'condition', label: t('Condition', 'Condición'), type: 'select', options: [t('New', 'Nuevo'), t('Used', 'Usado')] }],
    moderationRequired: false, enabled: true,
  },
  {
    id: 'clothing', slug: 'clothing', icon: '👕',
    names: t('Clothing and accessories', 'Ropa y accesorios'),
    description: t('Apparel, shoes and personal accessories', 'Ropa, zapatos y accesorios personales'),
    subcategories: [sub('clothing-adults', 'adults', 'Adults', 'Adultos'), sub('clothing-children', 'children', 'Children', 'Niños')],
    attributes: [{ key: 'size', label: t('Size', 'Talla'), type: 'text' }],
    moderationRequired: false, enabled: true,
  },
  {
    id: 'agricultural', slug: 'agricultural', icon: '🚜',
    names: t('Agricultural equipment', 'Equipos agrícolas'),
    description: t('Farm machinery, tools and livestock supplies', 'Maquinaria agrícola, herramientas y suministros'),
    subcategories: [sub('agricultural-machinery', 'machinery', 'Machinery', 'Maquinaria'), sub('agricultural-supplies', 'supplies', 'Supplies', 'Insumos')],
    attributes: [], moderationRequired: false, enabled: true,
  },
  {
    id: 'business', slug: 'business', icon: '🏢',
    names: t('Business equipment', 'Equipos comerciales'),
    description: t('Office and small-business equipment', 'Equipos de oficina y pequeños negocios'),
    subcategories: [sub('business-office', 'office', 'Office', 'Oficina'), sub('business-retail', 'retail', 'Retail', 'Comercio')],
    attributes: [], moderationRequired: false, enabled: true,
  },
  {
    id: 'community', slug: 'community', icon: '📣',
    names: t('Community announcements', 'Anuncios comunitarios'),
    description: t('Notices, lost pets and local information', 'Avisos, mascotas perdidas e información local'),
    subcategories: [sub('community-notices', 'notices', 'Notices', 'Avisos'), sub('community-classes', 'classes', 'Classes and workshops', 'Clases y talleres')],
    attributes: [], moderationRequired: false, enabled: true,
  },
  {
    id: 'events', slug: 'events', icon: '🎟️',
    names: t('Events', 'Eventos'),
    description: t('Public gatherings, performances and meetups', 'Eventos públicos, presentaciones y encuentros'),
    subcategories: [sub('events-music', 'music', 'Music', 'Música'), sub('events-sports', 'sports', 'Sports', 'Deportes')],
    attributes: [{ key: 'eventDate', label: t('Event date', 'Fecha del evento'), type: 'text' }],
    moderationRequired: false, enabled: true,
  },
  {
    id: 'free', slug: 'free', icon: '🎁',
    names: t('Free items', 'Artículos gratis'),
    description: t('Items offered at no cost', 'Artículos que se regalan'),
    subcategories: [sub('free-giveaway', 'giveaway', 'Giveaway', 'Se regala')],
    attributes: [], moderationRequired: false, enabled: true,
  },
  {
    id: 'wanted', slug: 'wanted', icon: '🔎',
    names: t('Wanted listings', 'Se busca'),
    description: t('Requests for specific items or services', 'Solicitudes de artículos o servicios'),
    subcategories: [sub('wanted-items', 'items', 'Items', 'Artículos'), sub('wanted-services', 'services', 'Services', 'Servicios')],
    attributes: [], moderationRequired: false, enabled: true,
  },
  {
    id: 'lost-found', slug: 'lost-found', icon: '🗝️',
    names: t('Lost and found', 'Perdidos y encontrados'),
    description: t('Recover lost property or report found items', 'Recuperar objetos perdidos o reportar hallazgos'),
    subcategories: [sub('lost-found-lost', 'lost', 'Lost', 'Perdido'), sub('lost-found-found', 'found', 'Found', 'Encontrado')],
    attributes: [], moderationRequired: false, enabled: true,
  },
  {
    id: 'pets', slug: 'pets', icon: '🐕',
    names: t('Pets and pet supplies', 'Mascotas y suministros'),
    description: t('Animals, accessories and care products', 'Animales, accesorios y productos de cuidado'),
    subcategories: [sub('pets-dogs', 'dogs', 'Dogs', 'Perros'), sub('pets-cats', 'cats', 'Cats', 'Gatos'), sub('pets-supplies', 'supplies', 'Supplies', 'Suministros')],
    attributes: [
      { key: 'animalType', label: t('Animal type', 'Tipo de animal'), type: 'select', options: [t('Dog', 'Perro'), t('Cat', 'Gato'), t('Other', 'Otro')] },
      { key: 'age', label: t('Age', 'Edad'), type: 'text' },
    ],
    moderationRequired: false, enabled: true,
  },
  {
    id: 'baby-kids', slug: 'baby-kids', icon: '🧸',
    names: t('Baby and kids', 'Bebés y niños'),
    description: t('Children’s clothing, gear and toys', 'Ropa, equipos y juguetes infantiles'),
    subcategories: [sub('baby-clothing', 'clothing', 'Baby clothing', 'Ropa de bebé'), sub('kids-gear', 'gear', 'Strollers and car seats', 'Carriolas y sillas de auto')],
    attributes: [{ key: 'ageRange', label: t('Age range', 'Rango de edad'), type: 'text' }],
    moderationRequired: false, enabled: true,
  },
  {
    id: 'sports-outdoor', slug: 'sports-outdoor', icon: '⚽',
    names: t('Sports and outdoor', 'Deportes y aire libre'),
    description: t('Equipment for fitness, team sports and outdoor activities', 'Equipos para fitness, deportes de equipo y actividades al aire libre'),
    subcategories: [sub('sports-fitness', 'fitness', 'Fitness', 'Fitness'), sub('sports-team', 'team', 'Team sports', 'Deportes de equipo'), sub('sports-outdoor-gear', 'outdoor', 'Outdoor gear', 'Equipo de exterior')],
    attributes: [{ key: 'sportType', label: t('Sport', 'Deporte'), type: 'text' }],
    moderationRequired: false, enabled: true,
  },
  {
    id: 'musical-instruments', slug: 'musical-instruments', icon: '🎸',
    names: t('Musical instruments', 'Instrumentos musicales'),
    description: t('Instruments, amplifiers and studio equipment', 'Instrumentos, amplificadores y equipos de estudio'),
    subcategories: [sub('music-string', 'string', 'String instruments', 'Instrumentos de cuerda'), sub('music-studio', 'studio', 'Studio gear', 'Equipo de estudio')],
    attributes: [{ key: 'instrumentType', label: t('Instrument type', 'Tipo de instrumento'), type: 'text' }],
    moderationRequired: false, enabled: true,
  },
  {
    id: 'books-media', slug: 'books-media', icon: '📚',
    names: t('Books, films and games', 'Libros, películas y juegos'),
    description: t('Printed media, film, music and video games', 'Libros, películas, música y videojuegos'),
    subcategories: [sub('media-books', 'books', 'Books', 'Libros'), sub('media-games', 'games', 'Video games', 'Videojuegos'), sub('media-music', 'music', 'Music', 'Música')],
    attributes: [{ key: 'format', label: t('Format', 'Formato'), type: 'text' }],
    moderationRequired: false, enabled: true,
  },
  {
    id: 'marine-boating', slug: 'marine-boating', icon: '⛵',
    names: t('Marine and boating', 'Embarcaciones y artes marinas'),
    description: t('Boats, outboard motors and marine supplies', 'Botes, motores fuera de borda y suministros marinos'),
    subcategories: [sub('marine-boats', 'boats', 'Boats', 'Botes'), sub('marine-parts', 'parts', 'Marine parts', 'Repuestos marinos')],
    attributes: [
      { key: 'vesselType', label: t('Vessel type', 'Tipo de embarcación'), type: 'text' },
      { key: 'lengthFeet', label: t('Length (ft)', 'Eslora (pies)'), type: 'number' },
    ],
    moderationRequired: true, enabled: true,
  },
  {
    id: 'travel-tours', slug: 'travel-tours', icon: '✈️',
    names: t('Travel and tours', 'Viajes y excursiones'),
    description: t('Local tours, stays and transport offers', 'Excursiones locales, alojamiento y ofertas de transporte'),
    subcategories: [sub('travel-tours-local', 'tours', 'Local tours', 'Excursiones locales'), sub('travel-stays', 'stays', 'Stays', 'Alojamiento')],
    attributes: [{ key: 'travelDate', label: t('Travel date', 'Fecha de viaje'), type: 'text' }],
    moderationRequired: false, enabled: true,
  },
  {
    id: 'health-beauty', slug: 'health-beauty', icon: '💇',
    names: t('Health and beauty', 'Salud y belleza'),
    description: t('Personal care, salon services and wellness items', 'Cuidado personal, servicios de salón y bienestar'),
    subcategories: [sub('beauty-products', 'products', 'Products', 'Productos'), sub('beauty-services', 'services', 'Salon services', 'Servicios de salón')],
    attributes: [], moderationRequired: false, enabled: true,
  },
  {
    id: 'construction', slug: 'construction', icon: '🧱',
    names: t('Construction materials', 'Materiales de construcción'),
    description: t('Building supplies, tools and finishes', 'Materiales de construcción, herramientas y acabados'),
    subcategories: [sub('construction-supplies', 'supplies', 'Building supplies', 'Materiales'), sub('construction-finishes', 'finishes', 'Finishes', 'Acabados')],
    attributes: [], moderationRequired: false, enabled: true,
  },
  {
    id: 'toys-games', slug: 'toys-games', icon: '🎲',
    names: t('Toys and games', 'Juguetes y juegos'),
    description: t('Board games, puzzles and collectible toys', 'Juegos de mesa, rompecabezas y juguetes coleccionables'),
    subcategories: [sub('toys-board', 'board-games', 'Board games', 'Juegos de mesa'), sub('toys-collectible', 'collectibles', 'Collectible toys', 'Juguetes coleccionables')],
    attributes: [], moderationRequired: false, enabled: true,
  },
  {
    id: 'art-crafts', slug: 'art-crafts', icon: '🎨',
    names: t('Art and crafts', 'Arte y artesanía'),
    description: t('Handmade goods, art supplies and local crafts', 'Artesanías, materiales de arte y productos locales'),
    subcategories: [sub('art-handmade', 'handmade', 'Handmade', 'Hecho a mano'), sub('art-supplies', 'supplies', 'Art supplies', 'Materiales de arte')],
    attributes: [], moderationRequired: false, enabled: true,
  },
  {
    id: 'sustainability', slug: 'sustainability', icon: '♻️',
    names: t('Recycled and sustainable', 'Reciclado y sostenible'),
    description: t('Refurbished, upcycled and low-waste items', 'Artículos reacondicionados, reciclados y de bajo impacto'),
    subcategories: [sub('sustainability-refurbished', 'refurbished', 'Refurbished', 'Reacondicionado'), sub('sustainability-upcycled', 'upcycled', 'Upcycled', 'Reciclado creativo')],
    attributes: [], moderationRequired: false, enabled: true,
  },
];

export function getCategoryBySlug(slug: string): CategoryDefinition | undefined {
  return CATEGORIES.find((category) => category.slug === slug || category.id === slug);
}

export function isCategoryEnabled(category: CategoryDefinition, countryCode: CountryCode): boolean {
  const config = COUNTRIES[countryCode];
  if (!config || !category.enabled) return false;
  const allowed = config.enabledCategories;
  return allowed.includes('*') || allowed.includes(category.slug);
}
