import axios, { AxiosError } from 'axios';
export default function useAxios() {
  let myAxios: axiosInstance = axios.create({
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
      navigateTo('/login');
    } else {
      throw error;
    }
  });

  return myAxios;
};