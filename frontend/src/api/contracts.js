import api from "./api";

export const listContracts = async () => {
  const response = await api.get("/contracts");
  return response.data;
};

export const getContract = async (id) => {
  const response = await api.get(`/contracts/${id}`);
  return response.data;
};

export const getSimilarContracts = async (id) => {
  const response = await api.get(`/contracts/${id}/similar`);
  return response.data;
};
