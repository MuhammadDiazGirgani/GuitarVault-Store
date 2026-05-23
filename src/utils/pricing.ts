export const isWeekendSale = () => {
  const day = new Date().getDay();

  return day === 0 || day === 6;
};

export const getDiscountedPrice = (price: number) => {
  return Math.round(price * 0.8);
};

export const getFinalPrice = (price: number) => {
  return isWeekendSale()
    ? getDiscountedPrice(price)
    : price;
};