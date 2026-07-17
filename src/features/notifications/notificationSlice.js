import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.list.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    setNotifications: (state, action) => {
      state.list = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.isRead).length;
    },
    markRead: (state, action) => {
      const notif = state.list.find((n) => n._id === action.payload);
      if (notif && !notif.isRead) {
        notif.isRead = true;
        state.unreadCount -= 1;
      }
    },
    markAllRead: (state) => {
      state.list.forEach((n) => (n.isRead = true));
      state.unreadCount = 0;
    },
  },
});

export const { addNotification, setNotifications, markRead, markAllRead } =
  notificationSlice.actions;
export default notificationSlice.reducer;
