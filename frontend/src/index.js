import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Login from './loginandregister/login';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Register from './loginandregister/register';
import Analyser from './Dashboard/analyser';
import ProtectedRoute from './Dashboard/ProtectedRoute';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById('root'));

const allRouters = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Analyser/>
      </ProtectedRoute>
    ),
  },
]);



root.render(
  <React.StrictMode>
    <RouterProvider router={allRouters} />
    <ToastContainer />   
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
