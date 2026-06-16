import { configureStore } from '@reduxjs/toolkit';
import { injectStore } from "../api/axiosInstance";
import rootReducer from "./rootReducers"

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ 
        serializableCheck: false
    }),
});


injectStore(store);