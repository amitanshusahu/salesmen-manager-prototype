import { API_ROUTES } from "@/constants/ApiRoutes";
import { api } from "../axios/axios";

export async function postLogin({email, password}: {email: string, password: string}) {
  const res = await api.post(API_ROUTES.AUTH.LOGIN, {email, password});
  return res.data;
}

export async function postSignup({name, email, password}: {name: string, email: string, password: string}) {
  console.log("signup called")
  const res = await api.post(API_ROUTES.AUTH.SIGNUP, {name, email, password});
  return res.data;
}

export async function addSalesMan({ name, userid }: { name: string, userid: string }) {
  const res = await api.post(API_ROUTES.SALESMEN.CREATE, { name, userid });
  return res.data;
}

export async function addLocation({name, address, latitude, longitude}: {name: string, address: string, latitude: number, longitude: number}) {
  const res = await api.post(API_ROUTES.LOCATION.CREATE, { name, address, latitude, longitude });
  console.log(res.data);
  return res.data;
}