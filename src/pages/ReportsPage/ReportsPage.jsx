import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from '@tanstack/react-router';
import { gsap } from 'gsap';
import { toast } from 'react-toastify';
import { jobService } from '@/services/job.service';
import useVideoStore from '@/store/useVideoStore';
import styles from './ReportsPage.module.css';

// ─── helpers ────────────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

// ─── Delete Confirmation Modal ───────────────────────────────────────────────
const DeleteModal = ({ job, onConfirm, onCancel }) => (
  <div className={styles.modalBackdrop} onClick={onCancel}>
    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
      <div className={styles.modalIcon}>
        <span className="material-symbols-outlined">delete_forever</span>
      </div>
      <h3 className={styles.modalTitle}>Delete Job?</h3>
      <p className={styles.modalBody}>
        Are you sure you want to delete&nbsp;
        <strong>{job?.filename || job?.job_id?.slice(0, 8)}</strong>?
        This action cannot be undone.
      </p>
      <div className={styles.modalActions}>
        <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
        <button className={styles.confirmDeleteBtn} onClick={onConfirm}>
          <span className="material-symbols-outlined">delete</span>
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── Job Detail Modal ────────────────────────────────────────────────────────
const DetailModal = ({ detail, onClose }) => (
  <div className={styles.modalBackdrop} onClick={onClose}>
    <div className={`${styles.modal} ${styles.detailModal}`} onClick={(e) => e.stopPropagation()}>
      <div className={styles.detailHeader}>
        <h3 className={styles.modalTitle}>Job Details</h3>
        <button className={styles.closeIcon} onClick={onClose}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className={styles.detailBody}>
        <div className={styles.detailGrid}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Job ID</span>
            <span className={styles.detailValue}>{detail.job_id}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Status</span>
            <span className={`${styles.detailValue} ${styles[`status${detail.status}`]}`}>
              {detail.status}
            </span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Created At</span>
            <span className={styles.detailValue}>{formatDate(detail.created_at)}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Last Updated</span>
            <span className={styles.detailValue}>{formatDate(detail.last_updated_at)}</span>
          </div>
        </div>

        {detail.video_url && (
          <div className={styles.videoPreviewWrapper}>
            <p className={styles.detailLabel}>Video Preview</p>
            <video
              className={styles.videoPreview}
              src={detail.video_url}
              controls
              autoPlay
              playsInline
            />
          </div>
        )}

        {detail.error && (
          <div className={styles.errorBox}>
            <span className="material-symbols-outlined">error</span>
            <span>{detail.error}</span>
          </div>
        )}
      </div>

      <div className={styles.detailFooter}>
        {detail.video_url && (
          <a
            href={detail.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.openLinkBtn}
          >
            <span className="material-symbols-outlined">open_in_new</span>
            Open Video
          </a>
        )}
        <button className={styles.cancelBtn} onClick={onClose}>Close</button>
      </div>
    </div>
  </div>
);

// ─── Main Reports Page ───────────────────────────────────────────────────────
const ReportsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const setVideo = useVideoStore((state) => state.setVideo);

  // ── Fetch list ─────────────────────────────────────────────────────────────
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await jobService.getJobs();
      setJobs(data.jobs || []);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to load jobs.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // ── GSAP entrance ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!loading && containerRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo('.report-row',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: 'power2.out' }
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading]);

  // ── Edit / Redirect to Player ─────────────────────────────────────────────
  const handleEdit = async (job) => {
    setDetailLoading(true);
    try {
      const data = await jobService.getJob(job.job_id);
      // Update store with job data
      setVideo({
        ...data
      });
      // Redirect to player
      navigate({
        to: '/player/$jobId',
        params: { jobId: data.job_id }
      });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to load job details.';
      toast.error(msg);
    } finally {
      setDetailLoading(false);
    }
  };

  // ── Delete flow ────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const { job_id, filename } = deleteTarget;
    setDeleteTarget(null);
    try {
      await jobService.deleteJob(job_id);
      toast.success(`"${filename || job_id.slice(0, 8)}" deleted successfully.`);
      setJobs((prev) => prev.filter((j) => j.job_id !== job_id));
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to delete job.';
      toast.error(msg);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className={styles.page}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>
            <span className="material-symbols-outlined">bar_chart</span>
            Reports
          </h1>
          <p className={styles.pageSubtitle}>All generated avatar video jobs</p>
        </div>
        <button className={styles.refreshBtn} onClick={fetchJobs} title="Refresh">
          <span className="material-symbols-outlined">refresh</span>
        </button>
      </div>

      {/* Table Card */}
      <div className={styles.tableCard}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <span>Loading jobs...</span>
          </div>
        ) : jobs.length === 0 ? (
          <div className={styles.emptyState}>
            <span className="material-symbols-outlined">movie_off</span>
            <p>No jobs found. Generate a video to get started.</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>File Name</th>
                  <th>URL</th>
                  <th>Duration</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, idx) => (
                  <tr key={job.job_id} className="report-row">
                    <td className={styles.indexCell}>{idx + 1}</td>
                    <td className={styles.fileNameCell}>
                      {job.filename || '—'}
                    </td>
                    <td>
                      {job.video_url ? (
                        <a
                          href={job.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.videoLink}
                        >
                          <span className="material-symbols-outlined">play_circle</span>
                          VideoLink
                        </a>
                      ) : '—'}
                    </td>
                    <td className={styles.durationCell}>
                      {job.duration_minutes != null ? `${job.duration_minutes} min` : '—'}
                    </td>
                    <td className={styles.dateCell}>{formatDate(job.created_at)}</td>
                    <td className={styles.actionsCell}>
                      <button
                        className={styles.actionBtn}
                        title="Edit / Refine"
                        onClick={() => handleEdit(job)}
                        disabled={detailLoading}
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.deleteActionBtn}`}
                        title="Delete"
                        onClick={() => setDeleteTarget(job)}
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals via Portal for whole-screen blur */}
      {deleteTarget && createPortal(
        <DeleteModal
          job={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />,
        document.body
      )}

      {detailLoading && createPortal(
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <div className={styles.spinner} />
            <p style={{ marginTop: 12 }}>Loading details...</p>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ReportsPage;
