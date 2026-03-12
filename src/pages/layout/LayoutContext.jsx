import { createContext, useContext, useState } from "react"

const LayoutContext = createContext(null)

export function LayoutProvider({ children }) {
  const [header, setHeader] = useState({
    title: "",
    backButton: false,
  })

  return (
    <LayoutContext.Provider value={{ header, setHeader }}>
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  return useContext(LayoutContext)
}
