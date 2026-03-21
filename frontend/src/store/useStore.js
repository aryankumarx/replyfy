import { create } from 'zustand';

const useStore = create((set, get) => ({
  // User state
  userId: 'anonymous',
  userTier: 'free',
  
  // Usage tracking
  usage: {
    used: 0,
    limit: 20,
    remaining: 20,
  },
  
  // Current message being processed
  currentMessage: '',
  contextMessages: [],
  
  // Suggestions
  suggestions: [],
  isLoading: false,
  error: null,
  
  // API configuration
  apiUrl: 'http://localhost:3000/api', // Change this to your deployed URL
  
  // Actions
  setCurrentMessage: (message) => set({ currentMessage: message }),
  
  setContextMessages: (messages) => set({ contextMessages: messages }),
  
  setSuggestions: (suggestions) => set({ suggestions }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  updateUsage: (usage) => set({ usage }),
  
  setUserId: (userId) => set({ userId }),
  
  setUserTier: (tier) => set({ userTier }),
  
  // Clear all suggestions
  clearSuggestions: () => set({ 
    suggestions: [], 
    currentMessage: '',
    error: null 
  }),
  
  // Reset error
  clearError: () => set({ error: null }),
}));

export default useStore;
