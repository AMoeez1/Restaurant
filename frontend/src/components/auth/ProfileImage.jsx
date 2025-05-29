import { useState } from "react";
import axios from "axios";

function ProfileImage() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleProfile = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/upload-avatar`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload success:", res.data);
      alert("Profile picture updated!");
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
      alert("Upload failed");
    }
  };

  return (
    <form onSubmit={handleProfile}>
      <input type="file" name="avatar" onChange={handleFileChange} accept="image/*" />
      <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
        Change
      </button>
    </form>
  );
}

export default ProfileImage;
