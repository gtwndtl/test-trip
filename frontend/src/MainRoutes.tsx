import React, { StrictMode } from "react";

import Home from "./page/home/home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ChatPage from "./page/chatpage/chatpage";

const MainRoutes: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/chat",
      element: <ChatPage />,
    },
  ]);

  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
};

export default MainRoutes;