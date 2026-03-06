
import { LocationPage, LocationData } from '@/pages/LocationPage';

const data: LocationData = {
  city: 'Long Beach',
  state: 'California',
  heroImage: 'https://images.unsplash.com/photo-1581093057305-25f5d3c86ee0?q=80&w=2670&auto=format&fit=crop',
  intro:
    'Long Beach is a major Pacific port city with one of the busiest cargo complexes in the world, a thriving downtown corridor, and diverse residential neighborhoods. Overtime Security provides armed security guards, mobile patrols, and industrial site protection throughout Long Beach — serving port-adjacent logistics facilities, downtown commercial properties, and residential communities with equal professionalism.',
  services: [
    {
      title: 'Armed & Unarmed Guards',
      description:
        'Stationary and roving armed security officers for warehouses, logistics facilities, retail centers, and residential properties throughout the City of Long Beach.',
    },
    {
      title: 'Mobile Patrol Services',
      description:
        'Vehicle-based security patrols across port-adjacent industrial zones, commercial corridors, and multi-property portfolios with documented rounds and incident logs.',
    },
    {
      title: 'Fire Watch',
      description:
        'On-site fire watch personnel for construction projects, industrial facilities, and commercial buildings undergoing system maintenance or repairs in Long Beach.',
    },
    {
      title: 'Event Security',
      description:
        'Security staffing for events at the Long Beach Convention Center, Queen Mary events complex, and outdoor festivals along the waterfront.',
    },
    {
      title: 'Executive Protection',
      description:
        'Personal protection for executives, logistics executives, and high-profile individuals in Long Beach and the surrounding South Bay area.',
    },
    {
      title: 'Construction Site Security',
      description:
        'Security for Long Beach\'s active residential and commercial construction pipeline — protecting materials, equipment, and active sites from theft and vandalism.',
    },
  ],
  trustPoints: [
    'Experienced in port-adjacent industrial security — we understand the unique access control and logistics security demands near the Port of Long Beach.',
    'Rapid deployment across all Long Beach districts, from Belmont Shore retail to Signal Hill industrial to North Long Beach residential.',
    'Licensed officers with current background clearances and documented training records available on request.',
    'Flexible contract structures for both long-term site assignments and short-term event coverage throughout the Long Beach area.',
  ],
  areas: [
    'Downtown Long Beach',
    'Belmont Shore',
    'Signal Hill',
    'Bixby Knolls',
    'North Long Beach',
    'Midtown',
    'Port of Long Beach',
    'Cambodia Town',
    'Lakewood Village',
    'Los Altos',
    'Wrigley',
    'Virginia Country Club',
  ],
  areaContext:
    'Long Beach\'s identity as a port city creates distinct security challenges — cargo theft, perimeter breaches, and after-hours industrial intrusion are persistent threats. At the same time, Long Beach\'s growing downtown restaurant and entertainment scene, coastal tourism, and dense residential neighborhoods require community-oriented, professional security presence. Overtime Security is built to handle both.',
};

export function LongBeach() {
  return <LocationPage data={data} />;
}
