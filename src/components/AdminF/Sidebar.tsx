import { useState } from "react";
import { useNavigate } from "react-router-dom";

type SidebarProps = {
  activeSection: string | undefined;
  setActiveSection: React.Dispatch<React.SetStateAction<string | undefined>>;
  onLogout: () => void | Promise<void>;
  history: any; 
};

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  // Get and parse user info from localStorage
  const userInfoString = localStorage.getItem("userInfo") || "{}"; // Fallback to empty object if null
  const userInfo: any = JSON.parse(userInfoString);

  const username: string = userInfo.username || " ";

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
        <h3>{username}</h3>
      </center>
      <ul>
        <li
          className={activeSection === "dashboard" ? "active" : ""}
          onClick={() => setActiveSection("dashboard")}
        >
          Dashboard
        </li>
        <li
          className={activeSection === "allusers" ? "active" : ""}
          onClick={() => setActiveSection("allusers")}
        >
          All Users
        </li>
        <li
          className={activeSection === "services" ? "active" : ""}
          onClick={() => setActiveSection("services")}
        >
          Services
        </li>
        <li
          className={activeSection === "jobrequest" ? "active" : ""}
          onClick={() => setActiveSection("jobrequest")}
        >
          Job Requests
        </li>
        <li
          className={activeSection === "technicians" ? "active" : ""}
          onClick={() => setActiveSection("technicians")}
        >
          Technicians
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
              {/* localStorage.clear(); */}
              <button className="btn btn-dark" onClick={handleCancelLogout}>No</button>
            </div></div>
          </div>
        )}
      </ul>
    </div>
  );
};
