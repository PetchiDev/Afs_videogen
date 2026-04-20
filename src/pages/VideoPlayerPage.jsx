import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { gsap } from 'gsap';
import { toast } from 'react-toastify';
import { videoService } from '@/services/video.service';
import useVideoStore from '@/store/useVideoStore';
import CinematicLoader from '@/features/video-gen/components/CinematicLoader';
import styles from './VideoPlayerPage.module.css';

const VideoPlayerPage = () => {
  // const { jobId } = useParams({ strict: false });
  // const { jobId } = useParams({ from: '/player/$jobId' });
  const { jobId } = useParams({ strict: false });

  const navigate = useNavigate();
  const { currentVideo, setVideo } = useVideoStore();

  const [isEditing, setIsEditing] = useState(false);
  const [modificationPrompt, setModificationPrompt] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);

  const containerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.from('.player-reveal', {
        y: 60,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: 'expo.out'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleRegenerate = async () => {
    if (!modificationPrompt.trim()) return;

    setIsRegenerating(true);
    try {
      const result = await videoService.regenerateVideo(jobId, modificationPrompt);

      gsap.to(videoRef.current, {
        filter: 'blur(20px) brightness(0)',
        opacity: 0,
        duration: 0.6,
        onComplete: () => {
          setVideo({
            ...currentVideo,
            video_url: result.video_url,
            job_id: result.job_id || jobId
          });
          gsap.fromTo(videoRef.current,
            { filter: 'blur(20px) brightness(0)', opacity: 0 },
            { filter: 'blur(0px) brightness(1)', opacity: 1, duration: 1, ease: 'power2.out' }
          );
        }
      });

      setIsEditing(false);
      setModificationPrompt('');
    } catch (error) {
      console.error('Regeneration failed:', error);
      const msg = error?.response?.data?.message || error?.message || 'Failed to regenerate video.';
      toast.error(msg, { toastId: 'regen-error' });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleShare = async () => {
    const videoUrl = currentVideo?.video_url;
    if (!videoUrl) {
      toast.error('No video available to share.');
      return;
    }
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Generated Video – AFS AVATAR GENERATOR',
          text: 'Check out this AI-generated video!',
          url: videoUrl
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          toast.error('Share failed. Try copying the link manually.');
        }
      }
    } else {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(videoUrl);
        toast.success('Video link copied to clipboard! ');
      } catch {
        toast.error('Unable to copy link. Please try manually.');
      }
    }
  };

  const handleDownload = async () => {
    const downloadUrl = currentVideo?.download_url || currentVideo?.video_url;
    if (!downloadUrl) {
      toast.error('No video available for download.');
      return;
    }

    const toastId = toast.loading('Preparing download...');
    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error('Network response was not ok');

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      // Use filename from response if available, else generate 
      const fileName = currentVideo?.filename || `afs-video-${jobId?.slice(0, 8)}.mp4`;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);
      toast.update(toastId, {
        render: 'Download started!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });
    } catch (err) {
      console.error('Download failed:', err);
      toast.update(toastId, {
        render: 'Download failed. Opening in new tab...',
        type: 'info',
        isLoading: false,
        autoClose: 3000
      });
      // Final fallback to new tab
      window.open(downloadUrl, '_blank');
    }
  };

  if (isRegenerating) return <CinematicLoader message="Refining Director's Intent..." />;

  return (
    <div ref={containerRef} className={styles.pageContainer}>
      <div className={styles.mainCanvas}>
        {/* Navigation Action */}
        <div className={`${styles.backToHomeWrapper} player-reveal`}>
          <button className={styles.backToHome} onClick={() => navigate({ to: '/' })}>
            <span className="material-symbols-outlined">arrow_back</span>
            <span>Back to Home</span>
          </button>
        </div>

        {/* Header Metadata */}
        <header className={`${styles.playerHeader} player-reveal`}>
          <div>
            <h1 className={styles.videoTitle}>Generated Video </h1>
            <div className={styles.metadataRow}>
              <span className={styles.statusTag}>
                <span className={styles.pulseDot}></span> Generative
              </span>
              <span className={styles.typeTag}>4K Cinematic</span>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.iconBtn} aria-label="Share" onClick={handleShare}>
              <span className="material-symbols-outlined">share</span>
            </button>
            <button className={styles.iconBtn} aria-label="Download" onClick={handleDownload}>
              <span className="material-symbols-outlined">download</span>
            </button>
          </div>
        </header>

        {/* Cinematic Video Player */}
        <div className={`${styles.videoCenterpiece} player-reveal`}>
          <div className={styles.cinematicAspect}>
            {currentVideo?.video_url ? (
              <video
                ref={videoRef}
                key={currentVideo.video_url}
                className={styles.videoPlayer}
                controls
                autoPlay
              >
                <source src={currentVideo.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className={styles.notFound}>
                <span className="material-symbols-outlined">running_with_errors</span>
                <p>Media Asset Not Found</p>
                <button onClick={() => navigate({ to: '/' })} className={styles.backBtn}>Return to Studio</button>
              </div>
            )}

            {/* Player Overlays */}
            <div className={styles.playerOverlay}>
              <div className={styles.overlayTop}>
                <div className={styles.sceneTag}>
                  <span className={styles.sceneDot}></span>
                  <span>Neural Convergence • Scene 01</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Refinement Interface */}
        <section className={`${styles.refinementGrid} player-reveal`}>
          <div className={styles.editSection}>
            <div className={styles.sectionHeading}>
              <div className={styles.sectionIcon}><span className="material-symbols-outlined">edit_note</span></div>
              <h3>Refine Director's Intent</h3>
            </div>

            <div className={styles.sunkenTextAreaWrapper}>
              <textarea
                className={styles.editTextarea}
                placeholder="Describe architectural shifts, lighting changes, or camera movement updates..."
                value={modificationPrompt}
                onChange={(e) => setModificationPrompt(e.target.value)}
              />
              <div className={styles.textareaFooter}>
                <div className={styles.engineMeta}>
                  <span>v.4.2 Engine</span>
                  <span>Seed: {Math.floor(Math.random() * 900000)}</span>
                </div>
                <button className={styles.regenerateBtn} onClick={handleRegenerate}>
                  <span className="material-symbols-outlined">autorenew</span>
                  <span>Regenerate Scene</span>
                </button>
              </div>
            </div>
          </div>

          <div className={styles.statusSection}>
            <div className={styles.statusCard}>
              <h4 className={styles.statusHeading}>Generation Properties</h4>
              <div className={styles.propertyList}>
                <div className={styles.propertyItem}>
                  <span>Upscaling Base</span>
                  <span className={styles.completeStatus}>COMPLETE</span>
                </div>
                <div className={styles.propertyItem}>
                  <span>Temporal Smoothing</span>
                  <span className={styles.processingStatus}>ACTIVE</span>
                </div>
              </div>
              <div className={styles.miniTimeline}>
                <div className={styles.timelineBar} style={{ width: '65%' }}></div>
              </div>
              <div className={styles.aiTags}>
                <span>#CINEMATIC</span>
                <span>#ANAMORPHIC</span>
                <span>#NEON-RED</span>
              </div>
            </div>
          </div>
        </section>


      </div>
    </div>
  );
};

export default VideoPlayerPage;
