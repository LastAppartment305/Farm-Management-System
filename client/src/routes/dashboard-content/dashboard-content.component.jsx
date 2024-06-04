import DetailCard from "../../component/Dashboard-Card/detail-card.component";
import { Users, UserRoundPlus, X } from "lucide-react";
import { useGet, usePost } from "../../custom-hook/axios-post/axios-post";
import "./dashboard-content.style.css";
import { useEffect, useRef, useState } from "react";
import InputBox from "../../component/InputBox/InputBox.component";
import SelectBox from "../../component/select-box/selectbox.component";
import axios from "axios";
const DashboardContent = () => {
  const { response, loading } = useGet("http://localhost:5000/dashboard");
  //const userdata = response?.data.user;
  const [userlist, setuserlist] = useState([]);
  //const [isDelete, setisDelete] = useState(null);
  const [registered, setRegistered] = useState(false);
  const workerdata = response?.data.worker;
  const { postData } = usePost("http://localhost:5000/dashboard");

  const [data, setData] = useState({
    name: "",
    phone: "",
    password: "",
    confirm_password: "",
    userRole: "Owner",
  });

  //put to input data to useState "data"
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  //Delete user at onClick Delete
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
  const [addUser, setAddUser] = useState(false);
  //sign up form pop up at onclick Add User at admin dashboard
  const handleClick = () => {
    setAddUser(!addUser);
  };
  //close pop up signin form admin dashboard
  const cancelAdd = () => {
    setAddUser(!addUser);
  };
  useEffect(() => {
    if (response) {
      setuserlist(response.data.user);
    }
    console.log("dashboard-content:useEffect: ", userlist);
  }, [response]);

  //Post user data to Server
  const handleAdd = async () => {
    if (data.password === data.confirm_password) {
      console.log("it is the same password");
      try {
        const response = await axios.post("http://localhost:5000/signup", data);
        console.log("Response from Server", response.data);
        setRegistered(true);
      } catch (error) {
        console.log("Error at sending data", error);
      }
    } else {
      alert("the password are not the same");
    }
  };
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
      <div className="add-worker-btn-wrapper d-flex align-items-center justify-content-end py-2">
        <a
          type="button"
          className="add-worker-btn d-flex align-items-center"
          onClick={handleClick}
        >
          <UserRoundPlus className="icon" />
          <div className="add-worker-btn-text">Add User</div>
        </a>
      </div>
      {addUser && (
        <div className="adduser-form-wrapper">
          <div className="assign-worker-form position-relative">
            <div className="cancel-btn">
              <X onClick={cancelAdd} />
            </div>
            <div className="position-relative">
              <div className="mt-3 w-100">
                <InputBox
                  typeProps={"text"}
                  name={"name"}
                  holder={"Enter name"}
                  InputValue={handleChange}
                />
              </div>
              <div className="mt-3 w-100">
                <InputBox
                  typeProps={"text"}
                  name={"phone"}
                  holder={"Enter Phone Number"}
                  InputValue={handleChange}
                />
              </div>
              <div className="mt-3 w-100">
                <InputBox
                  typeProps={"password"}
                  name={"password"}
                  holder={"Enter Password"}
                  InputValue={handleChange}
                />
              </div>
              <div className="mt-3 w-100">
                <InputBox
                  typeProps={"password"}
                  name={"confirm_password"}
                  holder={"Confirm Password"}
                  InputValue={handleChange}
                />
              </div>
              <div className="mt-3 w-100">
                <SelectBox InputValue={handleChange} name={"userRole"} />
              </div>
            </div>
            <div className="d-flex mt-3 justify-content-end">
              <button className="btn btn-primary" onClick={handleAdd}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DashboardContent;
