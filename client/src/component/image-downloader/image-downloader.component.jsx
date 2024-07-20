import classes from "./image-downloader.module.css";

import React, { useEffect, useState } from "react";
import axios from "axios";
const imageCache = {};
const ImageDownloader = ({
  downloadUrl,
  downloadToken,
  bucketName,
  fileName,
  date,
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  // const [imageCache, setImageCache] = useState({});
  const [error, setError] = useState(null);
  let imageElement = document.querySelector("img");
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
        console.log(imageUrl);
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

  return (
    <div className={`${classes.image_wrapper}`}>
      {imageSrc ? (
        <div>
          <div>{date}</div>
          <img src={imageSrc} alt='Downloaded from B2' />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ImageDownloader;
