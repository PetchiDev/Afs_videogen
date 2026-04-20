import apiClient from './api';

/**
 * Service to handle Job Reports (list, get, delete).
 */
export const jobService = {
  /** GET /api/v1/jobs */
  getJobs: async () => {
    const response = await apiClient.get('/api/v1/jobs');
    return response.data;
  },

  /** GET /api/v1/job/{job_id} */
  getJob: async (jobId) => {
    const response = await apiClient.get(`/api/v1/job/${jobId}`);
    return response.data;
  },

  /** DELETE /api/v1/job/{job_id} */
  deleteJob: async (jobId) => {
    const response = await apiClient.delete(`/api/v1/job/${jobId}`);
    return response.data;
  }
};

export default jobService;
