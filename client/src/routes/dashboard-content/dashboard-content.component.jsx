import DetailCard from "../../component/Dashboard-Card/detail-card.component";
import { Users, UserRoundPlus, X } from "lucide-react";
import { useGet, usePost } from "../../custom-hook/axios-post/axios-post";
import "./dashboard-content.style.css";
import { useEffect, useRef, useState } from "react";
import InputBox from "../../component/InputBox/InputBox.component";
import SelectBox from "../../component/select-box/selectbox.component";
import Accordion from "react-bootstrap/Accordion";
import axios from "axios";
const DashboardContent = () => {
  const { response, loading } = useGet("http://localhost:5000/dashboard");
  //const userdata = response?.data.user;
  const [userlist, setuserlist] = useState([]);
  //const [isDelete, setisDelete] = useState(null);
  const [registered, setRegistered] = useState(false);
  const workerdata = response?.data.worker;
  const farmdata = response?.data.farm;
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
    <div className='m-5 dashboard-body h-100'>
      <div className='user-detail-card'>
        <div className='row g-2'>
          <div className='col-lg-4 col-md-6'>
            <DetailCard
              icon={Users}
              response={userlist?.length}
              cardTitle={"အလုပ်ရှင် စုစုပေါင်း"}
            />
          </div>
          <div className='col-lg-4 col-md-6'>
            <DetailCard
              icon={Users}
              response={workerdata?.length}
              cardTitle={"အလုပ်သမား စုစုပေါင်း"}
            />
          </div>
          <div className='col-lg-4 col-md-6'>
            <DetailCard
              icon={Users}
              response={farmdata?.length}
              cardTitle={"လယ် စုစုပေါင်း"}
            />
          </div>
        </div>
      </div>
      <Accordion>
        {userlist?.map((res, index) => (
          <Accordion.Item eventKey={`${index}`}>
            <Accordion.Header>
              <div className='d-flex'>
                <div className='me-5'>{index + 1}</div>
                <div className=''>{res.Name}</div>
              </div>
            </Accordion.Header>
            <Accordion.Body className='accordion-content'>
              <div className='fw-bold d-flex w-100 justify-content-between mb-2'>
                <div>အလုပ်ရှင် အချက်အလက်</div>
                <div>
                  <button
                    className='btn btn-danger me-3'
                    onClick={() => handleDelete(res.UserId)}
                  >
                    ဖျက်ရန်
                  </button>
                </div>
              </div>
              <table className='table table-striped w-100'>
                <tbody>
                  <tr>
                    <td>အမည်</td>
                    <td>{res.Name}</td>
                  </tr>
                  <tr>
                    <td>ဖုန်းနံပါတ်</td>
                    <td>{res.Phone_no}</td>
                  </tr>

                  <tr>
                    <td>လိပ်စာ</td>
                    <td>{res.User_role}</td>
                  </tr>
                </tbody>
              </table>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      <div className='add-worker-btn-wrapper d-flex align-items-center justify-content-end py-2'>
        <a
          type='button'
          className='add-worker-btn d-flex align-items-center'
          onClick={handleClick}
        >
          <UserRoundPlus className='icon' />
          <div className='add-worker-btn-text'>လူအသစ်ထည့်ရန်</div>
        </a>
      </div>
      {addUser && (
        <div className='adduser-form-wrapper'>
          <div className='assign-worker-form position-relative'>
            <div className='cancel-btn'>
              <X onClick={cancelAdd} />
            </div>
            <div className='position-relative'>
              <div className='mt-3 w-100'>
                <InputBox
                  typeProps={"text"}
                  name={"name"}
                  holder={"အမည် ထည့်ရန်"}
                  InputValue={handleChange}
                />
              </div>
              <div className='mt-3 w-100'>
                <InputBox
                  typeProps={"text"}
                  name={"phone"}
                  holder={"ဖုန်းနံပါတ် ထည့်ရန်"}
                  InputValue={handleChange}
                />
              </div>
              <div className='mt-3 w-100'>
                <InputBox
                  typeProps={"password"}
                  name={"password"}
                  holder={"လျှို့ဝှက်နံပါတ် ထည့်ရန်"}
                  InputValue={handleChange}
                />
              </div>
              <div className='mt-3 w-100'>
                <InputBox
                  typeProps={"password"}
                  name={"confirm_password"}
                  holder={"လျှို့ဝှက်နံပါတ် ပြန်ထည့်ရန်"}
                  InputValue={handleChange}
                />
              </div>
              <div className='mt-3 w-100'>
                <SelectBox InputValue={handleChange} name={"userRole"} />
              </div>
            </div>
            <div className='d-flex mt-3 justify-content-end'>
              <button className='btn btn-primary' onClick={handleAdd}>
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
