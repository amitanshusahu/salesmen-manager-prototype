import { AppConfig } from "./AppConfig";

const BASE_URL = `${AppConfig.BACKEND_URL}`;
// const BASE_URL = 'http://192.168.29.226:3000';

// Define the API routes in a structured way
export const API_ROUTES = {
  AUTH: {
    LOGIN: `${BASE_URL}/api/admin/login`,
    SIGNUP: `${BASE_URL}/api/admin/signup`,
    LOGOUT: `${BASE_URL}/api/admin/logout`,
    ME: `${BASE_URL}/api/admin/me`,
  },
  SALESMEN: {
    GET_ALL: `${BASE_URL}/api/admin/get/salesmen/all`,
    GET_BY_MANAGER_ID: `${BASE_URL}/api/admin/get/salesmen/my`,
    CREATE: `${BASE_URL}/api/admin/create/salesmen`,
  },
  LOCATION: {
    GET_ALL: `${BASE_URL}/api/admin/get/locations/all`,
    GET_BY_MANAGER_ID: `${BASE_URL}/api/admin/get/location/my`,
    CREATE: `${BASE_URL}/api/admin/create/location`,
  }
} as const;