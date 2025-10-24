import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice from "../slices/authSlice";

// 🔹 Root Reducer centralizado
const rootReducer = combineReducers({
    auth: authSlice,
});

// 🔹 Configuración de persistencia
const persistConfig = {
    key: "root",
    version: 1,
    storage,
    whitelist: ["auth"], // Reducers que quieres persistir
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 🔹 Store principal
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// 🔹 Persistor
export const persistor = persistStore(store);

// 🔹 Tipos
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
