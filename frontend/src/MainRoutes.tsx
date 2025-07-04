import React, { StrictMode } from "react";

import Home from "./page/home/home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ChatPage from "./page/chatpage/chatpage";
import Landing from "./test/landing";

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
    {
      path: "/landing",
      element: <Landing />,
    },
  ]);

  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
};

export default MainRoutes;