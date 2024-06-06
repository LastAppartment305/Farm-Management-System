
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { useState,useContext } from 'react';

import './App.css';
import SignUp from './routes/sign-up/sign-up.component';
//import SignUp from './routes/sign-up/sign-up.component';
import Login from './routes/login-in/login-in.component';
import reportWebVitals from './reportWebVitals';
import DashBoard from './routes/dashboard/dashboard.component';
import DashboardContent from './routes/dashboard-content/dashboard-content.component';
import DashboardPermission from './routes/dashboard-content/dashboard-content-permission.component';

import { authContext } from "./context/context";
import Staff from "./routes/dashboard-content/staff/dashboard-content-staff.component";



const App=()=>{
  const [admin,setadmin]=useState(true);
  const {
    IsAdmin,
    IsOwner,
    isAuthenticated,
    setIsAuthenticated,
    setRole,
    role,
  } = useContext(authContext);
  const router = createBrowserRouter([
    {
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
        ...(role==='admin'?[{ 
        path:"dashboard",
        element:<DashBoard/>,
        children:[
          {
            path:"admin",
            index:true,
            element:<DashboardContent/>,
          },
          {
            path:"admin/permission",
            element:<DashboardPermission/>
          },
          
        ],
      }]:[]),
      ...(role==='owner' ?[{ 
        path:"dashboard",
        element:<DashBoard/>,
        children:[
          
          {
            path:"owner/staff",
            index:true,
            element:<Staff/>
          },
        ],
      }]:[])
      ]
    },
    
  ]);
  console.log("App.js: ",role);
  return(
      <RouterProvider router={router} />
  )
}
export default App;