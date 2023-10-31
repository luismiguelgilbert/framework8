import axios, { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';
export default function useAxios() {
  let myAxios: AxiosInstance = axios.create({
    baseURL: '/',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  myAxios.interceptors.response.use(function (response) {
    return response;
  }, function (error: Error | AxiosError) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigateTo('/login?error=expired');
    } else {
      throw error;
    }
  });

  return myAxios;
};