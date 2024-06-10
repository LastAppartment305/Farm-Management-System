import axios from "axios";
import { useState, useEffect } from "react";

const useUploadPhoto = (url) => {
  const upload = async (data) => {
    const res = await axios(url, data);
    return res.data;
  };
  return { upload };
};

export { useUploadPhoto };
