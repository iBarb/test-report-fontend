// src/api/axiosInstance.ts
import axios from "axios";
import { logout } from "../redux/slices/authSlice"; // Ajusta la ruta según tu estructura
import { store } from "@/redux/store/store";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;
let lastErrorMessage = "";

const axiosInstance = axios.create({
    baseURL: API_URL,
});

// Interceptor de respuesta
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const errorMessage = error.response?.data?.error || "Error con el token";
        console.log(status);
        if (status === 401 || status === 403) {
            store.dispatch(logout());
        }

        // Evita mostrar el mismo toast varias veces seguidas
        if (errorMessage !== lastErrorMessage) {
            toast.error(errorMessage);
            lastErrorMessage = errorMessage;

            // Limpia el mensaje después de unos segundos
            setTimeout(() => (lastErrorMessage = ""), 2000);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
