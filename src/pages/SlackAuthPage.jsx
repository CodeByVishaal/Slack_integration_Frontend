import { useEffect, useState } from "react";
import { axiosInstance } from "../api";

const SlackAuthPage = () => {
    const [isAuth, setIsAuth] = useState(false);
    const [slackData, setSlackData] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchSlackAuthStatus = async () => {
            try {
                const response = await axiosInstance.get("/programs/slack-auth-test", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                });

                setSlackData(response.data);
                setMessage(response.data.message);
                setIsAuth(response.data.authenticated); // Update authentication status
            } catch (error) {
                console.error("Error fetching Slack authentication status:", error);
                setMessage("Failed to fetch Slack authentication status.");
                setIsAuth(false);
            }
        };

        fetchSlackAuthStatus();
    }, []);

    return (
        <div className="container mt-4">
            <h2>Slack Authentication Status</h2>
            <p>{message}</p>

            {isAuth ? (
                // Display table if authenticated
                <table className="table table-bordered mt-3">
                    <thead className="table-dark">
                        <tr>
                            <th>Slack User ID</th>
                            <th>User Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{slackData?.slack_user_id || "N/A"}</td>
                            <td>{slackData?.user_name || "N/A"}</td>
                        </tr>
                    </tbody>
                </table>
            ) : (
                // Show connect button if NOT authenticated
                <div className="mt-3">
                    <p className="text-danger">User is not authenticated with Slack.</p>
                    <a href="http://localhost:8000/api/programs/slack/auth" className="btn btn-primary">
                        Connect to Slack
                    </a>
                </div>
            )}
        </div>
    );
};

export default SlackAuthPage;
