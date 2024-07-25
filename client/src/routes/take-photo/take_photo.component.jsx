import { Camera, X, SendHorizonal } from "lucide-react";
import "./take_photo.style.css";
import { useRef, useEffect, useState, useContext } from "react";
import { useUploadPhoto } from "../../custom-hook/upload-image/upload-image";
import { usePost } from "../../custom-hook/axios-post/axios-post";
import { useNavigate } from "react-router-dom";
import { authContext } from "../../context/context";
import { Toaster, toast } from "react-hot-toast";

const TakePhoto = () => {
  const videoref = useRef(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);
  const { postData } = usePost(
    "http://localhost:5000/dashboard/uploadbase64image"
  );
  const [stream, setStream] = useState(null);
  const navigate = useNavigate();

  const switchCamera = () => {
    setOpenCamera(true);
  };
  const { verifyWorker, setVerifyWorker } = useContext(authContext);

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
    resizedContext.drawImage(
      video,
      0,
      0,
      -resizedCanvas.width,
      resizedCanvas.height
    );
    // const imageUrl = resizedCanvas.toDataURL();
    const imageUrl = resizedCanvas.toDataURL("image/jpeg", 0.7); // 0.7 indicates 70% quality

    // Store image in session storage
    sessionStorage.setItem("capturedImage", imageUrl);
    setOpenCamera(false);
    setRemoveImage(true);
    // const response = await postData({ url: imageUrl });
  };

  const getVideo = async () => {
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

  const stopVideo = async () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    const handleVideo = async () => {
      if (openCamera) {
        await getVideo();
      } else {
        await stopVideo();
      }
    };

    handleVideo();
    // const getCookie = Cookie.get("workerAuth");
    // if (getCookie) {
    //   console.log("cookie exist.");
    // } else {
    //   navigate("/worker-login");
    // }

    console.log(verifyWorker);
    return async () => {
      await stopVideo();
    };
  }, [openCamera]);
  // useEffect(() => {
  //   if (!verifyWorker) {
  //     navigate("/worker-login");
  //   }
  // }, [verifyWorker, navigate]);

  const handleUpload = async () => {
    const imageUrl = sessionStorage.getItem("capturedImage");
    if (imageUrl) {
      const response = await postData({ url: imageUrl });
      console.log("take photo", response);
      if (response === undefined) {
        // setVerifyWorker(false);
        navigate("/worker-login");
        sessionStorage.removeItem("capturedImage");
      } else {
        toast.success("အောင်မြင်ပါသည်");
        sessionStorage.removeItem("capturedImage");
      }
    }
  };
  const removeCaptureImage = () => {
    sessionStorage.removeItem("capturedImage");
    setRemoveImage(false);
  };
  const logout = () => {
    navigate("/worker-login");
  };
  console.log("verifyWorker from take-photo: ", verifyWorker);

  return (
    <div className='container-fluid'>
      <div className='logout-btn '>
        <button className='btn btn-primary fs-5' onClick={logout}>
          ထွက်ရန်
        </button>
      </div>
      <Toaster toastOptions={{ duration: 3000 }} />
      {openCamera && (
        <div className='video'>
          <div className='video-wrapper'>
            <video ref={videoref}></video>
            <div className='cancel-btn' onClick={cancelVideoStream}>
              <X />
            </div>
            <div className='capture-btn'>
              <button className='capture-btn-inside-stream' onClick={capture}>
                <Camera className='icon' />
              </button>
            </div>
          </div>
        </div>
      )}
      {!openCamera && (
        <div className='btn-wrapper w-100'>
          <button className='open-btn' onClick={switchCamera}>
            <Camera className='icon' />
          </button>
        </div>
      )}
      <div className='image-result-wrapper'>
        {sessionStorage.getItem("capturedImage") && removeImage && (
          <>
            <img src={sessionStorage.getItem("capturedImage")} alt='Captured' />
            <button className='image-remove-btn' onClick={removeCaptureImage}>
              <X />
            </button>
            <button className='upload-btn' onClick={handleUpload}>
              <SendHorizonal />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TakePhoto;
