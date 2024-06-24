
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
import TakePhoto from "./routes/take-photo/take_photo.component";
import AssignWorker from "./routes/dashboard-content/assign-worker/dashboard-content-assignworker.component";
import Farm from "./routes/dashboard-content/farm/dashboard-content-farm.component";
import WorkerLogin from "./routes/worker/worker-login/worker-login.component";



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
        {
          path:"worker-login",
          element:<WorkerLogin/>,
        },
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
            path:"owner/assign-worker",
            index:true,
            element:<AssignWorker/>
          },
          {
            path:"owner/staff",
            element:<Staff/>
          },
          {
            path:"owner/farm",
            element:<Farm/>
          },
        ],
      }]:[]),
      {
        path:'worker',
        element:<TakePhoto/>
      }
      ]
    },
    
  ]);
  console.log("App.js: ",role);
  return(
      <RouterProvider router={router} />
  )
}
export default App;