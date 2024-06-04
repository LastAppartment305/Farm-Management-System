import DetailCard from "../../component/Dashboard-Card/detail-card.component";
import { Users } from "lucide-react";
import { useGet, usePost } from "../../custom-hook/axios-post/axios-post";
import "./dashboard-content.style.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
const DashboardContent = () => {
  const { response, loading } = useGet("http://localhost:5000/dashboard");
  //const userdata = response?.data.user;
  const [userlist, setuserlist] = useState([]);
  //const [isDelete, setisDelete] = useState(null);
  const workerdata = response?.data.worker;
  const { postData } = usePost("http://localhost:5000/dashboard");

  const handleDelete = async (e) => {
    const x = await postData({ id: e });
    if (x) {
      const resAfterDelete = await axios.get("http://localhost:5000/dashboard");
      if (resAfterDelete) {
        setuserlist(resAfterDelete.data.user);
        console.log(
          "dashboard-content:handle delete function: ",
          resAfterDelete.data.user
        );
      }
    }
  };
  useEffect(() => {
    if (response) {
      setuserlist(response.data.user);
    }
    console.log("dashboard-content:useEffect: ", userlist);
  }, [response]);
  return (
    <div className="m-5 dashboard-body h-100">
      <div className="user-detail-card">
        <div className="row g-2">
          <div className="col-lg-4 col-md-6">
            <DetailCard
              icon={Users}
              response={userlist?.length}
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
            {userlist?.map((res, index) => (
              <tr key={index} className="w-100">
                <th scope="row">{index + 1}</th>
                <td className="row">{res.Name}</td>
                <td>{res.Phone_no}</td>
                <td>{res.User_role}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(res.UserId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default DashboardContent;
