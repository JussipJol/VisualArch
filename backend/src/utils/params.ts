/** Safely extract a single string from Express route params */
export const p = (param: string | string[]): string =>
  Array.isArray(param) ? param[0] : param;
