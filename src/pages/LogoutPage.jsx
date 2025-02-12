import { Navbar } from "react-bootstrap";
import { NavLink } from "react-bootstrap";
import { logout } from "../api";

const Logout = () => {
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("is_superuser");
    window.location.href = "/login";
  };

  return (
    <Navbar>
      <NavLink onClick={logout} className="nav-dark">
        <button className="btn bg-dark btn-lg btn-light text-white">Logout</button>
      </NavLink>
    </Navbar>
  );
};
export default Logout;
