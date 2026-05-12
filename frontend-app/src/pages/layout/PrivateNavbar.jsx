import { useNavigate } from "react-router-dom"
import { useLayout } from "./LayoutContext"

export default function PrivateNavbar() {
  const { header } = useLayout()
  const navigate = useNavigate()

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {header.backButton && (
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg border border-slate-300 px-2 py-1 text-slate-600 hover:bg-slate-100"
          >
            ←
          </button>
        )}

        <h1 className="text-lg font-semibold text-slate-800">
          {header.title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-700">
          Admin
        </span>
        <div className="h-8 w-8 rounded-full bg-slate-300 flex items-center justify-center text-sm font-semibold">
          A
        </div>
      </div>
    </header>
  )
}
