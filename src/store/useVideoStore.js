import { create } from 'zustand';

const useVideoStore = create((set) => ({
  currentVideo: null, // { job_id, video_url, original_text, duration_minutes }
  isGenerating: false,
  error: null,

  setVideo: (video) => set({ currentVideo: video, isGenerating: false, error: null }),
  setGenerating: (status) => set({ isGenerating: status }),
  setError: (error) => set({ error, isGenerating: false }),
  reset: () => set({ currentVideo: null, isGenerating: false, error: null }),
}));

export default useVideoStore;
