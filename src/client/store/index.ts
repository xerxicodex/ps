import create from 'zustand';
import { ITrainer } from '../lib/types';

type Store = {
  authTrainer: ITrainer | null;
  pageLoading: boolean;
  setAuthTrainer: (trainer: ITrainer) => void;
  setPageLoading: (isLoading: boolean) => void;
};

const useStore = create<Store>((set) => ({
  authTrainer: null,
  pageLoading: false,
  setAuthTrainer: (trainer) => set((state) => ({ ...state, authTrainer: trainer })),
  setPageLoading: (isLoading) =>
    set((state) => ({ ...state, pageLoading: isLoading })),
}));

export default useStore;