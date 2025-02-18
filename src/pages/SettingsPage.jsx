import React, { useState, useEffect } from "react";
import axios from "axios";

const SettingsPage = () => {
  const [slackUser, setSlackUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/user/")
      .then(response => {
        setSlackUser(response.data.slack_user_id);
      })
      .catch(error => console.error("Error fetching user data:", error));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Slack Integration</h2>
      {slackUser ? (
        <p>✅ Connected to Slack as {slackUser}</p>
      ) : (
        <a href="http://localhost:8000/api/programs/slack/auth/" className="btn btn-primary">
          Connect Slack
        </a>
      )}
    </div>
  );
};

export default SettingsPage;
