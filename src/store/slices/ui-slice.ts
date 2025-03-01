import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  activeModal: string | null;
  notifications: {
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
  }[];
}

const initialState: UIState = {
  sidebarOpen: true,
  activeModal: null,
  notifications: [],
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.activeModal = action.payload;
    },
    closeModal: (state) => {
      state.activeModal = null;
    },
    addNotification: (
      state,
      action: PayloadAction<{
        message: string;
        type: 'info' | 'success' | 'warning' | 'error';
      }>
    ) => {
      const id = Date.now().toString();
      state.notifications.push({
        id,
        message: action.payload.message,
        type: action.payload.type,
        read: false,
      });
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification) {
        notification.read = true;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  addNotification,
  markNotificationAsRead,
  clearNotifications,
} = uiSlice.actions;

export const uiReducer = uiSlice.reducer;