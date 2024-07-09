import classes from "./dashboard-content-report.module.css";
import { useGet } from "../../../custom-hook/axios-post/axios-post";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import axios from "axios";

const ReportContent = () => {
  const [farmList, setFarmList] = useState([]);
  const { response } = useGet("http://localhost:5000/farm/getfarmlist");

  const fetchPhoto = async (e) => {
    console.log(
      e.target.options[e.target.selectedIndex].getAttribute("farmid")
    );
    var id = e.target.options[e.target.selectedIndex].getAttribute("farmid");
    const imageList = await axios.post(
      "http://localhost:5000/report/getreportlist",
      { farmid: id }
    );
  };
  useEffect(() => {
    if (response) {
      setFarmList(response.data);
    }
  });
  console.log(farmList);
  return (
    <div>
      <div className={`${classes.select_box}`}>
        <Form.Select
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
      <div className={`${classes.report_list}`}></div>
    </div>
  );
};
export default ReportContent;
