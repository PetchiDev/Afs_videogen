import React, { useEffect, useRef } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { gsap } from 'gsap';
import { ROUTES } from '@/config/constants';
import useLayoutStore from '@/store/useLayoutStore';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const sidebarRef = useRef(null);
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const { isMobileMenuOpen, closeMobileMenu } = useLayoutStore();

  useEffect(() => {
    // Initial desktop/mobile entrance
    const ctx = gsap.context(() => {
      gsap.fromTo('.sidebar-animate', 
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out' }
      );
    }, sidebarRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // Mobile-specific sliding animation handled by CSS transitions for simplicity/performance
    // but we could use GSAP if preferred. Sticking to CSS for the main slide.
  }, [isMobileMenuOpen]);

  const navigationItems = [
    { id: 'home', label: 'Studio', icon: 'home', path: ROUTES.HOME },
    { id: 'projects', label: 'Projects', icon: 'movie_filter', path: '/projects' },
    { id: 'templates', label: 'Templates', icon: 'auto_awesome_motion', path: '/templates' },
    { id: 'archive', label: 'Archive', icon: 'inventory_2', path: '/archive' }
  ];

  const isActiveRoute = (path) => {
    return currentPath === path || (path === ROUTES.HOME && currentPath === '/');
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobileMenuOpen && (
        <div className={styles.backdrop} onClick={closeMobileMenu} />
      )}

      <aside 
        ref={sidebarRef} 
        className={`${styles.sidebar} ${isMobileMenuOpen ? styles.isOpen : ''}`}
      >
        <div className={styles.mobileHeader}>
          <span className={styles.mobileTitle}>Menu</span>
          <button className={styles.closeBtn} onClick={closeMobileMenu}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className={`${styles.projectCard} sidebar-animate`}>
          <div className={styles.projectIcon}>
            <span className="material-symbols-outlined">movie_filter</span>
          </div>
          <div className={styles.projectInfo}>
            <h3 className={styles.projectName}>Project Alpha</h3>
            <p className={styles.projectTag}>Cinematic Suite</p>
          </div>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navGroup}>
            {navigationItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`${styles.navItem} ${isActiveRoute(item.path) ? styles.active : ''} sidebar-animate`}
                onClick={closeMobileMenu}
                disabled={item.id !== 'home'}
              >
                <span className={`material-symbols-outlined ${styles.navIcon}`}>
                  {item.icon}
                </span>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className={`${styles.actionWrapper} sidebar-animate`}>
            <button className={styles.newPromptBtn}>
              <span className="material-symbols-outlined">add</span>
              <span>New Prompt</span>
            </button>
          </div>
        </nav>

        <div className={`${styles.footerNav} sidebar-animate`}>
          <a href="#help" className={styles.footerLink}>
            <span className="material-symbols-outlined">help_outline</span>
            <span>Help</span>
          </a>
          <a href="#logout" className={styles.footerLink}>
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </a>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
