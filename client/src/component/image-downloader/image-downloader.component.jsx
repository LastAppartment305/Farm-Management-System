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
}) => {
  const [imageSrc, setImageSrc] = useState(null);
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
        // const processImage = (data) => {
        //   // Example: Convert ArrayBuffer to Base64
        //   const buffer = Buffer.from(data, "binary").toString("base64");
        //   return `data:image/jpeg;base64,${buffer}`;
        // };
        // console.log("fetch image from downloader");
        const response = await axios.post(
          "http://localhost:5000/report/fetchb2",
          { downloadUrl, bucketName, fileName, downloadToken },
          { responseType: "arraybuffer" }
        );

        const blob = new Blob([response.data], {
          type: "image/jpeg",
        }); // Adjust type as necessary

        // const imageUrl = new FileReader().readAsDataURL(blob);
        const imageUrl = URL.createObjectURL(blob);
        // imageElement.src=imageUrl;
        // console.log(imageUrl);
        // const processedImage = processImage(response.data);
        // Store the image URL in cache
        imageCache[fileName] = imageUrl;

        // setImageCache((prevCache) => ({
        //   ...prevCache,
        //   [fileName]: processedImage,
        // }));
        // console.log(imageUrl);
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
    console.log(imageId);
    const result = await axios.post(
      "http://localhost:5000/dashboard/confirmReportImages",
      {
        imageId: imageId,
        confirmStatus: true,
      }
    );
  };
  const confirmIncorrect = async (imageId) => {
    console.log(imageId);
    const result = await axios.post(
      "http://localhost:5000/dashboard/confirmReportImages",
      {
        imageId: imageId,
        confirmStatus: false,
      }
    );
  };

  return (
    <div className={`${classes.image_wrapper}`}>
      {imageSrc ? (
        <div
          className={`${classes.individual_image_wrapper} position-relative`}
        >
          {confirmStatus ? (
            <div className={`${classes.mark} position-absolute`}>
              <img src={success} />
            </div>
          ) : (
            <div className={`${classes.mark} position-absolute`}>
              <img src={redCross} />
            </div>
          )}
          <div>{localDate}</div>
          <img src={imageSrc} alt='Downloaded from B2' />
          <div className='mt-3'>အကြောင်းအရာ- {description}</div>
          {confirmStatus === null && (
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
