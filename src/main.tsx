import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Toaster } from "react-hot-toast";
import "./App.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Toaster position="top-right" reverseOrder={false} />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
