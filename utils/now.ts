import * as ms from 'ms';

export const now = (shift: string = '0s') => {
  return new Date(new Date().getTime() + ms(shift));
};
