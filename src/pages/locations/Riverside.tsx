import { LocationPage, LocationData } from '@/pages/LocationPage';

const data: LocationData = {
  city: 'Riverside',
  state: 'California',
  heroImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2670&auto=format&fit=crop',
  intro:
    'Riverside and the broader Inland Empire region are experiencing one of the fastest growth cycles in Southern California — driven by a massive expansion of warehouse, distribution, and logistics infrastructure alongside rapid residential development. Overtime Security provides warehousing security, construction site guards, mobile patrols, and armed protection across Riverside, Moreno Valley, Corona, and the surrounding Inland Empire communities.',
  services: [
    {
      title: 'Armed & Unarmed Guards',
      description:
        'Uniformed security officers for warehouses, distribution centers, retail properties, and corporate facilities throughout Riverside County.',
    },
    {
      title: 'Mobile Patrol Services',
      description:
        'High-frequency vehicle patrols across large industrial campuses, logistics parks, and commercial properties where stationary guards alone are insufficient.',
    },
    {
      title: 'Fire Watch',
      description:
        'NFPA-compliant fire watch coverage for Riverside\'s booming construction projects and industrial facilities with impaired fire suppression systems.',
    },
    {
      title: 'Event Security',
      description:
        'Security staffing for community events, private gatherings, corporate functions, and outdoor concerts across Riverside and the Inland Empire.',
    },
    {
      title: 'Executive Protection',
      description:
        'Close protection services for executives and business owners managing operations across Riverside\'s growing logistics and real estate sectors.',
    },
    {
      title: 'Construction Site Security',
      description:
        'Dedicated construction site protection for Riverside\'s active development pipeline — from large warehouse builds in Eastvale to residential projects in Norco and Corona.',
    },
  ],
  trustPoints: [
    'Specialized experience in warehouse and distribution security — one of the Inland Empire\'s most critical and targeted asset classes.',
    'Coverage across Riverside\'s full geography, including rural industrial areas where rapid law enforcement response is slower.',
    'Construction security programs designed for the Inland Empire\'s large-format industrial projects — often spanning multiple acres with complex perimeters.',
    'Licensed and insured, with officers trained in cargo theft prevention protocols specific to Southern California logistics corridors.',
  ],
  areas: [
    'Downtown Riverside',
    'Moreno Valley',
    'Corona',
    'Jurupa Valley',
    'Norco',
    'Eastvale',
    'Perris',
    'Hemet',
    'Lake Elsinore',
    'Murrieta',
    'Temecula',
    'Beaumont',
  ],
  areaContext:
    'The Inland Empire is now one of the top logistics markets in the United States, with billions of dollars in warehouse and distribution infrastructure concentrated in Riverside County. This rapid growth has created serious security risks — cargo theft, construction material theft, and perimeter intrusions are rising alongside development. Overtime Security deploys quickly to new Riverside-area sites and understands the specific threat profile of this rapidly evolving market.',
};

export function Riverside() {
  return <LocationPage data={data} />;
}
