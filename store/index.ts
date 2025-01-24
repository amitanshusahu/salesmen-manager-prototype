import { create } from "zustand";

interface UserState {
    isLogedIn: boolean;
    setIsLogedIn: (val: boolean) => void;
    isOnline: boolean;
    setIsOnline: (val: boolean) => void;
    userDetails: {
        name: string;
        email: string;
        id: number
    } | null;
    setUserDetails: (val: { name: string, email: string, id: number }) => void;
}

interface MannagedCounts {
    totalSalesmen: number;
    totalStores: number;
    setTotalSalesmen: (val: number) => void;
    setTotalStores: (val: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
    isLogedIn: false,
    setIsLogedIn: (val) => set(() => ({ isLogedIn: val })),
    isOnline: false,
    setIsOnline: (val) => set(() => ({ isOnline: val })),
    userDetails: null,
    setUserDetails: (val) => set(() => ({ userDetails: val })),
}));

export const useMannagedCounts = create<MannagedCounts>((set) => ({
    totalSalesmen: 0,
    totalStores: 0,
    setTotalSalesmen: (val) => set(() => ({ totalSalesmen: val })),
    setTotalStores: (val) => set(() => ({ totalStores: val })),
}));
