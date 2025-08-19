import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import EditorPage from "./pages/EditorPage";
import "./index.css";
import App from "./App";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/room/:roomId", element: <EditorPage /> }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode><RouterProvider router={router} /></React.StrictMode>
);
