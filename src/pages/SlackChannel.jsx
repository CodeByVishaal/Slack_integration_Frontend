import React, { useState, useEffect } from "react";
import axios from "axios";

const SlackChannel = () => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    axios
      .get("http://localhost:8000/api/programs/slack/channels/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setChannels(res.data.channels);
      })
      .catch((err) => {
        console.error("Error fetching Slack channels", err);
        alert("Failed to load Slack channels");
      });
  }, []);

  const saveChannel = () => {
    const token = localStorage.getItem("access_token");
    axios
      .post(
        "http://localhost:8000/api/programs/slack/save_channel/",
        { channel_id: selectedChannel },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        alert("Slack channel saved successfully!");
        window.location.href = "/programs"; // Redirect after selection
      })
      .catch((err) => {
        console.error("Error saving Slack channel", err);
        alert("Failed to save Slack channel");
      });
  };

  return (
    <div className="container mt-5">
      <h2>Select a Slack Channel</h2>
      <select
        className="form-select mt-3"
        value={selectedChannel}
        onChange={(e) => setSelectedChannel(e.target.value)}
      >
        <option value="">-- Select a Channel --</option>
        {channels.map((channel) => (
          <option key={channel.id} value={channel.id}>
            {channel.name}
          </option>
        ))}
      </select>
      <button className="btn btn-success mt-3" onClick={saveChannel} disabled={!selectedChannel}>
        Save Channel
      </button>
    </div>
  );
};

export default SlackChannel;
