


import { Camera, X } from "lucide-react";
import "./take_photo.style.css";
import { useRef, useEffect, useState } from "react";
import { useUploadPhoto } from "../../custom-hook/upload-image/upload-image";
import { usePost } from "../../custom-hook/axios-post/axios-post";

const TakePhoto = () => {
  const videoref = useRef(null);
  const canvasref = useRef(null);
  const [openCamera, setOpenCamera] = useState(false);
  const { postData } = usePost("http://localhost:5000/dashboard/uploadbase64image");
  const [stream, setStream] = useState(null);

  const switchCamera = () => {
    setOpenCamera(true);
  };

  const capture = async () => {
    const video = videoref.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Resize the image
    const resizedCanvas = document.createElement("canvas");
    resizedCanvas.width = 800;
    resizedCanvas.height = (canvas.height * resizedCanvas.width) / canvas.width;
    const resizedContext = resizedCanvas.getContext("2d");
    resizedContext.scale(-1, 1);
    resizedContext.drawImage(video, 0, 0, -resizedCanvas.width, resizedCanvas.height);
    // const imageUrl = resizedCanvas.toDataURL();
    const imageUrl = resizedCanvas.toDataURL("image/jpeg", 0.7); // 0.7 indicates 70% quality


    // Store image in session storage
    sessionStorage.setItem("capturedImage", imageUrl);
    setOpenCamera(false);
    const response = await postData({ url: imageUrl });
  };

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: { width: 1920, height: 1080 },
      })
      .then((stream) => {
        setStream(stream);
        let video = videoref.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const cancelVideoStream = () => {
    setOpenCamera(false);
  };

  const stopVideo = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    if (openCamera) {
      getVideo();
    } else {
      stopVideo();
    }
    return () => {
      stopVideo();
    };
  }, [openCamera]);

  const handleUpload = async () => {
    const imageUrl = sessionStorage.getItem("capturedImage");
    if (imageUrl) {
      const response = await postData({ url: imageUrl });
      // Handle the response from the server
      console.log(response);
    }
  };

  return (
    <div className="container-fluid">
      {openCamera && (
        <div className="video">
          <div className="video-wrapper">
            <video ref={videoref}></video>
            <div className="cancel-btn" onClick={cancelVideoStream}>
              <X />
            </div>
            <div className="capture-btn">
              <button className="capture-btn-inside-stream" onClick={capture}>
                <Camera className="icon" />
              </button>
            </div>
          </div>
        </div>
      )}
      {!openCamera && (
        <div className="btn-wrapper w-100">
          <button className="open-btn" onClick={switchCamera}>
            <Camera className="icon" />
          </button>
        </div>
      )}
      <div className="btn-wrapper">
        {sessionStorage.getItem("capturedImage") && (
          <>
            <img src={sessionStorage.getItem("capturedImage")} alt="Captured" />
            <button className="upload-btn" onClick={handleUpload}>
              Upload
            </button>
            <button className="retake-btn" onClick={() => sessionStorage.removeItem("capturedImage")}>
              Retake
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TakePhoto;
