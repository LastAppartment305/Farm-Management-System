import { useEffect, useState, Fragment, useContext } from "react";
import "./dashboard.style.css";
import DetailCard from "../../component/Dashboard-Card/detail-card.component";
import { Bell, PieChart, Captions, Pickaxe, User, Sprout } from "lucide-react";
import { useLogout } from "../../custom-hook/axios-post/axios-post";
import { Outlet, useNavigate } from "react-router-dom";
import { authContext } from "../../context/context";
import image from "../../component/assets/img/ricefield.jpg";
import SideBarButton from "../../component/side_bar_button/side_bar_button.component";

const DashBoard = () => {
  const [isActive, setIsActive] = useState("");
  const { response, loading, fetchData } = useLogout(
    "http://localhost:5000/logout"
  );
  const { isAuthenticated, setRole, role } = useContext(authContext);
  //-------------------------------------
  const navigate = useNavigate();
  const handleClick = (buttontext) => {
    setIsActive(buttontext);
    navigate(`/dashboard/${buttontext}`);
  };

  const userLogout = async () => {
    await fetchData();
    localStorage.setItem("role", null);
    setRole(null);

    navigate("/login");
  };
  // useEffect(() => {
  //   console.log("dashboard useEffect", localStorage.getItem("role"));
  //   console.log("logging role from context in dashboard com: ", role);
  // });
  return (
    <Fragment>
      <div className="side-bar">
        <h2 className="text-white my-5 d-flex justify-content-center">
          Dashboard
        </h2>

        {role === "admin" && (
          <SideBarButton
            icon={PieChart}
            buttonText={"Dashboard"}
            isActive={isActive === "admin"}
            onclick={() => handleClick("admin")}
          />
        )}
        {role === "admin" && (
          <SideBarButton
            icon={Captions}
            buttonText={"Permission"}
            isActive={isActive === "admin/permission"}
            onclick={() => handleClick("admin/permission")}
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
      <div className="dashboard-content">
        <nav class="navbar navbar-expand-lg navbar-light bg-white border-primary border-bottom border-4">
          <div class="container-fluid">
            <div className="left-side-of-nav d-flex">
              <button
                class="btn toggle-btn"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasExample"
                aria-controls="offcanvasExample"
              >
                <span class="navbar-toggler-icon"></span>
              </button>
              <input
                type="search"
                className="form-control me-2"
                placeholder="search"
              />
            </div>
            <div className="right-side-of-nav me-2 d-flex align-items-center">
              <Bell />
              <div className="profile-icon-wrapper ms-4">
                <a
                  type="button"
                  className="profile-icon"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img src={image} className="profile-image" />
                </a>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li>
                    <a class="dropdown-item" href="#">
                      Action
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#">
                      Another action
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#">
                      Something else here
                    </a>
                  </li>
                  <li>
                    <hr class="dropdown-divider" />
                  </li>
                  <li>
                    <a class="dropdown-item" onClick={userLogout}>
                      Log out
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div
              class="offcanvas offcanvas-start"
              tabindex="-1"
              id="offcanvasExample"
              aria-labelledby="offcanvasExampleLabel"
            >
              <h2 className=" my-5 d-flex justify-content-center">Dashboard</h2>
              {role === "admin" && (
                <SideBarButton
                  icon={PieChart}
                  buttonText={"Dashboard"}
                  isActive={isActive === "home"}
                  onclick={() => handleClick("home")}
                />
              )}
              {role === "admin" && (
                <SideBarButton
                  icon={Captions}
                  buttonText={"Permission"}
                  isActive={isActive === "permission"}
                  onclick={() => handleClick("permission")}
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
        <Outlet />
      </div>
    </Fragment>
  );
};
export default DashBoard;
