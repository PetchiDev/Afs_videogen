import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import VideoGenerator from '@/features/video-gen/components/VideoGenerator';
import AIGlowBackground from '@/features/video-gen/components/AIGlowBackground';
import styles from './PromptPage.module.css';

const PromptPage = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Direct visibility enforcement
      gsap.set('.prompt-reveal', { opacity: 1 });

      // Clean staggered entrance
      gsap.fromTo('.prompt-reveal', 
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, stagger: 0.2, ease: 'expo.out', delay: 0.3 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={styles.pageContainer}>
      <div className="bg-entrance">
        <AIGlowBackground />
      </div>
      
      <div className={`${styles.content} prompt-reveal`}>
        <VideoGenerator />
      </div>
      
      <div className={`${styles.footer} prompt-reveal`}>
        <p>© 2026 AI Video Generation Platform. Powered by AFS Core.</p>
      </div>
    </div>
  );
};

export default PromptPage;
