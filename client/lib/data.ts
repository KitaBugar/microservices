// Dummy data for the gym management system
export interface City {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface GymFacility {
  id: string;
  name: string;
  description: string;
}

export interface Gym {
  id: string;
  name: string;
  address: string;
  cityId: string;
  thumbnail: string;
  images: string[];
  description: string;
  about: string;
  facilities: GymFacility[];
  isPopular: boolean;
  openTimeAt: string;
  closeTimeAt: string;
}

export interface Testimonial {
  id: string;
  gymId: string;
  userName: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Subscription {
  booking_trx_id: string;
  name: string;
  phone: string;
  email: string;
  proof: string;
  total_amount: number;
  duration: string;
  is_paid: boolean;
  starter_at: string;
  ended_at: string;
  subscribe_package_id: string;
}

export interface SubscriptionPackages {
  id: string;
  icon: string;
  name: string;
  price: string;
  duration: string;
}

// Dummy data
export const cities: City[] = [
  {
    id: '1',
    name: 'New York',
    slug: 'new-york',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
  },
  {
    id: '2',
    name: 'Los Angeles',
    slug: 'los-angeles',
    image: 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da',
  },
];

export const facilities: Facility[] = [
  {
    id: '1',
    name: 'Swimming Pool',
    description: 'Olympic-sized swimming pool with temperature control',
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7',
  },
  {
    id: '2',
    name: 'Cardio Area',
    description: 'Modern cardio equipment with personal TV screens',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f',
  },
];

export const gyms: Gym[] = [
  {
    id: '1',
    name: 'FitLife Center',
    address: '123 Fitness Street',
    cityId: '1',
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
      'https://images.unsplash.com/photo-1576678927484-cc907957088c',
    ],
    description: 'Premier fitness center in the heart of the city',
    about: 'State-of-the-art equipment and expert trainers',
    facilities: [
      { id: '1', name: 'Swimming Pool', description: 'Olympic-sized pool' },
      { id: '2', name: 'Cardio Area', description: 'Latest equipment' },
    ],
    isPopular: true,
    openTimeAt: '06:00',
    closeTimeAt: '22:00',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    userName: "John Doe",
    avatar: "https://example.com/avatar1.jpg",
    rating: 5,
    comment: "Great gym with amazing facilities!",
    gym_name: "Fitness First"
  },
  {
    id: "2", 
    userName: "Jane Smith",
    avatar: "https://example.com/avatar2.jpg", 
    rating: 4,
    comment: "Excellent training programs.",
    gym_name: "Gym Plus"
  }
];

export const subscriptions: Subscription[] = [
  {
    booking_trx_id: "TRX001",
    name: "John Doe",
    phone: "+62123456789",
    email: "johndoe@example.com",
    proof: "proof1.jpg",
    total_amount: 150000,
    duration: "1 month",
    is_paid: true,
    starter_at: "2023-10-01T10:00:00Z",
    ended_at: "2023-10-31T10:00:00Z",
    subscribe_package_id: "PACKAGE001",
  },
  {
    booking_trx_id: "TRX002",
    name: "Jane Smith",
    phone: "+62198765432",
    email: "janesmith@example.com",
    proof: "proof2.jpg",
    total_amount: 200000,
    duration: "3 months",
    is_paid: false,
    starter_at: "2023-09-15T10:00:00Z",
    ended_at: "2023-12-15T10:00:00Z",
    subscribe_package_id: "PACKAGE002",
  },
  {
    booking_trx_id: "TRX003",
    name: "Alice Johnson",
    phone: "+62123456780",
    email: "alicejohnson@example.com",
    proof: "proof3.jpg",
    total_amount: 300000,
    duration: "6 months",
    is_paid: true,
    starter_at: "2023-08-01T10:00:00Z",
    ended_at: "2024-01-31T10:00:00Z",
    subscribe_package_id: "PACKAGE003",
  },
  {
    booking_trx_id: "TRX004",
    name: "Bob Brown",
    phone: "+62123456781",
    email: "bobbrown@example.com",
    proof: "proof4.jpg",
    total_amount: 100000,
    duration: "1 month",
    is_paid: true,
    starter_at: "2023-10-05T10:00:00Z",
    ended_at: "2023-10-31T10:00:00Z",
    subscribe_package_id: "PACKAGE001",
  },
  {
    booking_trx_id: "TRX005",
    name: "Charlie Davis",
    phone: "+62123456782",
    email: "charliedavis@example.com",
    proof: "proof5.jpg",
    total_amount: 250000,
    duration: "2 months",
    is_paid: false,
    starter_at: "2023-09-20T10:00:00Z",
    ended_at: "2023-11-20T10:00:00Z",
    subscribe_package_id: "PACKAGE002",
  },
];

export const subscriptionPackages: SubscriptionPackages[] = [
  {
    id: '1',
    icon: 'https://example.com/avatar2.jpg',
    name: 'Premium',
    price: '500.000',
    duration: '30',
  },
];