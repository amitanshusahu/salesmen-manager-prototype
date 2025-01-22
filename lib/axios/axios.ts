import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConfig } from "@/constants/AppConfig";

export const api = axios.create({
  withCredentials: true,
  headers: { 'Accept': 'application/json', 'User-Agent': 'ExpoApp/1.0' },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(AppConfig.TOKEN_NAME);
      const parsedData = token ? JSON.parse(token) : null;

      if (parsedData && parsedData.token) {
        config.headers.Authorization = `Bearer ${parsedData.token}`;
      }
    } catch (error) {
      console.error('Error retrieving token from AsyncStorage:', error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
