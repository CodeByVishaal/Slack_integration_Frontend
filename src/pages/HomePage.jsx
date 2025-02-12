import { logout } from "../api";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import {Navbar, NavLink} from "react-bootstrap"

const Home = () => {

    const navigate = useNavigate();

    return(
        <div>
            <button onClick={() => navigate('/signup')} className="btn btn-light btn-lg">Signup</button>
            <button onClick={() => navigate('/login')} className="btn btn-dark btn-lg">Login</button>
        </div>
    )
}
export default Home;