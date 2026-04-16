import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './CinematicLoader.module.css';

const CinematicLoader = ({ message = "Synthesizing your cinematic masterpiece..." }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const barRef = useRef(null);
  const particleRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main container entrance
      gsap.fromTo(containerRef.current,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 1.5, ease: 'expo.out' }
      );

      // Text pulse and glow
      gsap.to(textRef.current, {
        opacity: 0.6,
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: 'sine.inOut'
      });

      // Animated progress bar
      gsap.fromTo(barRef.current,
        { scaleX: 0, transformOrigin: 'left' },
        { scaleX: 1, duration: 8, repeat: -1, ease: 'power1.inOut' }
      );

      // Particle floating effect
      particleRef.current.forEach((p, i) => {
        gsap.to(p, {
          y: 'random(-100, 100)',
          x: 'random(-50, 50)',
          opacity: 'random(0.1, 0.4)',
          duration: 'random(4, 9)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.1
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={styles.loaderContainer}>
      <div className={styles.backgroundEffects}>
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            ref={el => particleRef.current[i] = el}
            className={styles.particle}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`
            }}
          />
        ))}
      </div>

      <div className={styles.loaderContent}>
        <div className={styles.brandLogo}>AFS VIDEO GEN</div>
        <h2 ref={textRef} className={styles.loaderTitle}>{message}</h2>
        <div className={styles.progressWrapper}>
          <div ref={barRef} className={styles.progressBar}></div>
        </div>
        <p className={styles.loaderHint}>Processing complex neural frames. Estimated time: 5 minutes.</p>
      </div>
    </div>
  );
};

export default CinematicLoader;
