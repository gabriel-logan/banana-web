import { Outlet } from "react-router";
import { motion } from "motion/react";

import { Header } from "./Header";

export function AppLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <motion.main
        className="mx-auto w-full max-w-7xl px-4 pt-6 pb-10 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
