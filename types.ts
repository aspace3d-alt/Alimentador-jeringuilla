
export type ShippingMethod = 'pickup' | 'spain' | 'portugal';
export type Language = 'es' | 'pt';

export interface Product {
  id: string;
  name: Record<Language, string>;
  tagline: Record<Language, string>;
  description: Record<Language, string>;
  basePrice: number;
  images: string[];
  unit: Record<Language, string>;
  specs: {
    label: Record<Language, string>;
    value: Record<Language, string>;
  }[];
  maintenance: Record<Language, string[]>;
}

export interface SellerConfig {
  companyName: string;
  nif: string;
  address: string;
  email: string;
  phone: string;
  iban: string;
  logoUrl: string;
  googleSheetUrl?: string; // URL del Web App de Google Apps Script
}

export interface BuyerData {
  name: string;
  taxId: string;
  email: string;
  address: string;
  units: number;
  shippingMethod: ShippingMethod;
  coupon?: string;
}

export interface Quote {
  id: string;
  date: string;
  product: Product;
  buyer: BuyerData;
  seller: SellerConfig;
  productTotal: number;
  shippingTotal: number;
  taxAmount: number;
  total: number;
  language: Language;
  appliedUnitPrice: number;
}
