import { useEffect, useState, Fragment } from "react";
import "./dashboard.style.css";
import DetailCard from "../../component/Dashboard-Card/detail-card.component";
import { Bell, PieChart, Captions, Pickaxe } from "lucide-react";

import { Outlet, useNavigate } from "react-router-dom";

import image from "../../component/assets/img/ricefield.jpg";
import SideBarButton from "../../component/side_bar_button/side_bar_button.component";

const DashBoard = () => {
  const [isActive, setIsActive] = useState(null);
  const navigate = useNavigate();

  const handleClick = (buttontext) => {
    setIsActive(buttontext);
    navigate(`/dashboard/${buttontext}`);
  };
  return (
    <Fragment>
      <div className="side-bar">
        <h2 className="text-white my-5 d-flex justify-content-center">
          Dashboard
        </h2>

        <SideBarButton
          icon={PieChart}
          buttonText={"Dashboard"}
          isActive={isActive === "home"}
          onclick={() => handleClick("home")}
        />
        <SideBarButton
          icon={Captions}
          buttonText={"Permission"}
          isActive={isActive === "permission"}
          onclick={() => handleClick("permission")}
        />
        <SideBarButton
          icon={Pickaxe}
          buttonText={"Assign Worker"}
          isActive={isActive === "assign-worker"}
          onclick={() => handleClick("assign-worker")}
        />
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
                <a href="#" className="profile-icon">
                  <img src={image} className="profile-image" />
                </a>
              </div>
            </div>

            <div
              class="offcanvas offcanvas-start"
              tabindex="-1"
              id="offcanvasExample"
              aria-labelledby="offcanvasExampleLabel"
            >
              <h2 className=" my-5 d-flex justify-content-center">Dashboard</h2>
              <SideBarButton
                icon={PieChart}
                buttonText={"Dashboard"}
                isActive={isActive === "home"}
                onclick={() => handleClick("home")}
              />
              <SideBarButton
                icon={Captions}
                buttonText={"Permission"}
                isActive={isActive === "permission"}
                onclick={() => handleClick("permission")}
              />
              <SideBarButton
                icon={Pickaxe}
                buttonText={"Assign Worker"}
                isActive={isActive === "assign-worker"}
                onclick={() => handleClick("assign-worker")}
              />
            </div>
          </div>
        </nav>
        <Outlet />
      </div>
    </Fragment>
  );
};
export default DashBoard;
