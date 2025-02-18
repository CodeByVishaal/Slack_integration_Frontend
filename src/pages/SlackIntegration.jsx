import React from "react";

async function checkSlackAuth() {
    try {
        const response = await fetch('http://localhost:8000/api/programs/slack/auth/', {
            method: 'GET'
        });

        const data = await response.json();

        if (data.authenticated) {
            console.log(data.authenticated);
            // User is authenticated
            console.log(data.message); // Display the message
            alert(data.message);
            // window.location.href = data.redirect_url; // Redirect to the Slack page
        }
        else {
            window.location.href = "http://localhost:8000/api/programs/slack/auth/";
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const SlackIntegration = () => {
  const connectSlack = () => {
    window.location.href = "http://localhost:8000/api/programs/slack/auth/";
  };

  return (
    <div className="d-flex justify-content-center mt-4">
      <button onClick={checkSlackAuth} className="btn btn-primary">
        <i className="fab fa-slack me-2"></i> Connect Slack
      </button>
    </div>
  );
};

export default SlackIntegration;
