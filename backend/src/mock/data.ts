export type UserRole = 'ADMIN' | 'STAFF' | 'CLIENT';

export type SeatType = 'STANDARD' | 'VIP';
export type ZoneName = 'STANDARD' | 'VIP';

export interface MockSeat {
  number: number;
  type: SeatType;
}

export interface MockRow {
  letter: string;
  seats: MockSeat[];
}

export interface MockRoom {
  id: string;
  name: string;
  layout: {
    rows: MockRow[];
    zones: { name: ZoneName; rows: string[] }[];
  };
}

export interface MockMovie {
  id: string;
  title: string;
  synopsis: string;
  duration: number;
  genres: string[];
  rating?: string;
  status: 'ESTRENO' | 'CARTELERA' | 'PROXIMAMENTE';
  posterUrl?: string;
  trailerUrl?: string;
  isFeatured?: boolean;
}

export interface MockShowtime {
  id: string;
  movieId: string;
  roomId: string;
  startTime: string;
  format: 'TWO_D' | 'THREE_D' | 'IMAX';
  language: string;
  subtitles?: string | null;
  pricingRuleId?: string | null;
}

export interface MockPricingRule {
  id: string;
  name: string;
  seatType: SeatType;
  basePrice: number;
  roomId?: string;
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
}

export interface MockProduct {
  id: string;
  name: string;
  description?: string;
  category: 'POCHOCLOS' | 'BEBIDAS' | 'SNACKS' | 'COMBOS';
  price: number;
  imageUrl?: string;
  stock?: number | null;
  isActive?: boolean;
  promotionId?: string;
}

export interface MockPromotion {
  id: string;
  name: string;
  description?: string;
  type: 'TUESDAY_2X1' | 'COUPON' | 'COMBO' | 'PASE';
  dayOfWeek?: number;
  discount?: number;
  code?: string;
  productId?: string;
}

export interface MockUser {
  id: string;
  email: string;
  password: string;
  name?: string;
  role: UserRole;
}

export const mockUsers: MockUser[] = [
  { id: 'u-admin', email: 'admin@cinema.test', password: 'admin123', role: 'ADMIN', name: 'Admin' },
  { id: 'u-staff', email: 'staff@cinema.test', password: 'staff123', role: 'STAFF', name: 'Vendedor' },
  { id: 'u-client', email: 'cliente@cinema.test', password: 'cliente123', role: 'CLIENT', name: 'Cliente' },
];

export const mockRooms: MockRoom[] = [
  {
    id: 'room-roja',
    name: 'Roja',
    layout: {
      zones: [
        { name: 'STANDARD', rows: ['A', 'B', 'C', 'D'] },
        { name: 'VIP', rows: ['E', 'F'] },
      ],
      rows: [
        { letter: 'A', seats: Array.from({ length: 20 }, (_, i) => ({ number: i + 1, type: 'STANDARD' })) },
        { letter: 'B', seats: Array.from({ length: 20 }, (_, i) => ({ number: i + 1, type: 'STANDARD' })) },
        { letter: 'C', seats: Array.from({ length: 20 }, (_, i) => ({ number: i + 1, type: 'STANDARD' })) },
        { letter: 'D', seats: Array.from({ length: 20 }, (_, i) => ({ number: i + 1, type: 'STANDARD' })) },
        { letter: 'E', seats: Array.from({ length: 20 }, (_, i) => ({ number: i + 1, type: 'VIP' })) },
        { letter: 'F', seats: Array.from({ length: 20 }, (_, i) => ({ number: i + 1, type: 'VIP' })) },
      ],
    },
  },
  {
    id: 'room-amarilla',
    name: 'Amarilla',
    layout: {
      zones: [
        { name: 'STANDARD', rows: ['A', 'B', 'C', 'D'] },
        { name: 'VIP', rows: ['E', 'F'] },
      ],
      rows: [
        { letter: 'A', seats: Array.from({ length: 18 }, (_, i) => ({ number: i + 1, type: 'STANDARD' })) },
        { letter: 'B', seats: Array.from({ length: 18 }, (_, i) => ({ number: i + 1, type: 'STANDARD' })) },
        { letter: 'C', seats: Array.from({ length: 18 }, (_, i) => ({ number: i + 1, type: 'STANDARD' })) },
        { letter: 'D', seats: Array.from({ length: 18 }, (_, i) => ({ number: i + 1, type: 'STANDARD' })) },
        { letter: 'E', seats: Array.from({ length: 14 }, (_, i) => ({ number: i + 1, type: 'VIP' })) },
        { letter: 'F', seats: Array.from({ length: 14 }, (_, i) => ({ number: i + 1, type: 'VIP' })) },
      ],
    },
  },
];

export const mockMovies: MockMovie[] = [
  {
    id: 'mov-duna2',
    title: 'Duna: Parte Dos',
    synopsis: 'Paul Atreides une fuerzas con los Fremen para vengar a su familia y proteger Arrakis.',
    duration: 165,
    genres: ['Sci-Fi', 'Aventura'],
    rating: '+13',
    status: 'ESTRENO',
    isFeatured: true, // Película destacada en cartelera
    posterUrl:
      'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=n9xhJrPXop4',
  },
  {
    id: 'mov-mario',
    title: 'Super Mario Bros',
    synopsis: 'Mario y Luigi viajan por el Reino Champiñón para rescatar a la Princesa Peach.',
    duration: 110,
    genres: ['Animación', 'Aventura'],
    rating: 'ATP',
    status: 'CARTELERA',
    posterUrl:
      'https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=TnGl01FkMMo',
  },
  {
    id: 'mov-inside',
    title: 'Intensamente 2',
    synopsis: 'Riley enfrenta nuevas emociones mientras crece y comienza la secundaria.',
    duration: 100,
    genres: ['Animación', 'Familiar'],
    rating: 'ATP',
    status: 'PROXIMAMENTE',
    posterUrl:
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=GVf4k4xNQ6s',
  },
];

const now = new Date();
const today = new Date(now);
today.setHours(0, 0, 0, 0);

const plusHours = (hours: number) => {
  const d = new Date(today);
  d.setHours(hours);
  return d.toISOString();
};

export const mockPricingRules: MockPricingRule[] = [
  { id: 'pr-std', name: 'General', seatType: 'STANDARD', basePrice: 5000 },
  { id: 'pr-vip', name: 'VIP', seatType: 'VIP', basePrice: 7500 },
];

export const mockShowtimes: MockShowtime[] = [
  {
    id: 'show-1',
    movieId: 'mov-duna2',
    roomId: 'room-roja',
    startTime: plusHours(19),
    format: 'IMAX',
    language: 'es',
    subtitles: 'es',
    pricingRuleId: 'pr-vip',
  },
  {
    id: 'show-2',
    movieId: 'mov-mario',
    roomId: 'room-amarilla',
    startTime: plusHours(17),
    format: 'TWO_D',
    language: 'es',
    subtitles: null,
    pricingRuleId: 'pr-std',
  },
  {
    id: 'show-3',
    movieId: 'mov-duna2',
    roomId: 'room-roja',
    startTime: plusHours(22),
    format: 'IMAX',
    language: 'en',
    subtitles: 'es',
    pricingRuleId: 'pr-vip',
  },
];

export const mockProducts: MockProduct[] = [
  {
    id: 'prod-poch-chico',
    name: 'Pochoclos Chico',
    description: 'Balde pequeño de pochoclos manteca/dulce.',
    category: 'POCHOCLOS',
    price: 2500,
    stock: null,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'prod-poch-grande',
    name: 'Pochoclos Grande',
    description: 'Balde grande de pochoclos',
    category: 'POCHOCLOS',
    price: 4000,
    stock: null,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'prod-coca',
    name: 'Coca-Cola 750ml',
    description: 'Regular o sin azúcar',
    category: 'BEBIDAS',
    price: 2500,
    stock: 50,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'prod-nachos',
    name: 'Nachos con queso',
    description: 'Con salsa cheddar caliente',
    category: 'SNACKS',
    price: 4500,
    stock: 30,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'prod-combo-pareja',
    name: 'Combo Pareja',
    description: '1 balde de pochoclos + 2 bebidas',
    category: 'COMBOS',
    price: 8000,
    stock: 25,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'prod-hotdog',
    name: 'Hot Dog Premium',
    description: 'Con todo: mostaza, ketchup, cebolla y pepinillos',
    category: 'SNACKS',
    price: 3500,
    stock: 40,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1612392166886-ee8475b03b07?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'prod-agua',
    name: 'Agua Mineral',
    description: 'Botella 500ml sin gas',
    category: 'BEBIDAS',
    price: 1500,
    stock: 100,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1560023907-5f339617ea55?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'prod-combo-familiar',
    name: 'Combo Familiar',
    description: '2 baldes de pochoclos grandes + 4 bebidas',
    category: 'COMBOS',
    price: 15000,
    stock: 20,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=400&q=80',
  },
];

export const mockPromotions: MockPromotion[] = [
  {
    id: 'promo-2x1-martes',
    name: 'Martes 2x1',
    description: '2x1 en tickets los martes',
    type: 'TUESDAY_2X1',
    dayOfWeek: 2,
  },
  {
    id: 'promo-combo',
    name: 'Combo Dulce',
    description: 'Combo especial en pochoclos + bebida',
    type: 'COMBO',
    productId: 'prod-combo-pareja',
    discount: 0.1,
  },
];
