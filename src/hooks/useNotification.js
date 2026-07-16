import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNotifications } from "../features/notifications/notificationSlice";
import { useGetNotificationsQuery } from "../api/apiSlice";

export const useNotification = () => {
  const dispatch = useDispatch();
  const { data } = useGetNotificationsQuery();
  const notifications = useSelector((state) => state.notifications.list);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);

  useEffect(() => {
    if (data) {
      dispatch(setNotifications(data));
    }
  }, [data, dispatch]);

  return { notifications, unreadCount };
};
