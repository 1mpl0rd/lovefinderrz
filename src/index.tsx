// src/index.tsx
import ReactDOM from "react-dom/client";
import { Router } from "./routes/router";
import "./styles/global.css";

const root = ReactDOM.createRoot(document.getElementById("app")!);
root.render(<Router />);
