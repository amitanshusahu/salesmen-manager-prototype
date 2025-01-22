import { useState, useEffect } from "react";
import axios, { AxiosInstance } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppConfig } from "@/constants/AppConfig";
import { Alert } from "react-native";

const TOKEN_NAME = AppConfig.TOKEN_NAME;

export const useApi = () => {
  const [axiosInstance, setAxiosInstance] = useState<AxiosInstance>(() =>
    axios.create({
      withCredentials: true,
      headers: { Accept: "application/json", "User-Agent": "ExpoApp/1.0" },
    })
  );

  useEffect(() => {
    const configureAxios = async () => {
      try {
        const token = await AsyncStorage.getItem(TOKEN_NAME);
        const parsedToken = token ? JSON.parse(token)?.token : null;

        const instance = axios.create({
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "User-Agent": "ExpoApp/1.0",
            ...(parsedToken && { Authorization: `Bearer ${parsedToken}` }),
          },
        });

        setAxiosInstance(instance);
      } catch (error) {
        console.error("Error configuring Axios instance:", error);
        Alert.alert("Error", "Failed to configure Axios.");
      }
    };

    configureAxios();
  }, []);

  const updateToken = async (newToken: string | null) => {
    try {
      if (newToken) {
        await AsyncStorage.setItem(TOKEN_NAME, JSON.stringify({ token: newToken }));
      } else {
        await AsyncStorage.removeItem(TOKEN_NAME);
      }

      // Update Axios instance with new token
      setAxiosInstance((prev: AxiosInstance) =>
        axios.create({
          ...prev.defaults,
          headers: {
            ...prev.defaults.headers,
            Authorization: newToken ? `Bearer ${newToken}` : undefined,
          },
        })
      );
    } catch (error) {
      console.error("Failed to update token:", error);
      Alert.alert("Error", "Failed to update token.");
    }
  };

  return { axiosInstance, updateToken };
};
