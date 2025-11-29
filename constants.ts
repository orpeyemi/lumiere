import { CurrencyCode, CurrencyConfig, Product } from './types';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { symbol: '$', rate: 1 },
  EUR: { symbol: '€', rate: 0.92 },
  GBP: { symbol: '£', rate: 0.79 },
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'The Solitaire Absolu',
    category: 'Ring',
    priceUSD: 12500,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1000',
    metal: 'Platinum',
    specs: { carat: 1.5, cut: 'Excellent', color: 'E', clarity: 'VVS1' }
  },
  {
    id: '2',
    name: 'Aurum Pendant',
    category: 'Necklace',
    priceUSD: 4200,
    image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&q=80&w=1000',
    metal: '18k Yellow Gold',
    specs: { carat: 0.5, cut: 'Very Good', color: 'G', clarity: 'VS1' }
  },
  {
    id: '3',
    name: 'Rose Éternelle',
    category: 'Ring',
    priceUSD: 8900,
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=1000',
    metal: '18k Rose Gold',
    specs: { carat: 1.02, cut: 'Excellent', color: 'F', clarity: 'IF' }
  },
  {
    id: '4',
    name: 'Midnight Sapphire',
    category: 'Ring',
    priceUSD: 15000,
    image: 'https://images.unsplash.com/photo-1598560916726-2824cf965b32?auto=format&fit=crop&q=80&w=1000',
    metal: 'Platinum',
    specs: { carat: 2.1, cut: 'Excellent', color: 'D', clarity: 'VVS2' }
  },
  {
    id: '5',
    name: 'Lumière Cascade',
    category: 'Necklace',
    priceUSD: 22000,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1000',
    metal: '18k Yellow Gold',
    specs: { carat: 3.5, cut: 'Excellent', color: 'E', clarity: 'VVS1' }
  },
  {
    id: '6',
    name: 'Vintage Halo',
    category: 'Ring',
    priceUSD: 6800,
    image: 'https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?auto=format&fit=crop&q=80&w=1000',
    metal: 'Platinum',
    specs: { carat: 0.9, cut: 'Very Good', color: 'H', clarity: 'VS1' }
  }
];

export const RING_SIZES = ['4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9'];