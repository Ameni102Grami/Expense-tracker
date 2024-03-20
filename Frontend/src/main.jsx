import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import GridBackground from "./components/ui/GridBackground.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <GridBackground>
        <App />
      </GridBackground>
    </BrowserRouter>
  </React.StrictMode>,
);
