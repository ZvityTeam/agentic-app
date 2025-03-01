import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { authReducer } from './slices/auth-slice';
import { agentsReducer } from './slices/agents-slice';
import { uiReducer } from './slices/ui-slice';

const isDevelopment = process.env.NODE_ENV === 'development';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    agents: agentsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({
      serializableCheck: false,
    });
    
    if (isDevelopment) {
      return middleware.concat(logger);
    }
    
    return middleware;
  },
  devTools: isDevelopment,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;