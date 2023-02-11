export const abbreviateNumber = (number: number) => {
  const numb = Math.abs(Math.round(number)).toString();
  const length = numb.length;
  return length > 9
    ? `${Number(numb.slice(0, -9)).toLocaleString() + '.' + numb.slice(1, 2)}B `
    : 9 >= length && length > 6
    ? `${Number(numb.slice(0, -6)).toLocaleString() + '.' + numb.slice(1, 2)}M `
    : 6 >= length && length > 3
    ? `${Number(numb.slice(0, -3)).toLocaleString() + '.' + numb.slice(2, 3)}K `
    : numb;
};
