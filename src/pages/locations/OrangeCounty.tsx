import { LocationPage, LocationData } from '@/pages/LocationPage';

const data: LocationData = {
  city: 'Orange County',
  state: 'California',
  heroImage: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2596&auto=format&fit=crop',
  intro:
    'Orange County is home to major corporate headquarters, world-class tourism destinations, and some of the most affluent residential communities in California. Overtime Security delivers professional armed security, mobile patrol, and event security services throughout Orange County — from the Disneyland Resort corridor in Anaheim to the financial districts of Irvine and the coastal communities of Newport Beach.',
  services: [
    {
      title: 'Armed & Unarmed Guards',
      description:
        'Professional security officers stationed at corporate campuses, luxury retail centers, healthcare facilities, and gated communities throughout Orange County.',
    },
    {
      title: 'Mobile Patrol Services',
      description:
        'Regular and randomized vehicle patrols across commercial parks, HOA communities, and multi-tenant office complexes in Irvine, Anaheim, and Santa Ana.',
    },
    {
      title: 'Fire Watch',
      description:
        'Compliant fire watch coverage for hotels, commercial developments, and high-occupancy facilities across Orange County when suppression systems are offline.',
    },
    {
      title: 'Event Security',
      description:
        'Specialized security for large-scale events near the Disneyland Resort, Honda Center, Angel Stadium, and convention centers throughout the county.',
    },
    {
      title: 'Executive Protection',
      description:
        'Protective detail services for C-suite executives and high-net-worth residents across Newport Beach, Laguna Hills, and Mission Viejo.',
    },
    {
      title: 'Construction Site Security',
      description:
        'Site security for the rapid commercial and residential development happening across Anaheim, Irvine, and the Platinum Triangle — protecting equipment and materials from theft.',
    },
  ],
  trustPoints: [
    'Fully licensed with officers experienced in corporate, retail, and hospitality environments specific to Orange County.',
    'Deep familiarity with the Disneyland Resort area, Irvine Spectrum, South Coast Plaza, and other high-traffic commercial zones.',
    'Rapid response protocols aligned with Orange County Sheriff coordination for seamless incident escalation.',
    'We serve both large corporate clients and small business owners — flexible coverage options with no long-term lock-in.',
  ],
  areas: [
    'Anaheim',
    'Irvine',
    'Santa Ana',
    'Huntington Beach',
    'Newport Beach',
    'Fullerton',
    'Costa Mesa',
    'Garden Grove',
    'Orange',
    'Tustin',
    'Mission Viejo',
    'Lake Forest',
  ],
  areaContext:
    'Orange County\'s mix of major tourism infrastructure, Fortune 500 office parks, and high-value residential neighborhoods demands a security partner that can operate professionally across all environments. Overtime Security\'s Orange County teams are skilled in both highly visible deterrence for hospitality settings and low-profile protection for executive and private residential clients.',
};

export function OrangeCounty() {
  return <LocationPage data={data} />;
}
