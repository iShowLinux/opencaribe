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
