import { Trainer } from "@prisma/client";
import create from "zustand";

type Store = {
    authTrainer: Trainer | null;
    pageLoading: boolean;
    setAuthTrainer: (trainer: Trainer) => void;
    setPageLoading: (isLoading: boolean) => void;
};

const useStore = create<Store>((set) => ({
    authTrainer: null,
    pageLoading: false,
    setAuthTrainer: (trainer) =>
        set((state) => ({ ...state, authTrainer: trainer })),
    setPageLoading: (isLoading) =>
        set((state) => ({ ...state, pageLoading: isLoading })),
}));

export default useStore;
