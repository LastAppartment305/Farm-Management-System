import DetailCard from "../../component/Dashboard-Card/detail-card.component";
import { Users } from "lucide-react";
import { useGet } from "../../custom-hook/axios-post/axios-post";
import "./dashboard-content.style.css";
import { useRef, useState } from "react";
const DashboardHome = () => {
  const rollNo = useRef(1);
  const { response, loading } = useGet("http://localhost:5000/dashboard");
  const userdata = response?.data;
  console.log(userdata);

  return (
    <div className="m-5 dashboard-body h-100">
      <div className="user-detail-card">
        <div className="row g-2">
          <div className="col-lg-4 col-md-6">
            <DetailCard icon={Users} response={response} />
          </div>
          <div className="col-lg-4 col-md-6">
            <DetailCard icon={Users} response={response} />
          </div>
          <div className="col-lg-4 col-md-6">
            <DetailCard icon={Users} response={response} />
          </div>
        </div>
      </div>
      <div className="user-detail-table">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">First</th>
              <th scope="col">Last</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            {userdata?.map((res, index) => (
              <tr key={index} className="w-100">
                <th scope="row">{index + 1}</th>
                <td className="row">{res.Name}</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
            ))}
          </tbody>
        </table>
        {userdata?.map((res, index) => {
          console.log(res.Name);
        })}
      </div>
    </div>
  );
};
export default DashboardHome;
