import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { useState, useContext } from "react";

import "./App.css";
import SignUp from "./routes/sign-up/sign-up.component";
import Login from "./routes/login-in/login-in.component";
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
import Calculator from "./routes/dashboard-content/cultivation-calculator/cultivation-calculator.component";
import WorkerMain from "./routes/worker/worker-dashboard/main/worker-main";
import WorkerHome from "./routes/worker/worker-dashboard/worker-home/worker-home";
import OwnerPropose from "./routes/dashboard-content/owner-proposes/owner-proposes.component";
import ApprovedPosts from "./routes/dashboard-content/admin-approved-posts/admin-approved-posts.component";
import WorkerAgreement from "./routes/worker/worker-dashboard/worker-agreement/worker-agreement";
import ApproveReports from "./routes/dashboard-content/admin-approve-report-image/approve-report-image";
import AnalystRegister from "./routes/price analyst/analyst register/analyst-register";
import RainfedPaddy from "./routes/price analyst/rainfed-paddy-pricing/rainfed-paddy-pricing";
import IrrigatedPaddy from "./routes/price analyst/irrigated-paddy-pricing/irrigated-paddy-pricing";
import Bean from "./routes/price analyst/bean-pricing/bean-pricing";
import PendingAnalysts from "./routes/dashboard-content/admin-pending-analyst/admin-pending-analyst";
const App = () => {
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
        {
          path: "analyst",
          element: <AnalystRegister />,
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
                  {
                    path: "admin/approved",
                    element: <ApprovedPosts />,
                  },
                  {
                    path: "admin/approve-reports",
                    element: <ApproveReports />,
                  },
                  {
                    path: "admin/pending-analyst",
                    element: <PendingAnalysts />,
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
                  {
                    path: "owner/calculator",
                    element: <Calculator />,
                  },
                  {
                    path: "owner/propose",
                    element: <OwnerPropose />,
                  },
                ],
              },
            ]
          : []),
        ...(role === "worker"
          ? [
              {
                path: "dashboard",
                element: <WorkerMain />,
                children: [
                  {
                    path: "worker/home",
                    index: true,
                    element: <WorkerHome />,
                  },
                  {
                    path: "worker/agreement",
                    element: <WorkerAgreement />,
                  },
                  {
                    path: "worker/report",
                    element: <TakePhoto />,
                  },
                ],
              },
            ]
          : []),
        ...(role === "analyst"
          ? [
              {
                path: "dashboard",
                element: <DashBoard />,
                children: [
                  {
                    path: "price-analyst/rainfed-paddy",
                    element: <RainfedPaddy />,
                  },
                  {
                    path: "price-analyst/irrigated-paddy",
                    element: <IrrigatedPaddy />,
                  },
                  {
                    path: "price-analyst/bean",
                    element: <Bean />,
                  },
                ],
              },
            ]
          : []),

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
