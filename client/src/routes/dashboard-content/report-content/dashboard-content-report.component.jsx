import classes from "./dashboard-content-report.module.css";
import { useGet } from "../../../custom-hook/axios-post/axios-post";
import Form from "react-bootstrap/Form";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ImageDownloader from "../../../component/image-downloader/image-downloader.component.jsx";

const ReportContent = () => {
  const [farmList, setFarmList] = useState([]);
  const [fetchedData, setFetchedData] = useState({
    imageList: [],
    apiInfo: null,
  });
  const [fetchUseGetAgain, setFetchUseGetAgain] = useState(false);
  const [getImageOfSelectedFarm, setGetImageOfSelectedFarm] = useState(false);

  const { response } = useGet("http://localhost:5000/farm/getfarmlist");

  //--------------------------------------------
  const getImageListAtFirstVisit = async () => {
    var selectElement = document.querySelector("#selected");
    if (selectElement && selectElement.options.length > 0) {
      // console.log("work");
    }
    var selectedOption =
      selectElement.options[selectElement.selectedIndex].getAttribute("farmid");
    // console.log(selectedOption);
    //----------------------------get image list ------------------------------
    const imageList = await axios.post(
      "http://localhost:5000/report/getreportlist",
      { farmid: selectedOption }
    );
    //---------------------------get token from server -------------------------
    const getDownloadAuth = await axios.get(
      "http://localhost:5000/report/getDownloadAuth"
    );
    const reverse = imageList.data.reverse();
    setFetchedData({
      imageList: reverse,
      apiInfo: getDownloadAuth.data,
    });
  };
  //----------------------------------------------------------------------
  useEffect(() => {
    if (response && response.data) {
      setFarmList(response.data);
      setGetImageOfSelectedFarm(true);
    }
  }, [response]);

  useEffect(() => {
    getImageOfSelectedFarm && getImageListAtFirstVisit();
  }, [getImageOfSelectedFarm]);
  const fetchPhoto = async () => {
    getImageListAtFirstVisit();
    // var selectElement = document.querySelector("#selected");
    // var selectedOption =
    //   selectElement.options[selectElement.selectedIndex].getAttribute("farmid");
    // console.log(selectedOption);
    // //---------------------get Image List -----------------------
    // const imageList = await axios.post(
    //   "http://localhost:5000/report/getreportlist",
    //   { farmid: selectedOption }
    // );
    // console.log(imageList);
    // // setImageList(imageList.data);
    // //--------------------get download url and token --------------------
    // const getDownloadAuth = await axios.get(
    //   "http://localhost:5000/report/getDownloadAuth"
    // );
    // console.log(getDownloadAuth);
    // setApiInfo(getDownloadAuth.data);
  };
  console.log(fetchedData.imageList);
  // useEffect(() => {
  // const getImageListAtFirstVisit = async () => {
  //   var selectElement = document.querySelector("#selected");
  //   var selectedOption =
  //     selectElement.options[selectElement.selectedIndex].getAttribute(
  //       "farmid"
  //     );
  //   console.log(selectedOption);
  //   //----------------------------get image list ------------------------------
  //   const imageList = await axios.post(
  //     "http://localhost:5000/report/getreportlist",
  //     { farmid: selectedOption }
  //   );
  //   console.log(imageList);
  //   // setImageList(imageList.data);
  //   //---------------------------get token from server -------------------------
  //   const getDownloadAuth = await axios.get(
  //     "http://localhost:5000/report/getDownloadAuth"
  //   );
  //   console.log(getDownloadAuth);
  //   // setApiInfo(getDownloadAuth.data);
  //   getImageOfSelectedFarm.current = false;
  //   console.log(getImageListAtFirstVisit.current);
  // };
  // if (response) {
  //   setFarmList(response.data);
  //   setFetchUseGetAgain((prev) => !prev);
  //   console.log(response);
  // getImageListAtFirstVisit();
  // getImageOfSelectedFarm.current = true;
  // }
  // getImageOfSelectedFarm.current && getImageListAtFirstVisit();
  // console.log(getImageOfSelectedFarm);
  // }, []);
  // console.log(farmList);

  return (
    <div>
      <div className={`${classes.select_box}`}>
        <Form.Select
          id='selected'
          aria-label={`Default select`}
          className={`${classes.select_farm}`}
          onChange={fetchPhoto}
        >
          {farmList?.map((res, index) => (
            <option value={index + 1} key={index} farmid={res.FarmId}>
              {res.Name}
            </option>
          ))}
        </Form.Select>
      </div>
      <div className={`${classes.image_group}`}>
        {fetchedData &&
          fetchedData.imageList
            ?.reverse()
            .map((i, index) => (
              <ImageDownloader
                downloadUrl={fetchedData.apiInfo.downloadUrl}
                downloadToken={
                  fetchedData.apiInfo.downloadToken.authorizationToken
                }
                bucketName={"FarmManagement"}
                fileName={i}
              />
            ))}
      </div>
    </div>
  );
};
export default ReportContent;
