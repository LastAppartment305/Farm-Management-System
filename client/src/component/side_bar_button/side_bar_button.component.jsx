import { useState } from "react";
import "./side_bar_button.style.css";

const SideBarButton = ({ icon: Icon, buttonText, isActive, onclick }) => {
  return (
    <a
      type="button"
      className={`side-bar-button ${isActive ? "active" : ""}`}
      onClick={onclick}
    >
      <div className="d-flex align-items-center ms-4 button-content">
        <Icon />
        <div className="dashboard-text">{buttonText}</div>
      </div>
    </a>
  );
};
export default SideBarButton;
