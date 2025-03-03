import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../api";
import Header from "./Header";
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
import { Button } from "../components/ui/button";
import { AspectRatio } from "../components/ui/aspect-ratio";
import { useToast } from "../hooks/use-toast";

const ProgramPage = () => {
  const [programs, setPrograms] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "low",
    taxonomy: null,
  });
  const [message, setMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  const { toast } = useToast();

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
      if (key === "taxonomy" && value === null) {
        return; // Don't append if taxonomy is null
      }
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

      setIsDialogOpen(false);

      toast({
        variant: "kt",
        description: "Program created successfully!",
      });

      fetchPrograms(); // Re-fetch all programs
    } catch (error) {
      console.error("Failed to create program:", error);
      setMessage("Failed to create program.");
    }
  };

  // Handle Program Deletion
  const handleDelete = async (id) => {
    //   if (!window.confirm("Are you sure you want to delete this program?")) return;

    try {
      await axiosInstance.delete(`programs/update/${id}/`, {
        headers: authHeader(),
      });
      setPrograms((prevPrograms) => prevPrograms.filter((p) => p.id !== id));
      setMessage("Program Deleted Successfully");
      toast({
        variant: "kt",
        description: "Program deleted successfully!",
      });

      fetchPrograms();
    } catch (error) {
      console.error("Error deleting program:", error);
    }
  };

  return (
    <AspectRatio ratio={16 / 9}>
      <Header />
      <div className="container mt-5">
        <h2 className="text-center">Programs</h2>

        {/* Show Error Message */}
        {message && <div className="alert alert-info">{message}</div>}

        {/* Program Creation Form (Only for Customers) */}
        {userRole === "customer" && (
          <div className="card p-3 mb-4 shadow-sm">
            <h4>Create a New Program</h4>
            <form>
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
              <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button className="bg-green-600">Create Program</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-gradient-to-r from-violet-200 to-pink-200 text-black">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to create this program?
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="justify-center">
                    <AlertDialogCancel className="bg-black text-white">
                      No
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="mx-10 my-2"
                      onClick={handleSubmit}
                    >
                      Yes
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              ;
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
                        <Button
                          className="text-black mr-3 bg-yellow-300"
                          onClick={() =>
                            navigate(`/programs/edit/${program.id}`)
                          }
                        >
                          ✏️ Edit
                        </Button>
                        <AlertDialog
                          open={isDialogOpen}
                          onOpenChange={setIsDialogOpen}
                        >
                          <AlertDialogTrigger asChild>
                            <Button className="bg-red-700">Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-gradient-to-r from-violet-200 to-pink-200 text-black">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure you want to delete this program?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your account and remove your
                                data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="justify-center">
                              <AlertDialogCancel className="bg-black text-white">
                                No
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(program.id)}
                                className="my-2"
                              >
                                Yes
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AspectRatio>
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

export default ProgramPage;
