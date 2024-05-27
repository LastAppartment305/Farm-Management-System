import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
//import App from './App';
import SignUp from './routes/sign-up/sign-up.component';
import Login from './routes/login-in/login-in.component';
import reportWebVitals from './reportWebVitals';
import DashBoard from './routes/dashboard/dashboard.component';
import DashboardContent from './routes/dashboard-content/dashboard-content.component';
import DashboardPermission from './routes/dashboard-content/dashboard-content-permission.component';
import AssignWorker from './routes/dashboard-content/dashboard-content-assignworker.component';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

const router = createBrowserRouter([
  {
    // path: "/signup",
    // element: <SignUp/>,
    // index:true,
    path:"/",
    children:[
      {path:"signup",
      index:true,
      element:<SignUp/>,
    },
    {
      path:"login",
      element:<Login/>,
    },
    {
      path:"dashboard",
      element:<DashBoard/>,
      children:[
        {
          path:"home",
          index:true,
          element:<DashboardContent/>,
        },
        {
          path:"permission",
          element:<DashboardPermission/>
        },
        {
          path:"assign-worker",
          element:<AssignWorker/>
        }
      ],
    }
    ]
  },
  
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
