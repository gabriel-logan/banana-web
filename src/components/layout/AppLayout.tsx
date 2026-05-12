import { Outlet } from "react-router"
import { Header } from "./Header"
import { motion } from "motion/react"

export function AppLayout() {
  return (
    <div>
      <Header />
      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <Outlet />
      </motion.main>
    </div>
  )
}
