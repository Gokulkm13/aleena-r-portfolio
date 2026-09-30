import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Education from './components/Education';
import Research from './components/Research';
import Certificates from './components/Certificates';
import CertificateModal from './components/CertificateModal';
import Skills from './components/Skills';
import Community from './components/Community';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  const [activeModalCert, setActiveModalCert] = useState(null);

  const handleOpenCertificate = (cert) => {
    setActiveModalCert(cert);
  };

  const handleCloseCertificate = () => {
    setActiveModalCert(null);
  };

  // Smooth Scroll-Reveal for All Headings and Subheadings
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Query all heading, subheading, title, and section-tag elements
    const headingSelectors = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      '.section-tag',
      '.hero-name',
      '.hero-role',
      '.hero-company',
      '.spotlight-role',
      '.spotlight-company',
      '.past-exp-heading',
      '.exp-role',
      '.edu-degree',
      '.featured-paper-title',
      '.secondary-card-title',
      '.pres-title',
      '.cert-card-title',
      '.skill-name',
      '.community-title',
      '.contact-headline',
      '.footer-name',
      '.footer-role',
      '.footer-company',
      '.section-description',
      '.skills-subtitle',
      '.card-subhead',
      '.about-lead-text'
    ];

    const elements = Array.from(document.querySelectorAll(headingSelectors.join(', ')));

    // Group elements by their parent section or card to assign natural stagger delays
    const containerItemCounts = new Map();

    elements.forEach((el) => {
      el.classList.add('reveal-heading');

      // Determine parent container for context-aware staggering
      const container = el.closest('section, .hero-content, .section-header, .glass-card, .current-role-spotlight, footer') || el.parentElement;
      const count = containerItemCounts.get(container) || 0;
      containerItemCounts.set(container, count + 1);

      // Stagger delay between 0ms and 360ms
      const delay = Math.min(count * 90, 360);
      el.style.transitionDelay = `${delay}ms`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <ThemeProvider>
      <div className="portfolio-root">
        {/* Navigation */}
        <Navbar />

        {/* Main Landmark */}
        <main id="main-content">
          <Hero />
          <About />
          <Experience />
          <Education />
          <Research onSelectCertificate={handleOpenCertificate} />
          <Certificates onSelectCertificate={handleOpenCertificate} />
          <Skills />
          <Community />
          <Contact />
        </main>

        {/* Footer */}
        <Footer />

        {/* Fullscreen Accessible Certificate Lightbox Modal */}
        {activeModalCert && (
          <CertificateModal
            certificate={activeModalCert}
            onClose={handleCloseCertificate}
          />
        )}
      </div>
    </ThemeProvider>
  );
}
