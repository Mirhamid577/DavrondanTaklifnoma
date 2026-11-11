import { createContext, useContext } from "react";

const ScrollRootContext = createContext(null);

export function ScrollRootProvider({ rootRef, children }) {
  return (
    <ScrollRootContext.Provider value={rootRef}>
      {children}
    </ScrollRootContext.Provider>
  );
}

export function useScrollRoot() {
  return useContext(ScrollRootContext);
}
