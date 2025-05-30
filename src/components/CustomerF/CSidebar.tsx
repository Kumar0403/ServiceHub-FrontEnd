import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const userInfoString = localStorage.getItem("userInfo") || "{}";
const userInfo: any = JSON.parse(userInfoString);

type SidebarProps = {
  activeSection: string | undefined;
  setActiveSection: React.Dispatch<React.SetStateAction<string | undefined>>;
  onLogout: () => void | Promise<void>;
  history: any; 
};

export const CSidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const [user,setUser] = useState(userInfo.username)

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    localStorage.clear();
    navigate("/");
    console.log("User logged out");
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };
  return (
    <div className="sidebar">
      <center>
        <i className="fa-solid fa-circle-user"></i>
      </center>
      <center>
        <h3>{user}</h3>
      </center>
      <ul>
        <li
          className={activeSection === "dashboard" ? "active" : ""}
          onClick={() => setActiveSection("dashboard")}
        >
          Dashboard
        </li>

        <li
          className={activeSection === "services" ? "active" : ""}
          onClick={() => setActiveSection("services")}
        >
          Services
        </li>
        <li
          className={activeSection === "history" ? "active" : ""}
          onClick={() => setActiveSection("history")}
        >
          Service History
        </li>
        <li className="logout-link">
          <a href="#" onClick={handleLogoutClick}>
            Logout
          </a>
        </li>
        {showLogoutModal && (
          <div className="modal" style={{ display: 'block' }}>
            <div className="logout-content">
              <center><h2>Confirm Logout</h2>
              <p>Are you sure you want to logout?</p>
              </center>
              <div className="logout-btn">
              <button id="yes" className="btn btn-dark"onClick={handleConfirmLogout}>
                Yes
              </button>
              <button className="btn btn-dark" onClick={handleCancelLogout}>No</button>
            </div></div>
          </div>
        )}
      </ul>
    </div>
  );
};
