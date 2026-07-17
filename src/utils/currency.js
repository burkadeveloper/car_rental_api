export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
  }).format(amount);
};
