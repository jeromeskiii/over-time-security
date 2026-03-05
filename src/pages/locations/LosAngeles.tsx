import { LocationPage, LocationData } from '@/pages/LocationPage';

const data: LocationData = {
  city: 'Los Angeles',
  state: 'California',
  heroImage: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=2670&auto=format&fit=crop',
  intro:
    'Los Angeles is the most populous city in California and a global hub for entertainment, technology, and commerce. Overtime Security provides armed and unarmed guards, mobile patrols, fire watch, and executive protection across every neighborhood and district in the Los Angeles area — 24 hours a day, 365 days a year.',
  services: [
    {
      title: 'Armed & Unarmed Guards',
      description:
        'Uniformed and plainclothes armed security officers deployed to corporate campuses, retail centers, and high-value residential properties throughout LA County.',
    },
    {
      title: 'Mobile Patrol Services',
      description:
        'GPS-tracked vehicle patrols covering large commercial properties, parking structures, and multi-site portfolios across the Los Angeles metro with real-time incident reporting.',
    },
    {
      title: 'Fire Watch',
      description:
        'NFPA-compliant fire watch officers for construction sites, high-rise buildings, and facilities with temporarily disabled suppression systems anywhere in Los Angeles.',
    },
    {
      title: 'Event Security',
      description:
        'Crowd management, access control, and venue perimeter security for concerts, film premieres, corporate events, and private gatherings across Hollywood, Staples Center, and beyond.',
    },
    {
      title: 'Executive Protection',
      description:
        'Discreet close protection for entertainment executives, tech leaders, and high-net-worth individuals navigating the social and professional demands of life in Los Angeles.',
    },
    {
      title: 'Construction Site Security',
      description:
        'Round-the-clock site security for active construction projects across Downtown LA, West Hollywood, and the San Fernando Valley — deterring theft, vandalism, and unauthorized access.',
    },
  ],
  trustPoints: [
    'Fully vetted, background-checked officers who understand LA\'s complex urban environment.',
    'Rapid deployment capability — we can staff a new site in Los Angeles within 24 hours of contract execution.',
    'Experienced with both high-profile entertainment venues and street-level commercial retail environments unique to LA.',
    'Bilingual officers available for properties serving Spanish-speaking communities across South LA, East LA, and the Valley.',
  ],
  areas: [
    'Downtown LA',
    'Hollywood',
    'Beverly Hills',
    'Santa Monica',
    'Westside',
    'South LA',
    'San Fernando Valley',
    'Koreatown',
    'Silver Lake',
    'Culver City',
    'El Monte',
    'Burbank',
  ],
  areaContext:
    "Los Angeles presents some of the most diverse security challenges in the nation — from luxury retail on Rodeo Drive to high-density residential towers in Koreatown to massive warehouses in the San Fernando Valley. Overtime Security's officers are trained for the full spectrum of LA environments, ensuring consistent, professional protection wherever your assets are located.",
};

export function LosAngeles() {
  return <LocationPage data={data} />;
}
