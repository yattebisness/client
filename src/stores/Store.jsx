import { create } from 'zustand';

export const useSearchStore = create((set) => ({
  searchQuery: '',
  setSearchQuery: (newQuery) => set({ searchQuery: newQuery })
}));

export const useCategoryStore = create((set) => ({
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category })
}));