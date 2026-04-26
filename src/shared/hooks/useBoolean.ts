import { useState } from 'react';
export const useBoolean = (initial = false) => {
  const [value, setValue] = useState(initial);
  return { value, setTrue: () => setValue(true), setFalse: () => setValue(false), toggle: () => setValue(v => !v) };
};
