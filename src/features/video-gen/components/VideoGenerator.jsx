import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { gsap } from 'gsap';
import { toast } from 'react-toastify';
import { videoService } from '@/services/video.service';
import useVideoStore from '@/store/useVideoStore';
import CinematicLoader from './CinematicLoader';
import styles from './VideoGenerator.module.css';

const VideoGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(0.5);
  const [isLoading, setIsLoading] = useState(false);
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const setVideo = useVideoStore(state => state.setVideo);

  const containerRef = useRef(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.gen-animate', 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'expo.out' }
      );
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const result = await videoService.generateVideo(prompt, duration);
      setVideo({
        ...result,
        original_text: prompt,
        duration_minutes: duration
      });
      navigate({ to: `/player/${result.job_id}` });
    } catch (error) {
      console.error('Generation failed:', error);
      const msg = error?.response?.data?.message || error?.message || 'Failed to generate video. Please try again.';
      toast.error(msg, { toastId: 'gen-error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDurationChange = (val) => {
    const newVal = Math.max(0.5, Math.min(10, parseFloat((duration + val).toFixed(1))));
    setDuration(newVal);
  };

  const handleDurationInput = (e) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) setDuration(Math.max(0.5, Math.min(10, val)));
  };

  if (isLoading) return <CinematicLoader message="Synthesizing Reality..." />;

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.heroSection}>
        <span className={`${styles.kicker} gen-animate`}>The Future of Cinema</span>
        <h1 className={`${styles.mainTitle} gen-animate`}>
          IMAGINE <br />
          <span className={styles.accentText}>EVERY FRAME</span>
        </h1>
        <p className={`${styles.description} gen-animate`}>
          Convert complex narratives into high-fidelity cinematic experiences using the world's most advanced AI video synthesis engine.
        </p>
      </div>

      <div ref={cardRef} className={`${styles.perspectiveContainer} gen-animate`}>
        <div className={styles.formCard}>
          <div className={styles.cardInternalGlow} />
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <span className="material-symbols-outlined">movie_edit</span>
                Cinematic Prompt
              </label>
              <textarea
                className={styles.textarea}
                placeholder="Describe the atmosphere, camera movement, and lighting... e.g., 'A cyberpunk street at night, rain glistening on pavement, neon signs flickering...'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
              />
            </div>

            <div className={styles.formFooter}>
              <div className={styles.durationControl}>
                <label className={styles.label}>
                  <span className="material-symbols-outlined">timer</span>
                  Duration (min)
                </label>
                <div className={styles.numberStepper}>
                  <button type="button" onClick={() => handleDurationChange(-0.5)} className={styles.stepBtn}>
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <input
                    type="number"
                    value={duration}
                    onChange={handleDurationInput}
                    className={styles.durationInput}
                    min="0.5"
                    max="10"
                    step="0.5"
                  />
                  <button type="button" onClick={() => handleDurationChange(0.5)} className={styles.stepBtn}>
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>

              <div className={styles.submitWrapper}>
                <button type="submit" className={styles.generateBtn}>
                  <span className={styles.btnContent}>
                    Generate Video
                    <span className="material-symbols-outlined">auto_fix_high</span>
                  </span>
                  <div className={styles.btnPulse} />
                  <div className={styles.btnGlow} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;
