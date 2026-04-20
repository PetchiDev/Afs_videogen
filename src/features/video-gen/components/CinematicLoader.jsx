import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styles from './CinematicLoader.module.css';

const SCENES = [
  { label: 'Synthesizing neural frames...', color: '#EE202E', bg: 'scene1' },
  { label: 'Rendering cinematic depth...', color: '#7C3AED', bg: 'scene2' },
  { label: 'Compositing light dynamics...', color: '#0891B2', bg: 'scene3' },
  { label: 'Encoding visual narrative...', color: '#059669', bg: 'scene4' },
  { label: 'Finalizing your masterpiece...', color: '#EE202E', bg: 'scene5' },
];

const CinematicLoader = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const barRef = useRef(null);
  const captionRef = useRef(null);
  const sceneRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance
      gsap.fromTo(containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power2.out' }
      );
      // Progress bar
      gsap.fromTo(barRef.current,
        { scaleX: 0, transformOrigin: 'left' },
        { scaleX: 1, duration: 8, repeat: -1, ease: 'power1.inOut' }
      );
    }, containerRef);

    // Scene rotation every 5s
    intervalRef.current = setInterval(() => {
      const ni = (currentIndex + 1) % SCENES.length;

      // Scene cross-fade
      gsap.to(sceneRef.current, {
        opacity: 0,
        duration: 0.8,
        onComplete: () => {
          setCurrentIndex(ni);
          gsap.to(sceneRef.current, { opacity: 1, duration: 0.8 });
        }
      });

      // Caption animation
      if (captionRef.current) {
        gsap.to(captionRef.current, {
          opacity: 0, y: -12, duration: 0.35,
          onComplete: () => {
            setCurrentIndex(ni);
            gsap.fromTo(captionRef.current,
              { opacity: 0, y: 12 },
              { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
            );
          }
        });
      }
    }, 25000);

    return () => {
      clearInterval(intervalRef.current);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const scene = SCENES[currentIndex];

  return (
    <div ref={containerRef} className={styles.loaderContainer}>
      {/* Animated cinematic background */}
      <div
        ref={sceneRef}
        className={`${styles.cinematicBg} ${styles[scene.bg]}`}
      >
        {/* Floating orbs */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={styles.orb}
            style={{ '--i': i, '--color': scene.color }}
          />
        ))}
        {/* Grid lines */}
        <div className={styles.gridOverlay} />
        {/* Scan line */}
        <div className={styles.scanLine} />
      </div>

      {/* Dark vignette */}
      <div className={styles.vignette} />

      {/* Content card */}
      <div className={styles.loaderContent}>
        <div className={styles.brandLogo}>AFS AVATAR GENERATOR</div>

        <div className={styles.messageRow}>
          <span
            className={styles.spinnerDot}
            style={{ '--dot-color': scene.color }}
          />
          <p ref={captionRef} className={styles.loaderTitle}>
            {scene.label}
          </p>
        </div>

        <div className={styles.progressWrapper}>
          <div
            ref={barRef}
            className={styles.progressBar}
            style={{ '--bar-color': scene.color }}
          />
        </div>

        {/* Dot indicators */}
        <div className={styles.dotStrip}>
          {SCENES.map((_, i) => (
            <div
              key={i}
              className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ''}`}
              style={i === currentIndex ? { '--dot-color': scene.color } : {}}
            />
          ))}
        </div>

        <p className={styles.loaderHint}>
          Processing complex neural frames — estimated time: &lt;2 min
        </p>
      </div>
    </div>
  );
};

export default CinematicLoader;
