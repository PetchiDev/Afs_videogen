import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './AIGlowBackground.module.css';

const AIGlowBackground = () => {
  const containerRef = useRef(null);
  const blobsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      blobsRef.current.forEach((blob, i) => {
        gsap.to(blob, {
          x: 'random(-100, 100)%',
          y: 'random(-100, 100)%',
          scale: 'random(1, 2)',
          duration: 'random(10, 20)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 2,
        });
      });

      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 40;
        const yPos = (clientY / window.innerHeight - 0.5) * 40;

        gsap.to(containerRef.current, {
          x: xPos,
          y: yPos,
          duration: 2,
          ease: 'power2.out',
        });
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div ref={containerRef} className={styles.container}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            ref={(el) => (blobsRef.current[i] = el)}
            className={styles.glowBlob}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? 'var(--color-primary)' : 'rgba(101, 117, 139, 0.4)',
              filter: `blur(${100 + Math.random() * 100}px)`,
              opacity: 0.15,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AIGlowBackground;
