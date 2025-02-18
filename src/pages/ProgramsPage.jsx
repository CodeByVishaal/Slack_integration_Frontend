import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../api";
import Header from "./Header";

const ProgramPage = () => {
  const [programs, setPrograms] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "low",
    taxonomy: null,
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");

  // Fetch Programs
  const fetchPrograms = () => {
    axiosInstance
      .get("programs/", { headers: authHeader() })
      .then((res) => {
        console.log("Fetched Programs:", res.data);
        setPrograms(
          Array.isArray(res.data) ? res.data : res.data.results || []
        );
      })
      .catch((err) => {
        console.error("Error fetching programs:", err);
        setPrograms([]);
      });
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle File Upload
  const handleFileChange = (e) => {
    setFormData({ ...formData, taxonomy: e.target.files[0] });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userRole !== "customer") {
      setMessage("Only customers can create a program.");
      return;
    }

    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(key, value);
    });

    console.log("Request Body:", formDataObj);

    try {
      await axiosInstance.post("programs/", formDataObj, {
        headers: {
          ...authHeader(),
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Program created successfully!");
      fetchPrograms(); // Re-fetch all programs
    } catch (error) {
      console.error("Failed to create program:", error);
      setMessage("Failed to create program.");
    }
  };

  return (
    <>
      <Header />
      <div className="container mt-5">
        <h2 className="text-center">Programs</h2>

        {/* Show Error Message */}
        {message && <div className="alert alert-info">{message}</div>}

        {/* Program Creation Form (Only for Customers) */}
        {userRole === "customer" && (
          <div className="card p-3 mb-4 shadow-sm">
            <h4>Create a New Program</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="Program Title"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  placeholder="Program Description"
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
                <label className="form-label">Upload Taxonomy Document</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Create Program
              </button>
            </form>
          </div>
        )}

        {/* Display Programs */}
        <div className="row">
          {programs.length === 0 ? (
            <p className="text-center text-muted">No programs available.</p>
          ) : (
            programs.map((program) => (
              <div key={program.id} className="col-lg-6 col-md-12">
                <div className="card shadow-lg border-0 rounded-4 mb-4">
                  <div className="card-body">
                    <h4 className="card-title fw-bold">{program.title}</h4>
                    <p className="card-text">{program.description}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span
                        className={`badge bg-${getSeverityColor(
                          program.severity
                        )} p-2`}
                      >
                        {program.severity.toUpperCase()}
                      </span>
                      <span className="badge bg-info text-dark p-2">
                        Status: {program.status}
                      </span>
                    </div>
                    {userRole === "admin" && (
                      <div className="mt-3">
                        <button
                          className="btn btn-warning btn-sm px-3"
                          onClick={() =>
                            navigate(`/programs/edit/${program.id}`)
                          }
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm px-3"
                          onClick={() => handleDelete(program.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

// Get Auth Headers
const authHeader = () => {
  return {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
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
  if (!window.confirm("Are you sure you want to delete this program?")) return;

  try {
    await axiosInstance.delete(`programs/update/${id}/`, {
      headers: authHeader(),
    });
    window.location.reload();
    setMessage("Program Deleted Successfully");
    {
      message && <div className="alert alert-info">{message}</div>;
    }
  } catch (error) {
    console.error("Error deleting program:", error);
  }
};

export default ProgramPage;
