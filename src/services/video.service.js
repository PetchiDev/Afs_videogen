import apiClient from './api';
import { API, VIDEO_GEN_DEFAULTS } from '@/config/constants';

/**
 * Service to handle AI Video Generation and Regeneration.
 */
export const videoService = {
  /**
   * Generates a video based on a prompt and duration.
   * @param {string} text - User prompt.
   * @param {number} durationMinutes - Video duration.
   * @returns {Promise<Object>} - The API response with video_url and job_id.
   */
  generateVideo: async (text, durationMinutes) => {
    const payload = {
      text,
      duration_minutes: durationMinutes,
      avatar_character: VIDEO_GEN_DEFAULTS.AVATAR_CHARACTER,
      avatar_style: VIDEO_GEN_DEFAULTS.AVATAR_STYLE,
      voice_name: VIDEO_GEN_DEFAULTS.VOICE_NAME,
      skip_lim: VIDEO_GEN_DEFAULTS.SKIP_LIM
    };

    const response = await apiClient.post(API.ENDPOINTS.GENERATE_VIDEO, payload);
    return response.data;
  },

  /**
   * Regenerates/Modifies an existing video.
   * @param {string} jobId - Original job ID.
   * @param {string} modificationText - New modification prompt.
   * @returns {Promise<Object>} - The API response with updated video_url.
   */
  regenerateVideo: async (jobId, modificationText) => {
    const payload = {
      job_id: jobId,
      modification_text: modificationText
    };

    const response = await apiClient.post(API.ENDPOINTS.REGENERATE_VIDEO, payload);
    return response.data;
  }
};

export default videoService;
