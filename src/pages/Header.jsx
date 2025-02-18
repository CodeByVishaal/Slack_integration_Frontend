import { Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SlackIntegration from "./SlackIntegration";
import "../css/Header.css"
import { useEffect, useState } from "react";

const Header = () => {
  const [isCustomer, setIsCustomer] = useState(true);

  const navigate = useNavigate(); // ✅ Now inside the component

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("is_superuser");
    navigate("/login"); // ✅ Use navigate instead of window.location.href
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
  if(role != 'customer'){
    setIsCustomer(false);
  }
  }, [])

  return (
    <Navbar>
      {isCustomer ? (
        <button onClick={() => navigate('/slack-auth-test')}className="slack mr-3 btn btn-lg btn-primary">
        Connect Slack
      </button>
      ):
      (
       <div></div>

      )}

      <button onClick={() => navigate('/programs')} className="mr-3 btn btn-lg btn-primary">
        Programs
      </button>
      <button onClick={() => navigate('/submissions')} className="mr-3 btn btn-lg btn-danger">
        Submissions
      </button>
      <button onClick={handleLogout} className="mr-3 btn bg-dark btn-lg btn-light text-white">
        Logout
      </button>
    </Navbar>
  );
};

export default Header;

