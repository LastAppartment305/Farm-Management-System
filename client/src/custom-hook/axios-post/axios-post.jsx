import axios from "axios";
import { useState, useEffect } from "react";

const usePost = (url) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const postData = async (data) => {
    try {
      setLoading(true);
      const res = await axios.post(url, data);
      setResponse(res);
      console.log("response from server", res.data);
    } catch (err) {
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  return { postData, response, loading };
};

const useGet = (url) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(url);
        setResponse(res);
      } catch (err) {
        setResponse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);
  return { response, loading };
};

export { usePost, useGet };
