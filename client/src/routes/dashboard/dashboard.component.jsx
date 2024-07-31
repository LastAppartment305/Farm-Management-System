import { useEffect, useState, Fragment, useContext, useRef } from "react";
import "./dashboard.style.css";
import DetailCard from "../../component/Dashboard-Card/detail-card.component";
import {
  Bell,
  PieChart,
  Captions,
  Pickaxe,
  User,
  Sprout,
  NotepadText,
} from "lucide-react";
import {
  useLogout,
  usePost,
  useGet,
} from "../../custom-hook/axios-post/axios-post";
import { Outlet, useNavigate } from "react-router-dom";
import { authContext } from "../../context/context";
import image from "../../component/assets/img/ricefield.jpg";
import { useSearchParams } from "react-router-dom";
import SideBarButton from "../../component/side_bar_button/side_bar_button.component";
import InputBox from "../../component/InputBox/InputBox.component";
import PhoneInput from "react-phone-input-2";
import { X } from "lucide-react";
import axios from "axios";
import io from "socket.io-client";

const DashBoard = () => {
  const [isActive, setIsActive] = useState("");
  const [notifications, setNotifications] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: null,
    phone: null,
    oldPhone: null,
  });
  const { response, loading, fetchData } = useLogout(
    "http://localhost:5000/logout"
  );
  const { postData } = usePost("http://localhost:5000/getUserInfo");
  const { postData: editUser } = usePost("http://localhost:5000/editUserInfo");
  const { response: getNoti } = useGet(
    "http://localhost:5000/noti/getAllNotification"
  );
  const { isAuthenticated, setRole, role } = useContext(authContext);
  //-------------------------------------
  const navigate = useNavigate();
  const handleClick = (buttontext) => {
    setIsActive(buttontext);
    navigate(`/dashboard/${buttontext}`);
  };

  const editUserProfile = async () => {
    let user = localStorage.getItem("username");
    const userData = await postData({ name: user });
    console.log(userData);
    userData &&
      setUserInfo({
        name: userData.data.Name,
        phone: userData.data.Phone_no,
        oldPhone: userData.data.Phone_no,
      });
    // console.log(userInfo[0]);
  };
  const closeForm = () => {
    setUserInfo({
      name: null,
      phone: null,
      oldPhone: null,
    });
  };

  const changeUserInfo = async () => {
    const result = await editUser(userInfo);
    localStorage.setItem("username", userInfo.name);
    console.log(result);
    if (result.status) {
      setUserInfo({
        name: null,
        phone: null,
        oldPhone: null,
      });
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    // console.log("staff component ", data);
  };
  const userLogout = async () => {
    await fetchData();
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setRole(null);

    navigate("/login");
  };
  const handleNoti = async () => {
    // console.log("This is notification");
  };
  useEffect(() => {
    const fullPath = window.location.pathname;
    const trimPath = fullPath.replace("/dashboard/", "");
    setIsActive(trimPath);

    // if (getNoti) {
    //   setNotifications(getNoti);
    // }

    // const fetchNotication = async () => {
    //   const getNoti = await axios.get(
    //     "http://localhost:5000/noti/getAllNotification"
    //   );
    //   if (getNoti) {
    //     // window.location.reload();
    //     // setNotifications(getNoti);
    //   }
    // };
    // fetchNotication();

    // console.log("dashboard useEffect", localStorage.getItem("role"));
    // console.log("logging role from context in dashboard com: ", role);
  }, []);
  useEffect(() => {
    const socket = io.connect("http://localhost:5000", {
      transports: ["websocket"],
      withCredentials: true,
    });
    const listenToEvent = async (value) => {
      // console.log(value);
      // const getNoti = await axios.get(
      //   "http://localhost:5000/noti/getAllNotification"
      // );
      // if (getNoti) {

      //   setNotifications(getNoti);
      // }
      window.location.reload();
    };
    socket.on("receivingEvent", listenToEvent);

    return () => {
      socket.off("receivingEvent", listenToEvent);
    };
  }, []);
  console.log("from dashboard: ", getNoti);

  return (
    <Fragment>
      <div className='side-bar'>
        <h2 className='text-white my-5 d-flex justify-content-center'>
          Dashboard
        </h2>

        {role === "admin" && (
          <SideBarButton
            icon={PieChart}
            buttonText={"အချက်အလက်များ"}
            isActive={isActive === "admin"}
            onclick={() => handleClick("admin")}
          />
        )}
        {role === "owner" && (
          <SideBarButton
            icon={NotepadText}
            buttonText={"အစီအရင်ခံခြင်း"}
            isActive={isActive === "owner/report"}
            onclick={() => handleClick("owner/report")}
          />
        )}
        {role === "owner" && (
          <SideBarButton
            icon={Pickaxe}
            buttonText={"အလုပ်နေရာချထားခြင်း"}
            isActive={isActive === "owner/assign-worker"}
            onclick={() => handleClick("owner/assign-worker")}
          />
        )}
        {role === "owner" && (
          <SideBarButton
            icon={User}
            buttonText={"အလုပ်သမား စာရင်း"}
            isActive={isActive === "owner/staff"}
            onclick={() => handleClick("owner/staff")}
          />
        )}
        {role === "owner" && (
          <SideBarButton
            icon={Sprout}
            buttonText={"လယ် စာရင်း"}
            isActive={isActive === "owner/farm"}
            onclick={() => handleClick("owner/farm")}
          />
        )}
      </div>
      <div className='dashboard-content'>
        <nav class='navbar navbar-expand-lg navbar-light bg-white border-primary border-bottom border-4'>
          <div class='container-fluid'>
            <div className='left-side-of-nav d-flex'>
              <button
                class='btn toggle-btn'
                type='button'
                data-bs-toggle='offcanvas'
                data-bs-target='#offcanvasExample'
                aria-controls='offcanvasExample'
              >
                <span class='navbar-toggler-icon'></span>
              </button>
              <input
                type='search'
                className='form-control me-2'
                placeholder='search'
              />
            </div>
            <div className='right-side-of-nav me-2 d-flex align-items-center'>
              <a href='#' onClick={handleNoti} className='noti-btn'>
                <Bell />
              </a>
              <div className='profile-icon-wrapper ms-4'>
                <a
                  type='button'
                  className='profile-icon'
                  id='dropdownMenuButton1'
                  data-bs-toggle='dropdown'
                  aria-expanded='false'
                >
                  <img src={image} className='profile-image' />
                </a>
                <ul class='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                  <li>
                    <a class='dropdown-item fw-bold' href='#'>
                      {localStorage.getItem("username")}
                    </a>
                  </li>
                  <li>
                    <hr class='dropdown-divider' />
                  </li>
                  <li>
                    <button class='dropdown-item' onClick={editUserProfile}>
                      ပြင်ဆင်ရန်
                    </button>
                  </li>
                  <li>
                    <button class='dropdown-item' onClick={userLogout}>
                      ထွက်မည်
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div
              class='offcanvas offcanvas-start d-lg-none d-block'
              tabindex='-1'
              id='offcanvasExample'
              aria-labelledby='offcanvasExampleLabel'
            >
              <h2 className=' my-5 d-flex justify-content-center'>Dashboard</h2>
              {role === "admin" && (
                <SideBarButton
                  icon={PieChart}
                  buttonText={"အချက်အလက်များ"}
                  isActive={isActive === "admin"}
                  onclick={() => handleClick("admin")}
                />
              )}
              {role === "owner" && (
                <SideBarButton
                  icon={NotepadText}
                  buttonText={"အစီအရင်ခံခြင်း"}
                  isActive={isActive === "owner/report"}
                  onclick={() => handleClick("owner/report")}
                />
              )}
              {role === "owner" && (
                <SideBarButton
                  icon={Pickaxe}
                  buttonText={"အလုပ်နေရာချထားခြင်း"}
                  isActive={isActive === "owner/assign-worker"}
                  onclick={() => handleClick("owner/assign-worker")}
                />
              )}
              {role === "owner" && (
                <SideBarButton
                  icon={User}
                  buttonText={"အလုပ်သမား စာရင်း"}
                  isActive={isActive === "owner/staff"}
                  onclick={() => handleClick("owner/staff")}
                />
              )}
              {role === "owner" && (
                <SideBarButton
                  icon={Sprout}
                  buttonText={"လယ် အရေအတွက်"}
                  isActive={isActive === "owner/farm"}
                  onclick={() => handleClick("owner/farm")}
                />
              )}
            </div>
          </div>
        </nav>
        {userInfo.name != null && userInfo.phone != null && (
          <div className='adduser-form-wrapper'>
            <div className='assign-worker-form position-relative'>
              <div className='cancel-btn'>
                <X onClick={closeForm} />
              </div>
              <div className='position-relative'>
                <div className='mt-3 w-100'>
                  <InputBox
                    typeProps={"text"}
                    name={"name"}
                    value={userInfo.name}
                    InputValue={handleChange}
                  />
                </div>

                <div className='mt-3 w-100'>
                  <PhoneInput
                    country={"mm"}
                    value={userInfo.phone}
                    onChange={(e) =>
                      setUserInfo((prev) => ({
                        ...prev,
                        phone: e,
                      }))
                    }
                  />
                </div>
              </div>

              <div className='d-flex mt-3 justify-content-end'>
                <button className='btn btn-primary' onClick={changeUserInfo}>
                  ပြင်ဆင်ရန်
                </button>
              </div>
            </div>
          </div>
        )}
        <Outlet />
      </div>
    </Fragment>
  );
};
export default DashBoard;
