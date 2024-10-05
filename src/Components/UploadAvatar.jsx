import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";

const UploadAvatar = () => {
  const [avatarFile, setAvatarFile] = useState(null);
  const [pklFile, setPklFile] = useState(null); // New state for the PKL file
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDownloadButton, setShowDownloadButton] = useState(false); // New state for the download button
  const navigate = useNavigate();

  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0]);
    setShowDownloadButton(false); // Reset download button visibility when selecting a new file
  };

  const handlePklChange = (e) => {
    setPklFile(e.target.files[0]);
    setShowDownloadButton(false); // Reset download button visibility when selecting a new file
  };

  const handleUpload = async () => {
    if (!avatarFile ) {
      alert("Please upload an avatar (FBX) file and/or a PKL file first.");
      return;
    }

    setIsUploading(true);
    setShowDownloadButton(false); // Hide the button before uploading

    const formData = new FormData();
    if (avatarFile) {
      formData.append("glb", avatarFile); // Use "glb" as the key for the avatar file
    }
   

    const xhr = new XMLHttpRequest();

    xhr.open("POST", "https://5000-01j7qdhjv0bmc6bnzjy4mj9p43.cloudspaces.litng.ai/process_and_send");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        setUploadProgress(Math.round(percentComplete));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        // Handle success response from server
        const response = JSON.parse(xhr.responseText);
        console.log("Avatar upload successful:", response);

        // Check if response contains 'download' key with 'YES' value
        if (response.download === "YES") {
          setShowDownloadButton(true); // Show the download button
        } else {
          navigate("/nextStep"); // Navigate to the next step if download is not allowed
        }
      } else {
        console.error("Error uploading avatar", xhr.statusText);
        alert("Error uploading avatar. Please try again.");
      }

      setIsUploading(false);
    };

    xhr.onerror = () => {
      console.error("Avatar upload failed.");
      alert("Error uploading avatar. Please try again.");
      setIsUploading(false);
    };

    xhr.send(formData);
  };

  const handleDownload = () => {
    // Redirect to download URL or handle download logic
    window.location.href = "https://5000-01j1sm2bc3v63008xnawxdcexy.cloudspaces.litng.ai/download";
  };
  

  return (
    
    <>
    
   <div className=" ">
    <Logo/>
    
   <div className="flex flex-row items-center justify-center  poppins-regular">
   <div className="w-[600px] relative bottom-0 right-0    border-red-500">
      <img src="p1.svg" alt="" /> 
      </div>

      <div className="flex flex-col items-center space-y-4">
      <h1 className="text-3xl mb-6">Upload Your Avatar</h1>
        <input
          type="file"
          accept=".fbx"
          onChange={handleAvatarChange}
          className="p-2 border border-gray-300 rounded-lg"
        />
        
        

        <button
          onClick={handleUpload}
          disabled={isUploading || (!avatarFile && !pklFile)}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "Upload Avatar"}
        </button>

        {isUploading && (
          <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
            <div
              className="bg-blue-500 h-4 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        {uploadProgress > 0   && uploadProgress<100 &&  <p>{uploadProgress}% uploaded</p>}

        {showDownloadButton && (
          <button
            onClick={handleDownload}
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-700 mt-4"
          >
            Download Avatar
          </button>
        )}
      </div>

      
    </div>


    
   </div>
    </>
  );
};

export default UploadAvatar;
