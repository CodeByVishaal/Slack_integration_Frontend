import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../api";
import { AspectRatio } from "@/components/ui/aspect-ratio"
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
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"

const EditProgram = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "low",
    taxonomy: null,
    status: "",
  });

  useEffect(() => {
    axiosInstance.get(`programs/update/${id}/`)
      .then((res) => setFormData(res.data))
      .catch((err) => console.error("Error fetching program:", err));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

     const { taxonomy, ...updatedData } = formData;

  console.log("Submitting Data (without taxonomy):", updatedData);

    try {

      await axiosInstance.patch(`programs/update/${id}/`, updatedData);
      alert("Program updated successfully!");
      navigate("/programs");
    } catch (error) {
      console.error("Failed to update program:", error);
      alert("Failed to update program.");
    }
  };

  return (
    <div className="container w-[450px] mt-5">
        <AspectRatio ratio={16 / 9}>
      <h2>Edit Program</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input type="text" name="title" className="form-control"
                 value={formData.title} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea name="description" className="form-control"
                    value={formData.description} onChange={handleChange}></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Severity</label>
          <select name="severity" className="form-select"
                  value={formData.severity} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Status</label>
          <select name="status" className="form-select"
                 value={formData.status} onChange={handleChange}>
                 <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="closed">Closed</option>
            </select>
        </div>
        <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="btn btn-success">Update Program</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to Update the changes?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>Yes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
      </form>
      </AspectRatio>
    </div>
  );
};

export default EditProgram;
