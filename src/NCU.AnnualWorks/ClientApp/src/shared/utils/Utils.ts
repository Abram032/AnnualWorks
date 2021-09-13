export const scrollToTop = () => {
  window.scrollTo(0, 0);
};

export const fileSizeToHR = (size: number) => {
  if (size == 0) { 
    return "0.00 B"; 
  }
  const e = Math.floor(Math.log(size) / Math.log(1000));
  return (size/Math.pow(1000, e)).toFixed(2)+' kMGTP'.charAt(e)+'B';
}