import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { useState, useContext } from "react";

import "./App.css";
import SignUp from "./routes/sign-up/sign-up.component";
//import SignUp from './routes/sign-up/sign-up.component';
import Login from "./routes/login-in/login-in.component";
import reportWebVitals from "./reportWebVitals";
import DashBoard from "./routes/dashboard/dashboard.component";
import DashboardContent from "./routes/dashboard-content/dashboard-content.component";
import AdminApproval from "./routes/dashboard-content/dashboard-content-approval.component";

import { authContext } from "./context/context";
import Staff from "./routes/dashboard-content/staff/dashboard-content-staff.component";
import TakePhoto from "./routes/take-photo/take_photo.component";
import AssignWorker from "./routes/dashboard-content/assign-worker/dashboard-content-assignworker.component";
import Farm from "./routes/dashboard-content/farm/dashboard-content-farm.component";
import WorkerLogin from "./routes/worker/worker-login/worker-login.component";
import ReportContent from "./routes/dashboard-content/report-content/dashboard-content-report.component";
import MainPage from "./routes/main-page/main-page.component";

const App = () => {
  const [admin, setadmin] = useState(true);
  const { role, verifyWorker } = useContext(authContext);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainPage />,
    },
    {
      path: "/",
      // element: <MainPage />,
      children: [
        {
          path: "worker-login",
          element: <WorkerLogin />,
        },
        { path: "signup", index: true, element: <SignUp /> },
        {
          path: "login",
          element: <Login />,
        },
        ...(role === "admin"
          ? [
              {
                path: "dashboard",
                element: <DashBoard />,
                children: [
                  {
                    path: "admin",
                    index: true,
                    element: <DashboardContent />,
                  },
                  {
                    path: "admin/approval",
                    element: <AdminApproval />,
                  },
                ],
              },
            ]
          : []),
        ...(role === "owner"
          ? [
              {
                path: "dashboard",
                element: <DashBoard />,
                children: [
                  {
                    path: "owner/report",
                    element: <ReportContent />,
                  },
                  {
                    path: "owner/assign-worker",

                    element: <AssignWorker />,
                  },
                  {
                    path: "owner/staff",
                    element: <Staff />,
                  },
                  {
                    path: "owner/farm",
                    element: <Farm />,
                  },
                ],
              },
            ]
          : []),
        {
          path: "worker",
          element: <TakePhoto />,
        },

        // {
        //   path: "worker",
        //   element: <TakePhoto />,
        // },
      ],
    },
  ]);
  console.log("App.js: ", role);
  console.log("App.js : ", verifyWorker);
  return <RouterProvider router={router} />;
};
export default App;
