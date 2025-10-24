import storage from "redux-persist/lib/storage"; // localStorage
import type { PersistConfig } from "redux-persist";
import type { RootState } from "./store";

// Configuración genérica, abierta a extensión (Open/Closed)
const persistConfig: PersistConfig<RootState> = {
    key: "root",
    version: 1,
    storage,
    whitelist: ["auth"], // Reducers que quieres persistir
};

export default persistConfig;
