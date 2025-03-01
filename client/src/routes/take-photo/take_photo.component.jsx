import { Camera, X, SendHorizonal } from "lucide-react";
import "./take_photo.style.css";
import { useRef, useEffect, useState, useContext } from "react";
import { useUploadPhoto } from "../../custom-hook/upload-image/upload-image";
import { useGet, usePost } from "../../custom-hook/axios-post/axios-post";
import { useNavigate } from "react-router-dom";
import { authContext } from "../../context/context";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import io from "socket.io-client";
import point from "../../assets/icon/location.svg";
import croptype from "../dashboard-content/cultivation-calculator/sample.json";
import {
  MapContainer,
  TileLayer,
  Marker,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const TakePhoto = () => {
  const videoref = useRef(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [workerInformation, setWorkerInformation] = useState();
  const [selectedOption, setSelectedOption] = useState(null);
  const [postList, setPostList] = useState(null);
  const [position, setposition] = useState({
    latitude: null,
    longitude: null,
  });
  const imageDescription = useRef("");
  const [openCamera, setOpenCamera] = useState(false);
  const { postData, loading } = usePost(
    "http://localhost:5000/dashboard/uploadbase64image"
  );
  const { response } = useGet("http://localhost:5000/worker/getAgreedPosts");
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
    const imageUrl = resizedCanvas.toDataURL("image/jpeg", 0.7); // 0.7 indicates 70% quality

    // Store image in session storage
    sessionStorage.setItem("capturedImage", imageUrl);
    setOpenCamera(false);
    setRemoveImage(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setposition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        console.log("Latitude: ", position.coords.latitude);
        console.log("Logitude: ", position.coords.longitude);
      });
    } else {
      console.log("Geolocation not supported");
    }
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
  const handleChange = (e) => {
    const value = e.target.value === "" ? null : e.target.value;
    setSelectedOption(value);
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
    console.log(verifyWorker);
    return async () => {
      await stopVideo();
    };
  }, [openCamera]);
  useEffect(() => {
    if (response) {
      const approvedPosts = response.data.filter(
        (post) => post.ApproveStatus === 1
      );
      setPostList(approvedPosts);
    }
  }, [response]);

  const handleUpload = async () => {
    const socket = io.connect("http://localhost:5000", {
      transports: ["websocket"],
      withCredentials: true,
    });
    const imageUrl = sessionStorage.getItem("capturedImage");
    if (imageUrl) {
      const response = await postData({
        postid: selectedOption,
        url: imageUrl,
        description: imageDescription.current,
      });
      if (response === undefined) {
        sessionStorage.removeItem("capturedImage");
      } else {
        toast.success("အောင်မြင်ပါသည်");
        setRemoveImage((removeImage) => !removeImage);
        sessionStorage.removeItem("capturedImage");
        socket.emit("emittingEvent", "This is text");
      }
    }
  };
  const removeCaptureImage = () => {
    sessionStorage.removeItem("capturedImage");
    setRemoveImage(false);
    setposition({ latitude: null, longitude: null });
  };
  const logout = () => {
    navigate("/worker-login");
  };
  const localDate = new Date();

  // Format date parts to ensure two digits
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, "0");
  const day = String(localDate.getDate()).padStart(2, "0");

  const mySQLDateString = `${year}-${month}-${day}`;

  const countChars = (e) => {
    let counter = document.getElementById("char-count");
    const maxLength = e.target.getAttribute("maxlength");
    const count = maxLength - e.target.value.length;
    if (count >= 0) {
      counter.innerHTML = count;
    }
    imageDescription.current = e.target.value;
  };

  const MapView = () => {
    let map = useMap();
    map.setView([position.latitude, position.longitude], map.getZoom());
    //Sets geographical center and zoom for the view of the map
    return null;
  };
  const customeIcon = L.icon({
    iconUrl: point,
    iconSize: [25, 35],
    iconAnchor: [5, 30],
  });
  return (
    <div className='container-fluid'>
      <Toaster toastOptions={{ duration: 3000 }} />
      <div className='select-box'>
        <select onChange={handleChange}>
          <option value={null}></option>
          {postList &&
            postList.length > 0 &&
            postList.map((i, index) => (
              <option key={index} value={i.PostId}>
                {i.UName} -{" "}
                {croptype.crop.find((crop) => crop.value === i.CropName).name}
              </option>
            ))}
        </select>
      </div>
      <div>
        <div className='date-string'>
          {mySQLDateString} ရက်နေ့အတွက် ရီပို့ တင်ရန်
        </div>
        {position.latitude &&
          position.longitude &&
          sessionStorage.getItem("capturedImage") &&
          removeImage && (
            <div className='location'>
              <div>လယ်ကွက်တည်နေရာ</div>
              <div>{`Latitude: ${position.latitude}`}</div>
              <div>{`Logitude: ${position.longitude}`}</div>
            </div>
          )}
      </div>
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

      {!removeImage && !openCamera && (
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

            <div className='textarea-wrapper'>
              <span id='char-count' className='textarea-char-count'></span>
              <textarea
                name='description'
                id='textbox'
                rows={3}
                cols={50}
                maxLength={240}
                placeholder='မှတ်ချက်နှင့်အကြောင်းအရာ'
                onChange={countChars}
                onFocus={countChars}
              />
              <button className='upload-btn' onClick={handleUpload}>
                {loading ? <div>sending...</div> : <SendHorizonal />}
              </button>
            </div>
          </>
        )}

        <div>
          {sessionStorage.getItem("capturedImage") &&
            removeImage &&
            position.latitude &&
            position.longitude && (
              <iframe
                width='550'
                height='350'
                frameborder='0'
                style={{ border: 0 }}
                referrerpolicy='no-referrer-when-downgrade'
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDSegWYCf5Tzfc73v-s5KDm-OUIfn9UWME &q=${position.latitude},${position.longitude}&zoom=18
  &maptype=satellite`}
                allowfullscreen
              ></iframe>
            )}
        </div>
      </div>
    </div>
  );
};

export default TakePhoto;
