import { useEffect } from "react"
import { useLayout } from "../layout/LayoutContext"
export default function HeaderTitle({ title, backButton = false }) {
  const { setHeader } = useLayout()

  useEffect(() => {
    setHeader({ title, backButton })

    return () => {
      setHeader({ title: "", backButton: false })
    }
  }, [title, backButton, setHeader])

  return null
}
