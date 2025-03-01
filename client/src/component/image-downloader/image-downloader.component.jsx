import classes from "./image-downloader.module.css";
import success from "../../assets/icon/success.png";
import redCross from "../../assets/icon/red-cross.png";
import React, { useEffect, useState } from "react";
import axios from "axios";
const imageCache = {};
const ImageDownloader = ({
  imageId,
  downloadUrl,
  downloadToken,
  bucketName,
  fileName,
  date,
  description,
  confirmStatus,
  loadingState,
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [confirmReport, setConfirmReport] = useState(confirmStatus);
  // const [imageCache, setImageCache] = useState({});
  const [error, setError] = useState(null);
  let imageElement = document.querySelector("img");
  const utcDate = new Date(date);
  const localDate = utcDate.toLocaleString();
  useEffect(() => {
    const cachedImage = imageCache[fileName];
    if (cachedImage) {
      // Use cached image if available
      setImageSrc(cachedImage);
      return;
    }

    const fetchImage = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/report/fetchb2",
          { downloadUrl, bucketName, fileName, downloadToken },
          { responseType: "arraybuffer" }
        );

        const blob = new Blob([response.data], {
          type: "image/jpeg",
        });
        const imageUrl = URL.createObjectURL(blob);
        imageCache[fileName] = imageUrl;
        setImageSrc(imageUrl);
      } catch (err) {
        console.error("Error fetching image:", err);
        setError(err);
      }
    };

    fetchImage();
  }, [downloadUrl, downloadToken, bucketName, fileName]);

  if (error) {
    return <div>Error loading image</div>;
  }

  const confirmCorrect = async (imageId) => {
    try {
      loadingState(true);
      const result = await axios.post(
        "http://localhost:5000/dashboard/confirmReportImages",
        {
          imageId: imageId,
          confirmStatus: true,
        }
      );
      result && setConfirmReport(true);
    } finally {
      loadingState(false);
    }
  };
  const confirmIncorrect = async (imageId) => {
    const result = await axios.post(
      "http://localhost:5000/dashboard/confirmReportImages",
      {
        imageId: imageId,
        confirmStatus: false,
      }
    );
  };
  console.log(confirmReport);
  return (
    <div className={`${classes.image_wrapper}`}>
      {imageSrc ? (
        <div
          className={`${classes.individual_image_wrapper} position-relative`}
        >
          {confirmReport === null ? null : (
            <div className={`${classes.mark} position-absolute`}>
              <img src={confirmReport ? success : redCross} />
            </div>
          )}
          <div>{localDate}</div>
          <img src={imageSrc} alt='Downloaded from B2' />
          <div className='mt-3'>အကြောင်းအရာ- {description}</div>
          {confirmReport === null && (
            <div className={`${classes.confirm_buttons}`}>
              <button
                className={`${classes.correct_btn} btn btn-primary`}
                onClick={() => confirmCorrect(imageId)}
              >
                မှန်ကန်ပါသည်
              </button>
              <button
                className={`${classes.incorrect_btn} btn btn-danger`}
                onClick={() => confirmIncorrect(imageId)}
              >
                မမှန်ကန်ပါ
              </button>
            </div>
          )}
          <hr></hr>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ImageDownloader;
