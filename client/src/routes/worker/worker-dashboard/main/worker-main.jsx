import classes from "../../worker-dashboard/main/worker-main.module.css";
import image from "../../../../component/assets/img/ricefield.jpg";
import { useEffect, useState, Fragment, useContext, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useLogout } from "../../../../custom-hook/axios-post/axios-post";
import { authContext } from "../../../../context/context";
const WorkerMain = () => {
  const [isActive, setIsActive] = useState("");
  const navigate = useNavigate();
  const { setRole, role } = useContext(authContext);
  const { response, loading, fetchData } = useLogout(
    "http://localhost:5000/worker/worker-logout"
  );
  const handleClick = (buttontext) => {
    setIsActive(buttontext);
    navigate(`/dashboard/${buttontext}`);
  };
  const workerLogouOut = async () => {
    await fetchData();
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setRole(null);

    navigate("/worker-login");
  };
  return (
    <Fragment>
      <div className={`${classes.nav_section}`}>
        <div className={`${classes.nav_group2}`}>FieldFinance</div>
        <div className={`${classes.nav_group1}`}>
          <div className={`${classes.nav_item}`}>
            <a type='button' onClick={() => handleClick("worker/home")}>
              home
            </a>
          </div>
          <div className={`${classes.nav_item}`}>
            <a href='#'>agreement</a>
          </div>
          <div>
            <a
              type='button'
              className={`${classes.profile_icon}`}
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
                <button class='dropdown-item'>ပြင်ဆင်ရန်</button>
              </li>
              <li>
                <button class='dropdown-item' onClick={workerLogouOut}>
                  ထွက်မည်
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Outlet />
    </Fragment>
  );
};
export default WorkerMain;
