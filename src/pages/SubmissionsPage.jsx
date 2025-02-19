import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../api";
import Header from "./Header";
import { Button } from "../components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";

const Submissions = () => {
  const [submission, setSubmission] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    program: "",
    description: "",
    severity: "low",
    evidence: null,
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");

  const fetchSubmissions = () => {
    const token = localStorage.getItem("access_token");
    console.log("Access Token:", token); // Debugging token

    if (!token) {
      console.error("No access token found!");
      return;
    }

    axiosInstance
      .get("submissions/", { headers: authHeader() })
      .then((res) => {
        console.log("Fetched Submissions:", res.data);
        setSubmission(
          Array.isArray(res.data) ? res.data : res.data.results || []
        );
      })
      .catch((err) => {
        console.error("Error Fetching Submissions: ", err);
        setSubmission([]);
      });
  };

  const fetchPrograms = () => {
    axiosInstance
      .get("programs/", { headers: authHeader() })
      .then((res) => {
        console.log("Fetched Programs:", res.data);
        setPrograms(res.data); // Store programs in state
      })
      .catch((err) => {
        console.error("Error Fetching Programs: ", err);
        setPrograms([]);
      });
  };

  useEffect(() => {
    fetchSubmissions();
    fetchPrograms();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, evidence: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userRole !== "researcher") {
      setMessage("Only Researcher can create a submission.");
      return;
    }

    if (!formData.program) {
      setMessage("Please select a program before submitting.");
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append("title", formData.title);
    formDataObj.append("program", formData.program); // Ensure this is a valid program ID
    console.log("Program ID before submission:", formData.program);
    formDataObj.append("description", formData.description);
    formDataObj.append("severity", formData.severity);
    if (formData.evidence) {
      formDataObj.append("evidence", formData.evidence);
    }

    console.log("Final FormData:", [...formDataObj.entries()]); // Debugging log

    try {
      await axiosInstance.post("submissions/", formDataObj, {
        headers: authHeader(),
      });
      setMessage("Program created successfully!");
      fetchSubmissions();
    } catch (error) {
      console.error(
        "Failed to create Submission: ",
        error.response?.data || error.message
      );
      setMessage(
        "Failed to Create Submission. Error: " +
          JSON.stringify(error.response?.data)
      );
    }
  };

  return (
    <>
      <Header />
      <div className="container mt-5"></div>
      <h2 className="my-5 text-center">Submissions</h2>

      {/* Show Error Message */}
      {message && <div className="alert alert-info">{message}</div>}

      {/* Submission Creation Form (Only for Researchers) */}
      {userRole === "researcher" && (
        <div className="card p-3 mb-4 shadow-sm">
          <h4>Create a New Submission</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="Submission Title"
                onChange={handleChange}
                required
              />
              <div className="mb-3">
                <label className="form-label">Program</label>
                <select
                  name="program"
                  className="form-select"
                  onChange={handleChange}
                  required
                >
                  <option className="text-black" value="">
                    Select a program
                  </option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-control"
                rows="3"
                placeholder="Submission Description"
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Severity</label>
              <select
                name="severity"
                className="form-select"
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Upload Evidence Document</label>
              <input
                type="file"
                className="form-control"
                onChange={handleFileChange}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Create Submission
            </button>
          </form>
        </div>
      )}

      {/* Display Programs */}
      <div className="row">
        {submission.length === 0 ? (
          <p className="text-center text-muted">No submissions available.</p>
        ) : (
          submission.map((submission) => (
            <div key={submission.id} className="col-lg-6 col-md-12">
              <div className="card shadow-lg border-0 rounded-4 mb-4">
                <div className="card-body">
                  <h4 className="card-title fw-bold">{submission.title}</h4>
                  <p className="card-text">{submission.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span
                      className={`badge bg-${getSeverityColor(
                        submission.severity
                      )} p-2`}
                    >
                      {submission.severity.toUpperCase()}
                    </span>
                    <span className="badge bg-info text-dark p-2">
                      Status: {submission.status}
                    </span>
                  </div>
                  {userRole === "admin" && (
                    <div className="mt-3">
                      <Button
                        className="text-black mr-3 bg-yellow-300"
                        onClick={() => navigate(`/submissions/edit/${program.id}`)}
                      >
                        ✏️ Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="bg-red-700">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure you want to delete this submission?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your account and remove your
                              data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>No</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(program.id)}
                            >
                              Yes
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                  ;
                </div>
              </div>
            </div>
          ))
        )}
        ;
      </div>
    </>
  );
};

// Get Auth Headers
const authHeader = () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    console.error("Authorization token is missing!");
    return {};
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

// Get Color Based on Severity
const getSeverityColor = (severity) => {
  return severity === "high"
    ? "danger"
    : severity === "medium"
    ? "warning"
    : "success";
};

// Handle Program Deletion
const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this submission?"))
    return;

  try {
    await axiosInstance.delete(`submissions/update/${id}/`, {
      headers: authHeader(),
    });
    window.location.reload();
    setMessage("Submission Deleted Successfully");
    {
      message && <div className="alert alert-info">{message}</div>;
    }
  } catch (error) {
    console.error("Error deleting submission:", error);
  }
};

export default Submissions;
