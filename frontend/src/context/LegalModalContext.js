import { createContext, useContext } from "react";

export const LegalModalContext = createContext({
  handleOpen: () => {},
});

export function useLegalModal() {
  return useContext(LegalModalContext);
}
