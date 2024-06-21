import BigNumber from 'bignumber.js';

export function mul(a: number, b: number) {
  return new BigNumber(a).times(new BigNumber(b));
}
export function div(a: number, b: number) {
  return new BigNumber(a).div(new BigNumber(b));
}
