import { logout } from "../api";


const Dashboard = () => {
    return (
        <div>
        <h1>Welcome</h1>
        <button onClick={logout} className="bg-red-500 text-white p-2 mt-4">Logout</button>
        </div>
    )
}

export default Dashboard;