
import { Product, SellerConfig, ShippingMethod, Language } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'AJ-001',
    name: {
      es: 'Alimentador de Jeringuilla',
      pt: 'Alimentador de Seringa'
    },
    tagline: {
      es: 'Innovación Social Premiada',
      pt: 'Inovação Social Premiada'
    },
    description: {
      es: 'Transforma el esfuerzo manual repetitivo en un suave movimiento de giro, eliminando el estrés articular y garantizando la seguridad en el proceso de alimentación por PEG.',
      pt: 'Transforma o esforço manual repetitivo num movimento de rotação suave, eliminando o stress articular e garantindo a segurança no processo de alimentación.'
    },
    basePrice: 43.50,
    images: [
      'https://i.postimg.cc/9F36ZWZH/Imagen1.jpg',
      'https://i.postimg.cc/j28JV8z5/Gemini-Generated-Image-rcchjyrcchjyrcch.png',
      'https://i.postimg.cc/ydjHn2H7/1620394441231-(1).jpg'
    ],
    unit: {
      es: 'unidades',
      pt: 'unidades'
    },
    specs: [
      { 
        label: { es: 'Origen', pt: 'Origem' }, 
        value: { es: 'ASPACE Salamanca', pt: 'ASPACE Salamanca' } 
      },
      { 
        label: { es: 'Dimensiones', pt: 'Dimensões' }, 
        value: { es: '20,5 cm x 7 cm x 7 cm', pt: '20,5 cm x 7 cm x 7 cm' } 
      },
      { 
        label: { es: 'Peso', pt: 'Peso' }, 
        value: { es: '150 gramos', pt: '150 gramas' } 
      },
      { 
        label: { es: 'Fabricación', pt: 'Fabricação' },
        value: { es: 'Impresión 3D de alta funcionalidad', pt: 'Impressão 3D de alta funcionalidade' } 
      }
    ],
    maintenance: {
      es: [
        'Lavar siempre a mano con agua tibia y jabón neutro.',
        'Nunca introducir en lavavajillas o esterilizadores.',
        'No exponer a temperaturas superiores a 50ºC.'
      ],
      pt: [
        'Lavar sempre à mão com água morna e sabão neutro.',
        'Nunca colocar na máquina de lavar loiça.',
        'Não expor a temperaturas superiores a 50ºC.'
      ]
    }
  }
];

export const SHIPPING_RATES: Record<ShippingMethod, { label: Record<Language, string>, price: number }> = {
  pickup: { 
    label: { es: 'RECOGIDA EN SEDE (GRATIS)', pt: 'RECOLHA NA SEDE (GRÁTIS)' }, 
    price: 0 
  },
  pickup_point: { 
    label: { es: 'PUNTO DE RECOGIDA (PENÍNSULA Y BALEARES)', pt: 'PONTO DE RECOLHA (PENÍNSULA E BALEARES)' }, 
    price: 5.05 
  },
  home_spain: { 
    label: { es: 'DOMICILIO: ESPAÑA PENINSULAR', pt: 'DOMICÍLIO: ESPANHA PENINSULAR' }, 
    price: 7.30 
  },
  home_portugal: { 
    label: { es: 'DOMICILIO: PORTUGAL PENINSULAR', pt: 'DOMICÍLIO: PORTUGAL PENINSULAR' }, 
    price: 8.80 
  }
};

export const DEFAULT_SELLER: SellerConfig = {
  companyName: 'FUNDACIÓN ASPACE SALAMANCA',
  nif: 'G-06986053',
  address: 'C/ JUAN DEL ENCINA, 4-6, 37004 SALAMANCA',
  email: 'elenmp@hotmail.es',
  phone: '+34 923 18 18 18',
  iban: 'ES88 2103 2319 1700 3010 1695',
  logoUrl: 'https://wsrv.nl/?url=aspacesalamanca.org/wp-content/uploads/2025/09/logo_aspace-1-scaled.jpg',
  googleSheetUrl: 'https://script.google.com/macros/s/AKfycbwMgOPI1mNxuCUIxrkebZUwrHDrc0xeACeeOGQ1Nt-Y7XTyRcdcBuDA4eBI6TXFRWeN/exec'
};

export const TRANSLATIONS: Record<Language, any> = {
  es: {
    welcome: 'Seleccione su idioma',
    catalogTitle: 'Nuestras Soluciones',
    catalogSubtitle: 'Tecnología de apoyo e innovación social al servicio de las personas.',
    viewProduct: 'Ver Solución',
    innovation: 'Innovación Social',
    configPanel: 'Panel de Control',
    benefits: [
      { title: 'Ergonomía', desc: 'Elimina la tensión muscular y protege la salud del cuidador.', icon: '💪' },
      { title: 'Ritmo Constante', desc: 'Mecanismo de precisión para un avance milimétrico y seguro.', icon: '⏱️' },
      { title: 'Conexión Humana', desc: 'Libera al cuidador para recuperar el contacto visual y la conversación.', icon: '🤝' },
    ],
    specsTitle: 'Especificaciones',
    maintenanceTitle: 'Cuidado y Mantenimiento',
    formTitle: 'Solicitar Presupuesto',
    formSubtitle: 'Completa los datos para generar tu presupuesto. Para aprobarlo y generar la factura previa al pago, envíalo a administracion@aspacesalamanca.org.',
    unitsLabel: 'UNIDADES',
    deliveryLabel: 'MODO DE ENTREGA',
    couponLabel: 'CUPÓN DE DESCUENTO',
    couponPlaceholder: 'Introduce tu código',
    couponApplied: '¡Cupón aplicado! (Descuento de 2€)',
    couponNotNeeded: 'Precio rebajado automáticamente por volumen.',
    volumeOffer: '¡OFERTA! 3+ unidades con 2€ de dto./ud.',
    volumeApplied: 'Descuento por volumen aplicado',
    namePlaceholder: 'Nombre o Razón Social',
    taxPlaceholder: 'NIF / CIF',
    emailPlaceholder: 'Email de contacto',
    addressPlaceholder: 'Dirección completa para el envío',
    subtotal: 'Base Imponible',
    tax: 'IVA (21%)',
    shipping: 'Gastos de Envío',
    totalQuote: 'Total Presupuesto',
    btnQuote: 'Generar Presupuesto Formal',
    btnSending: 'Enviando datos...',
    btnBack: 'Volver al Catálogo',
    downloadBtn: 'Descargar PDF',
    btnApprove: 'Aprobar y Enviar por Email',
    footerDesc: 'Proyecto de innovación social desarrollado para mejorar la calidad de vida de personas con parálisis cerebral u otra discapacidad y las personas que las cuidan.',
    free: 'Gratis',
    shippingDetail: 'Opciones: Recogida gratuita en sede (Salamanca), Punto de Recogida (Península y Baleares) o Envío a Domicilio (Península).'
  },
  pt: {
    welcome: 'Selecione o seu idioma',
    catalogTitle: 'As Nossas Soluções',
    catalogSubtitle: 'Tecnologia de apoyo e innovación social ao servicio das pessoas.',
    viewProduct: 'Ver Solução',
    innovation: 'Inovación Social',
    configPanel: 'Painel de Controlo',
    benefits: [
      { title: 'Ergonomia', desc: 'Elimina a tensão muscular e protege la saúde do cuidador.', icon: '💪' },
      { title: 'Ritmo Constante', desc: 'Mecanismo de precisão para um avanço milimétrico e seguro.', icon: '⏱️' },
      { title: 'Conexão Humana', desc: 'Liberta o cuidador para recuperar o contacto visual e a conversa.', icon: '🤝' },
    ],
    specsTitle: 'Especificações',
    maintenanceTitle: 'Cuidado e Manutenção',
    formTitle: 'Solicitar Orçamento',
    formSubtitle: 'Preencha os dados para gerar o seu orçamento. Para aprová-lo e gerar a fatura antes do pagamento, envie-o para administracion@aspacesalamanca.org.',
    unitsLabel: 'UNIDADES',
    deliveryLabel: 'MODO DE ENTREGA',
    couponLabel: 'CUPÃO DE DESCONTO',
    couponPlaceholder: 'Introduza o seu código',
    couponApplied: 'Cupão aplicado! (Desconto de 2€)',
    couponNotNeeded: 'Preço reduzido automaticamente por volume.',
    volumeOffer: 'OFERTA! 3+ unidades com 2€ de desc./ud.',
    volumeApplied: 'Desconto por volume aplicado',
    namePlaceholder: 'Nome o Razão Social',
    taxPlaceholder: 'NIF / CIF',
    emailPlaceholder: 'Email de contacto',
    addressPlaceholder: 'Morada completa de envio',
    subtotal: 'Base Tributável',
    tax: 'IVA (21%)',
    shipping: 'Custos de Envio',
    totalQuote: 'Total Orçamento',
    btnQuote: 'Gerar Orçamento Formal',
    btnSending: 'A enviar dados...',
    btnBack: 'Voltar ao Catálogo',
    downloadBtn: 'Descarregar PDF',
    btnApprove: 'Aprovar e Enviar por Email',
    footerDesc: 'Projeto de inovação social desarrollado para mejorar la qualidade de vida de pessoas com paralisia cerebral ou outra deficiência e as personas que cuidam delas.',
    free: 'Grátis',
    shippingDetail: 'Opções: Recolha gratuita na sede (Salamanca), Ponto de Recolha (Península e Baleares) ou Envio ao Domicílio (Península).'
  }
};
