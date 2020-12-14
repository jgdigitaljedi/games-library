export const isPsPlusConsole = (id: number): boolean => {
  const psIds = [9, 48];
  return psIds.indexOf(id) >= 0;
};

export const isGamePassConsole = (id: number): boolean => {
  const gpIds = [12, 49, 6];
  return gpIds.indexOf(id) >= 0;
};

export const isXbGoldConsole = (id: number): boolean => {
  const goldIds = [12, 49];
  return goldIds.indexOf(id) >= 0;
};

export const isPrimeFreeConsole = (id: number): boolean => {
  return id === 6;
};

export const isSwitchFreeConsole = (id: number): boolean => {
  return id === 130;
};
