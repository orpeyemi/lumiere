export type CurrencyCode = 'USD' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  symbol: string;
  rate: number;
}

export interface FourCs {
  carat: number;
  cut: 'Excellent' | 'Very Good' | 'Good';
  color: 'D' | 'E' | 'F' | 'G' | 'H';
  clarity: 'FL' | 'IF' | 'VVS1' | 'VVS2' | 'VS1';
}

export interface Product {
  id: string;
  name: string;
  category: 'Ring' | 'Necklace' | 'Earrings';
  priceUSD: number;
  image: string;
  specs: FourCs;
  metal: '18k Yellow Gold' | 'Platinum' | '18k Rose Gold';
  description?: string; // AI Generated story
}

export interface CartItem extends Product {
  selectedSize?: string;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  totalUSD: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
  lastOrderDate: string;
}