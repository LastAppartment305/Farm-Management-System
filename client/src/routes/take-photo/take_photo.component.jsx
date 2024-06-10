import { Camera, X } from "lucide-react";
import "./take_photo.style.css";
import { useRef, useEffect, useState } from "react";
import { useUploadPhoto } from "../../custom-hook/upload-image/upload-image";
import { usePost } from "../../custom-hook/axios-post/axios-post";

const TakePhoto = () => {
  const videoref = useRef(null);
  const canvasref = useRef(null);
  // const { upload } = useUploadPhoto(
  //   "http://localhost:5000/dashboard/uploadbase64image"
  // );
  const [openCamera, setopenCamera] = useState(false);
  const { postData } = usePost(
    "http://localhost:5000/dashboard/uploadbase64image"
  );
  const [stream, setstream] = useState(null);
  const switchCamera = () => {
    setopenCamera(true);
    //console.log("capture button", openCamera);
  };
  const capture = async () => {
    const video = videoref.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    //const imageUrl = canvas.toDataURL("image/png");

    //Resize the image
    const width = 800;
    const height = (canvas.height * width) / canvas.width;
    const resizedCanvas = document.createElement("canvas");
    resizedCanvas.width = width;
    resizedCanvas.height = height;
    const resizedContext = canvas.getContext("2d");
    resizedContext.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageUrl = resizedCanvas.toDataURL();
    //const imageUrlToString = JSON.stringify(imageUrl);
    // Convert canvas to base64 image URL
    const response = await postData({ url: imageUrl });
    sessionStorage.setItem("capturedImage", imageUrl); // Store image in session storage
    setopenCamera(false);
  };
  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: { width: 1920, height: 1080 },
      })
      .then((stream) => {
        setstream(stream);
        let video = videoref.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const cancelVideoStream = () => {
    setopenCamera(false);
  };
  const stopVideo = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setstream(null);
    }
  };
  useEffect(() => {
    if (openCamera) {
      getVideo();
      //console.log("take photo component: ", openCamera);
    } else {
      stopVideo();
    }
    return () => {
      stopVideo();
    };
  }, [openCamera]);
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
    </div>
  );
};
export default TakePhoto;
