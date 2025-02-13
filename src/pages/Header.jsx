import { Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate(); // ✅ Now inside the component

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("is_superuser");
    navigate("/login"); // ✅ Use navigate instead of window.location.href
  };

  return (
    <Navbar>
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

