import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";

const UploadVideo = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [totalFrames, setTotalFrames] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const navigate = useNavigate();

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!videoFile) {
      alert("Please upload a video file first.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("video", videoFile);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", "https://5000-01j7qdhjv0bmc6bnzjy4mj9p43.cloudspaces.litng.ai/VideoRun");
    // xhr.open("POST", "http://localhost:3000/VideoRun");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        setUploadProgress(Math.round(percentComplete));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        const { totalFrames } = response;
        setTotalFrames(totalFrames);

        // Calculate total time assuming 30 frames per second
        const totalSeconds = Math.ceil((totalFrames * 60) / 100);
        setTimer(totalSeconds);

        // Start the countdown
        const countdown = setInterval(() => {
          setTimer((prev) => {
            if (prev > 0) return prev - 1;
            clearInterval(countdown);
            setShowNextButton(true); // Show the next button when timer ends
            return 0;
          });
        }, 1000);
      } else {
        console.error("Error uploading video", xhr.statusText);
        alert("Error uploading video. Please try again.");
      }

      setIsUploading(false);
    };

    xhr.onerror = () => {
      console.error("Upload failed.");
      alert("Error uploading video. Please try again.");
      setIsUploading(false);
    };

    xhr.send(formData);
  };

  const handleNextClick = () => {
    navigate("/uploadAvatar"); // Navigate to UploadAvatar component
  };

  // Function to format the timer into minutes and seconds
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
     <>
     
    <div className="h-screen">
    <Logo/>
    <div className="flex  items-center justify-around  border-red-500    poppins-regular">

      

      <div className="flex flex-col items-center space-y-4 border p-4 rounded-3xl shadow">

      <h1 className="text-3xl  mb-6">{isUploading || timer>0?"Please Wait...":"Upload Your Video"}</h1>
        {!isUploading && timer===0 ?<input
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          className="p-2 border border-gray-300 rounded-lg"
        />:""}

       {uploadProgress>=0 && uploadProgress<100? <button
          onClick={handleUpload}
          disabled={isUploading || !videoFile}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 mt-6"
        >
          {isUploading ? "Uploading..." : "Upload Video"}
        </button>:''}

        {isUploading && (
          <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
            <div
              className="bg-blue-500 h-4 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        {uploadProgress > 0 && uploadProgress<100 && <p>{uploadProgress}% uploaded</p>}

        {totalFrames !== null && timer !== 0 && (
          <div className="mt-4 text-xl font-semibold ">
            <span className="text-green-500">Countdown:</span> {formatTime(timer)}
          </div>
        )}

        {showNextButton && (
          <button
            onClick={handleNextClick}
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-700"
          >
            Process Next
          </button>
        )}
      </div>

      <div className="w-[600px] relative bottom-0 right-0    border-red-500">
      <img src="p1.svg" alt="" /> 
      </div>

      {/* bg-gray-100 */}
    </div>
    </div>
     </>
  );
};

export default UploadVideo;
