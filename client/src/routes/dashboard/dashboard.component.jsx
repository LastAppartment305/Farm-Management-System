import { useEffect, useState, Fragment, useContext, useRef } from "react";
import "./dashboard.style.css";
import DetailCard from "../../component/Dashboard-Card/detail-card.component";
import {
  House,
  Bell,
  PieChart,
  CalendarCheck,
  Pickaxe,
  User,
  Sprout,
  NotepadText,
  Calculator,
  HandCoins,
  CalendarClock,
  Image,
  CloudHail,
  SunSnow,
  Bean,
  Clock,
  Handshake,
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
  // const { response: getNoti } = useGet(
  //   "http://localhost:5000/noti/getAllNotification"
  // );
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
      const getNoti = await axios.get(
        "http://localhost:5000/noti/getAllNotification"
      );
      if (getNoti) {
        setNotifications(getNoti);
      }
    };
    socket.on("receivingEvent", listenToEvent);

    return () => {
      socket.off("receivingEvent", listenToEvent);
    };
  }, []);
  useEffect(() => {
    if (role === "owner") {
      const fetchNotication = async () => {
        const getNoti = await axios.get(
          "http://localhost:5000/noti/getAllNotification"
        );
        if (getNoti) {
          console.log("No reverse: ", getNoti.data);
          const reverse = getNoti.data.reverse();
          console.log("reverse: ", reverse);
          setNotifications(reverse);
          console.log(getNoti);
        }
      };
      if (role !== "worker") {
        fetchNotication();
      }
    }
  }, []);
  const closeNotificationSideBar = async () => {
    const FetchNotiAgain = await axios.get(
      "http://localhost:5000/noti/changeNotiStatus"
    );
    if (FetchNotiAgain) {
      const reverse = FetchNotiAgain.data.reverse();
      console.log("reverse: ", reverse);
      setNotifications(reverse);
    }
    console.log("change noti status: ", notifications);
  };

  // console.log(notifications);
  return (
    <Fragment>
      <div className='side-bar'>
        <h2 className='text-white my-5 d-flex justify-content-center'>
          Dashboard
        </h2>

        {/* {role === "admin" && (
          <SideBarButton
            icon={PieChart}
            buttonText={"အချက်အလက်များ"}
            isActive={isActive === "admin"}
            onclick={() => handleClick("admin")}
          />
        )} */}
        {role === "admin" && (
          <SideBarButton
            icon={House}
            buttonText={"ပင်မ"}
            isActive={isActive === "admin"}
            onclick={() => handleClick("admin")}
          />
        )}
        {role === "admin" && (
          <SideBarButton
            icon={CalendarClock}
            buttonText={"စောင့်ဆိုင်းပို့စ်များ"}
            isActive={isActive === "admin/approval"}
            onclick={() => handleClick("admin/approval")}
          />
        )}
        {role === "admin" && (
          <SideBarButton
            icon={CalendarCheck}
            buttonText={"အတည်ပြုပြီးပို့စ်များ"}
            isActive={isActive === "admin/approved"}
            onclick={() => handleClick("admin/approved")}
          />
        )}
        {role === "admin" && (
          <SideBarButton
            icon={Image}
            buttonText={"ရီပို့ဓာတ်ပုံများ"}
            isActive={isActive === "admin/approve-reports"}
            onclick={() => handleClick("admin/approve-reports")}
          />
        )}

        {/* {role === "admin" && (
          <SideBarButton
            icon={Clock}
            buttonText={"ဈေးပြင်ဆင်သူ"}
            isActive={isActive === "admin/pending-analyst"}
            onclick={() => handleClick("admin/pending-analyst")}
          />
        )} */}
        {role === "analyst" && (
          <SideBarButton
            icon={CloudHail}
            buttonText={"မိုးစပါး"}
            isActive={isActive === "price-analyst/rainfed-paddy"}
            onclick={() => handleClick("price-analyst/rainfed-paddy")}
          />
        )}
        {role === "analyst" && (
          <SideBarButton
            icon={SunSnow}
            buttonText={"နွေစပါး"}
            isActive={isActive === "price-analyst/irrigated-paddy"}
            onclick={() => handleClick("price-analyst/irrigated-paddy")}
          />
        )}
        {role === "analyst" && (
          <SideBarButton
            icon={Bean}
            buttonText={"ပဲ"}
            isActive={isActive === "price-analyst/bean"}
            onclick={() => handleClick("price-analyst/bean")}
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
            icon={Handshake}
            buttonText={"သဘောတူညီမှု"}
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
        {/* {role === "owner" && (
          <SideBarButton
            icon={Sprout}
            buttonText={"လယ် စာရင်း"}
            isActive={isActive === "owner/farm"}
            onclick={() => handleClick("owner/farm")}
          />
        )} */}
        {role === "owner" && (
          <SideBarButton
            icon={HandCoins}
            buttonText={"ပရိုပို့စ်"}
            isActive={isActive === "owner/propose"}
            onclick={() => handleClick("owner/propose")}
          />
        )}
        {role === "owner" && (
          <SideBarButton
            icon={Calculator}
            buttonText={"ကုန်ကျစရိတ်တွက်ခြင်း"}
            isActive={isActive === "owner/calculator"}
            onclick={() => handleClick("owner/calculator")}
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
              {/* <input
                type='search'
                className='form-control me-2'
                placeholder='search'
              /> */}
            </div>
            <div className='right-side-of-nav me-2 d-flex align-items-center'>
              {/* <div className='noti-wrapper position-relative'> */}
              {localStorage.getItem("role") === "owner" && (
                <a
                  href='#Noti'
                  onClick={handleNoti}
                  className='noti-btn'
                  type='button'
                  data-bs-toggle='offcanvas'
                  data-bs-target='#Noti'
                  aria-controls='offcanvasExample'
                >
                  <Bell />
                  <div
                    className={
                      notifications?.length > 0 &&
                      notifications.find((status) => status.noti_status === 0)
                        ? "red-dot"
                        : ""
                    }
                  ></div>
                </a>
              )}
              {/* </div> */}
              {/* <div className='profile-icon-wrapper ms-4'> */}
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
              {/* </div> */}
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
        <div
          class='offcanvas offcanvas-end'
          tabindex='-1'
          id='Noti'
          aria-labelledby='offcanvasExampleLabel'
          aria-modal='false'
        >
          <div class='offcanvas-header'>
            <h5 id='offcanvasRightLabel'>
              <Bell />
            </h5>
            <button
              type='button'
              onClick={() => {
                if (role !== "worker") {
                  closeNotificationSideBar();
                }
              }}
              class='btn-close text-reset'
              data-bs-dismiss='offcanvas'
              aria-label='Close'
            ></button>
          </div>
          <div class='offcanvas-body'>
            {notifications?.length > 0 &&
              notifications.map((item, index) => (
                <div
                  key={index}
                  className={!item.noti_status && "notification-content"}
                >
                  <div>{item.noti_message}</div>
                  <hr></hr>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default DashBoard;
