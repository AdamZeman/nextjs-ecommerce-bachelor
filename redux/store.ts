'use client'

import {combineReducers, configureStore} from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import filterReducer from "@/redux/slices/filterSlice";
import basketReducer from "@/redux/slices/basketSlice";

const createNoopStorage = () => {
    return {
        getItem() {
            return Promise.resolve(null);
        },
        setItem(_key: string, value: number) {
            return Promise.resolve(value);
        },
        removeItem() {
            return Promise.resolve();
        },
    };
};

const storage =
    typeof window !== "undefined"
        ? createWebStorage("local")
        : createNoopStorage();

const rootReducer = combineReducers({
    filter: filterReducer,
    basket: basketReducer
});

const persistConfig = {
    key: "root",
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);