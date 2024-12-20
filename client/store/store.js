import { configureStore } from '@reduxjs/toolkit';
import explorerReducer from './slices/explorerSlice';

const store = configureStore({
  reducer: {
    explorer: explorerReducer,
  },
});

export default store;
