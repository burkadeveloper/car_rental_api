import { format, parseISO } from "date-fns";

export const formatDate = (date) => {
  if (!date) return "";
  return format(parseISO(date), "MMM dd, yyyy");
};

export const formatDateTime = (date) => {
  if (!date) return "";
  return format(parseISO(date), "MMM dd, yyyy HH:mm");
};
