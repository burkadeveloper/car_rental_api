import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { BellIcon } from "@heroicons/react/24/outline"; // ✅ v2 path
import { useNotification } from "../../hooks/useNotification";
import {
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from "../../api/apiSlice";
import {
  markRead,
  markAllRead,
} from "../../features/notifications/notificationSlice";
import Modal from "../common/Modal";

const NotificationBell = () => {
  const { t } = useTranslation();
  const { notifications, unreadCount } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [markReadApi] = useMarkNotificationReadMutation();
  const [markAllReadApi] = useMarkAllNotificationsReadMutation();
  const dispatch = useDispatch();

  const handleMarkRead = async (id) => {
    await markReadApi(id);
    dispatch(markRead(id));
  };

  const handleMarkAllRead = async () => {
    await markAllReadApi();
    dispatch(markAllRead());
  };

  return (
    <>
      <button
        className="relative text-white hover:text-gray-200 focus:outline-none"
        onClick={() => setIsOpen(true)}
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={t("notifications")}
        actions={
          <>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-sm text-blue-600 hover:underline"
              >
                Mark all as read
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-secondary"
            >
              {t("close")}
            </button>
          </>
        }
      >
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No notifications</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {notifications.map((notif) => (
                <li
                  key={notif._id}
                  className={`py-3 ${notif.isRead ? "opacity-60" : "bg-blue-50"}`}
                >
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">{notif.title}</h4>
                      <p className="text-sm text-gray-600">{notif.message}</p>
                      <span className="text-xs text-gray-400">
                        {new Date(notif.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {!notif.isRead && (
                      <button
                        onClick={() => handleMarkRead(notif._id)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>
    </>
  );
};

export default NotificationBell;
