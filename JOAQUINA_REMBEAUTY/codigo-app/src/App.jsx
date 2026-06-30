import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Shop } from './pages/Shop'
import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { Profile } from './pages/Profile'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { NotFound } from './pages/NotFound'
import { ProtectedRoute } from './components/ProtectedRoute'
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "login",
        element: <Login />
      },
      {
        path: "register",
        element: <Register />
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <Home />
          },
          {
            path: "shop",
            element: <Shop />
          },
          {
            path: "cart",
            element: <Cart />
          },
          {
            path: "checkout",
            element: <Checkout />
          },
          {
            path: "profile",
            element: <Profile />
          }
        ]
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}
