import React, { useEffect, useState } from "react"
import axios from "axios"

const ImageDownloader = ({
  downloadUrl,
  downloadToken,
  bucketName,
  fileName,
}) => {
  const [imageSrc, setImageSrc] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(
          `${downloadUrl}/file/${bucketName}/${fileName}`,
          {
            headers: {
              Authorization: downloadToken,
            },
            responseType: "arraybuffer", // Important for binary data
          }
        )

        const blob = new Blob([response.data], { type: "image/jpeg" }) // Adjust type as necessary
        const imageUrl = URL.createObjectURL(blob)
        setImageSrc(imageUrl)
      } catch (err) {
        console.error("Error fetching image:", err)
        setError(err)
      }
    }

    fetchImage()
  }, [downloadUrl, downloadToken, bucketName, fileName])

  if (error) {
    return <div>Error loading image</div>
  }

  return (
    <div>
      {imageSrc ? (
        <img src={imageSrc} alt="Downloaded from B2" />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default ImageDownloader
