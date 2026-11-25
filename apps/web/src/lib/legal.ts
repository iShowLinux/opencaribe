import type { Locale } from '@opencaribe/configuration';

export interface LegalSection {
  heading: string;
  body: string;
}

export interface LegalDocument {
  slug: string;
  titleKey: string;
  content: Record<Locale, LegalSection[]>;
}

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    slug: 'about',
    titleKey: 'legal.about',
    content: {
      en: [
        { heading: 'What OpenCaribe is', body: 'OpenCaribe is an open-source classifieds marketplace built for communities in Trinidad and Tobago and Venezuela. It is designed to work on modest devices and slow connections, and to be translated and extended by local contributors.' },
        { heading: 'Why it exists', body: 'Local marketplaces should be shaped by the people who use them. The source code, translations and geographic data are maintained in public so that communities can audit, improve and self-host the platform.' },
      ],
      es: [
        { heading: 'Qué es OpenCaribe', body: 'OpenCaribe es un mercado de clasificados de código abierto creado para las comunidades de Trinidad y Tobago y Venezuela. Está diseñado para funcionar en dispositivos modestos y conexiones lentas, y para ser traducido y ampliado por contribuyentes locales.' },
        { heading: 'Por qué existe', body: 'Los mercados locales deben ser moldeados por quienes los usan. El código fuente, las traducciones y los datos geográficos se mantienen en público para que las comunidades puedan auditar, mejorar y alojar la plataforma por sí mismas.' },
      ],
    },
  },
  {
    slug: 'privacy',
    titleKey: 'legal.privacy',
    content: {
      en: [
        { heading: 'Data we collect', body: 'We collect only the information needed to operate the marketplace: account details, the listings you publish, messages you choose to send, and minimal technical logs for security and reliability.' },
        { heading: 'Location privacy', body: 'Listings use approximate locations. Exact residential addresses are never required and are not published. Location detection is optional and consent-based.' },
        { heading: 'Your controls', body: 'You can export your data and delete your account from account settings. Retention periods for inactive listings are configurable per country.' },
      ],
      es: [
        { heading: 'Datos que recopilamos', body: 'Solo recopilamos la información necesaria para operar el mercado: datos de la cuenta, los anuncios que publicas, los mensajes que decides enviar y registros técnicos mínimos para seguridad y confiabilidad.' },
        { heading: 'Privacidad de ubicación', body: 'Los anuncios usan ubicaciones aproximadas. Nunca se requieren direcciones residenciales exactas y no se publican. La detección de ubicación es opcional y basada en consentimiento.' },
        { heading: 'Tus controles', body: 'Puedes exportar tus datos y eliminar tu cuenta desde la configuración. Los periodos de retención de anuncios inactivos se configuran por país.' },
      ],
    },
  },
  {
    slug: 'terms',
    titleKey: 'legal.terms',
    content: {
      en: [
        { heading: 'Using the marketplace', body: 'You must be legally able to use the service in your country, post accurate information, and respect the rights of other people. You are responsible for the content of your listings and messages.' },
        { heading: 'Prohibited content', body: 'Weapons, controlled substances, counterfeit goods, stolen property, content involving minors, and other regulated categories are prohibited. Moderators may remove content that breaches these rules.' },
        { heading: 'No warranty', body: 'Listings are provided by users, not by the project. OpenCaribe does not guarantee the accuracy of a listing or the outcome of a transaction.' },
      ],
      es: [
        { heading: 'Uso del mercado', body: 'Debes tener capacidad legal para usar el servicio en tu país, publicar información veraz y respetar los derechos de otras personas. Eres responsable del contenido de tus anuncios y mensajes.' },
        { heading: 'Contenido prohibido', body: 'Se prohíben armas, sustancias controladas, artículos falsificados, propiedad robada, contenido que involucre a menores y otras categorías reguladas. Los moderadores pueden retirar contenido que infrinja estas reglas.' },
        { heading: 'Sin garantía', body: 'Los anuncios son proporcionados por los usuarios, no por el proyecto. OpenCaribe no garantiza la exactitud de un anuncio ni el resultado de una transacción.' },
      ],
    },
  },
  {
    slug: 'guidelines',
    titleKey: 'legal.guidelines',
    content: {
      en: [
        { heading: 'Be accurate', body: 'Describe items honestly, use your own photos where possible, and state the currency and price clearly. Do not misrepresent condition or location.' },
        { heading: 'Be respectful', body: 'No harassment, discrimination or hateful content. Do not publish another person’s private information.' },
        { heading: 'Be safe', body: 'Meet in public places, inspect goods before paying, and report anything that looks like a scam.' },
      ],
      es: [
        { heading: 'Sé veraz', body: 'Describe los artículos con honestidad, usa tus propias fotos cuando sea posible e indica claramente la moneda y el precio. No tergiverses la condición ni la ubicación.' },
        { heading: 'Sé respetuoso', body: 'No se permite acoso, discriminación ni contenido odioso. No publiques información privada de otra persona.' },
        { heading: 'Sé seguro', body: 'Queda en lugares públicos, revisa los artículos antes de pagar y reporta cualquier cosa que parezca una estafa.' },
      ],
    },
  },
  {
    slug: 'safety',
    titleKey: 'legal.safety',
    content: {
      en: [
        { heading: 'Before you meet', body: 'Verify the item, ask questions through in-app messages, and keep a record of the conversation. Be cautious of prices that seem too good to be true.' },
        { heading: 'When you meet', body: 'Choose a busy public location, bring another person if possible, and inspect the item before paying. Never share one-time payment codes.' },
        { heading: 'If something goes wrong', body: 'Report the listing, block the contact if available, and contact local authorities if you believe a crime has occurred.' },
      ],
      es: [
        { heading: 'Antes de encontrarte', body: 'Verifica el artículo, haz preguntas por mensajería interna y conserva un registro de la conversación. Desconfía de precios demasiado buenos para ser verdad.' },
        { heading: 'Al encontrarte', body: 'Elige un lugar público concurrido, lleva a otra persona si puedes y revisa el artículo antes de pagar. Nunca compartas códigos de pago de un solo uso.' },
        { heading: 'Si algo sale mal', body: 'Reporta el anuncio, bloquea al contacto si es posible y contacta a las autoridades locales si crees que se cometió un delito.' },
      ],
    },
  },
  {
    slug: 'opensource',
    titleKey: 'legal.opensource',
    content: {
      en: [
        { heading: 'Source and license', body: 'OpenCaribe is released under the MIT license. The repository contains the application, configuration, translations, geographic seed data and deployment tooling.' },
        { heading: 'Contributing', body: 'Contributions are welcome: translations, accessibility improvements, documentation, security reviews and regional configuration. See CONTRIBUTING.md in the repository.' },
        { heading: 'Self-hosting', body: 'You can run your own instance with Docker Compose. Keeping infrastructure simple and reproducible is a project priority.' },
      ],
      es: [
        { heading: 'Código y licencia', body: 'OpenCaribe se publica bajo la licencia MIT. El repositorio contiene la aplicación, la configuración, las traducciones, los datos geográficos iniciales y las herramientas de despliegue.' },
        { heading: 'Contribuir', body: 'Se aceptan contribuciones: traducciones, mejoras de accesibilidad, documentación, revisiones de seguridad y configuración regional. Consulta CONTRIBUTING.md en el repositorio.' },
        { heading: 'Alojamiento propio', body: 'Puedes ejecutar tu propia instancia con Docker Compose. Mantener la infraestructura simple y reproducible es una prioridad del proyecto.' },
      ],
    },
  },
];

export function findLegalDocument(slug: string): LegalDocument | undefined {
  return LEGAL_DOCUMENTS.find((document) => document.slug === slug);
}
