import DetailCard from "../../component/Dashboard-Card/detail-card.component";
import { Users } from "lucide-react";
import { useGet } from "../../custom-hook/axios-post/axios-post";
import "./dashboard-content.style.css";
import { useRef, useState } from "react";
const DashboardContent = () => {
  const { response, loading } = useGet("http://localhost:5000/dashboard");
  const userdata = response?.data.user;
  const workerdata = response?.data.worker;

  return (
    <div className="m-5 dashboard-body h-100">
      <div className="user-detail-card">
        <div className="row g-2">
          <div className="col-lg-4 col-md-6">
            <DetailCard
              icon={Users}
              response={userdata?.length}
              cardTitle={"Total Users"}
            />
          </div>
          <div className="col-lg-4 col-md-6">
            <DetailCard
              icon={Users}
              response={workerdata?.length}
              cardTitle={"Total Worker"}
            />
          </div>
          <div className="col-lg-4 col-md-6">
            <DetailCard
              icon={Users}
              response={workerdata?.length}
              cardTitle={"Total Worker"}
            />
          </div>
        </div>
      </div>
      <div className="user-detail-table">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">No.</th>
              <th scope="col">Name</th>
              <th scope="col">Phone no</th>
              <th scope="col">Role</th>
            </tr>
          </thead>
          <tbody>
            {userdata?.map((res, index) => (
              <tr key={index} className="w-100">
                <th scope="row">{index + 1}</th>
                <td className="row">{res.Name}</td>
                <td>{res.Phone_no}</td>
                <td>{res.User_role}</td>
                <td><button className="btn btn-danger">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default DashboardContent;
