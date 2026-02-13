import React from 'react';
import { CmsProvider } from '../store/cmsStore.jsx';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

export default function PageLayout({ children }) {
  return (
    <CmsProvider>
      <Navbar />
      {children}
      <Footer />
    </CmsProvider>
  );
}
