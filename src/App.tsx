/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Services } from './pages/Services';
import { ServiceDetail } from './pages/ServiceDetail';
import { Industries } from './pages/Industries';
import { LosAngeles } from './pages/locations/LosAngeles';
import { OrangeCounty } from './pages/locations/OrangeCounty';
import { LongBeach } from './pages/locations/LongBeach';
import { Riverside } from './pages/locations/Riverside';
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:id" element={<ServiceDetail />} />
          <Route path="industries" element={<Industries />} />
          <Route path="security-guards-los-angeles" element={<LosAngeles />} />
          <Route path="security-guards-orange-county" element={<OrangeCounty />} />
          <Route path="security-guards-long-beach" element={<LongBeach />} />
          <Route path="security-guards-riverside" element={<Riverside />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}
