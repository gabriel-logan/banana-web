import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "./lib/queryClient";
import { Router } from "./Router";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </QueryClientProvider>
  );
}
