import axios from "axios";

    export const api = axios.create(
    { 
        baseURL: import.meta.env.VITE_API_URL || "http://localhost:5106"
    });

    export type SpinReq = 
    { 
        name: string; 
        phone: string 
    };

    export type SpinRes = 
    { 
        won: boolean; 
        giftName?: string; 
        message: string; 
        segments: string[]; 
        targetIndex: number 
    };

    export const spin = (data: SpinReq) => api.post<SpinRes>("/api/spins", data).then(r => r.data);

    export type Gift = 
    { 
        id: number; 
        name: string; 
        stock: number; 
        weight: number; 
        isActive: boolean 
    };

    export const listGifts = () => api.get<Gift[]>("/api/gifts").then(r => r.data);