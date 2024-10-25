import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App.jsx";
import "./index.css";
import { SocketContextProvider } from "./context/SocketContext";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <SocketContextProvider>
          <App />
        </SocketContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
