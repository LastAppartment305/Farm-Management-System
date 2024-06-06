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

  //console.log(response);

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

const useDelete = (url) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const deleteData = async (data) => {
    try {
      //console.log("axios-post component: deleteData: ", data);
      setLoading(true);
      console.log(data);
      const res = await axios.delete(url, {
        data: {
          id: data.id,
        },
      });
      setResponse(res);

      return res.data;
    } catch (err) {
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  //console.log(response);

  return { deleteData, response, loading };
};

export { usePost, useGet, useLogout, useDelete };
