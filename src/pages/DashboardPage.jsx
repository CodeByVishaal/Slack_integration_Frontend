import { logout } from "../api";
import Header from "./Header";


const Dashboard = () => {
    return (
        <div>
            <Header />
        <h1>Welcome</h1>
        <button onClick={logout} className="bg-red-500 text-white p-2 mt-4">Logout</button>
        </div>
    )
}

export default Dashboard;