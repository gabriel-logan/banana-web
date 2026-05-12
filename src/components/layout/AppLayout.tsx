import { Outlet } from "react-router";
import { motion } from "motion/react";

import { Header } from "./Header";

export function AppLayout() {
  return (
    <div>
      <Header />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
