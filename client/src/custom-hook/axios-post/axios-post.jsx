import axios from "axios";
import { useState, useEffect } from "react";
axios.defaults.withCredentials = true;

const usePost = (url) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const postData = async (data) => {
    try {
      setLoading(true);
      const res = await axios.post(url, data);
      setResponse(res);

      return res.data;
    } catch (err) {
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  console.log(response);

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

const useLogout = (url) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

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

  return { response, loading, fetchData };
};

export { usePost, useGet, useLogout };
