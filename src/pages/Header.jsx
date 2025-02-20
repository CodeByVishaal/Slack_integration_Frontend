import { Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SlackIntegration from "./SlackIntegration";
import "../css/Header.css"
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";

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
    <Navbar className="">
      {isCustomer ? (
        <Button onClick={() => navigate('/slack-auth-test')} className="px-3 py-2.5 text-black-sm mx-80 mr-3 bg-gradient-to-r from-violet-200 to-pink-200">
        Connect Slack
      </Button>
      ):
      (
       <div></div>

      )}

      <Button onClick={() => navigate('/programs')} className="px-3 py-2.5 text-black-sm mx-3 bg-gradient-to-r from-violet-200 to-pink-200">
        Programs
      </Button>
      <Button onClick={() => navigate('/submissions')} className="px-3 py-2.5 text-black-sm mx-3 bg-gradient-to-r from-violet-200 to-pink-200">
        Submissions
      </Button>
      <Button onClick={handleLogout} className="px-3 py-2.5 mx-20 text-black-sm ml-3 bg-gradient-to-r from-violet-200 to-pink-200">
        Logout
      </Button>
    </Navbar>
  );
};

export default Header;

