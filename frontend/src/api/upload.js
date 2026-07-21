import api from "./api";


/**
 * Upload PDF to FastAPI
 */
export const uploadPDF = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/**
 * Get Celery task status
 */
export const getTaskStatus = async (taskId) => {
  const response = await api.get(`/task/${taskId}`);

  return response.data;
};