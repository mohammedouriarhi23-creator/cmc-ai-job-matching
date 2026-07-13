import { Outlet, useLocation } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"

export default function PublicLayout() {
  const location = useLocation()
  const isHome = location.pathname === "/"

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className={`flex-1 ${isHome ? "" : "pt-20"}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
