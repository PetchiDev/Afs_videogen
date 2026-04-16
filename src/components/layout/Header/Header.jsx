import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { gsap } from 'gsap';
import { useMsal } from '@azure/msal-react';
import LogoutIcon from '@/components/common/Icon/LogoutIcon';
import { MSAL_CONFIG } from '@/config/constants';
import { useTheme } from '@/context/ThemeContext';
import ThemeToggle from '@/components/common/ThemeToggle/ThemeToggle';
import useLayoutStore from '@/store/useLayoutStore';
import styles from './Header.module.css';

// Import Favicon for Logo
import AFSLogo from '@/assets/images/AFS_favicon.gif';

const Header = ({ userName = 'User', userEmail = '' }) => {
  const { instance } = useMsal();
  const { themeMode } = useTheme();
  const { toggleMobileMenu, isMobileMenuOpen } = useLayoutStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const headerRef = useRef(null);
  const profileRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!headerRef.current) return;

    gsap.fromTo(
      headerRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' }
    );
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        profileRef.current && !profileRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: MSAL_CONFIG.auth.postLogoutRedirectUri,
    });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles.leftSection}>
        <button
          className={`${styles.menuToggle} ${isMobileMenuOpen ? styles.active : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle Menu"
        >
          <span className="material-symbols-outlined">
            {isMobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
        <div className={styles.logoWrapper}>
          <img src={AFSLogo} alt="AFS Logo" className={styles.favicon} />
          <span className={styles.platformTitle}>AFS VIDEO GEN</span>
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.themeToggleWrapper}>
          <ThemeToggle />
        </div>

        <div
          ref={profileRef}
          className={`${styles.profileContainer} ${isDropdownOpen ? styles.active : ''}`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className={styles.avatarCircle}>
            <span className={styles.avatarInitials}>{getInitials(userName)}</span>
          </div>

          <div className={styles.profileInfo}>
            <span className={styles.profileName}>{userName}</span>
            <span className={styles.profileEmail}>{userEmail}</span>
          </div>

          {isDropdownOpen && (
            <div ref={dropdownRef} className={styles.dropdownMenu}>
              <button className={styles.dropdownItem} onClick={handleLogout}>
                <LogoutIcon className={styles.logoutIcon} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  userName: PropTypes.string,
  userEmail: PropTypes.string
};

export default Header;
