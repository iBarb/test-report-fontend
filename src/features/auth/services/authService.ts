import axios from "axios";
import type { LoginData, RegisterData } from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (data: RegisterData) => {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
};

export const loginUser = async (data: LoginData) => {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    return response.data;
};
