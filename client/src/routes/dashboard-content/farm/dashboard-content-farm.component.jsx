import { LandPlot, X } from "lucide-react";
import "./dashboard-content-farm.style.css";
import InputBox from "../../../component/InputBox/InputBox.component";
import Accordion from "react-bootstrap/Accordion";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  usePost,
  useGet,
  useDelete,
} from "../../../custom-hook/axios-post/axios-post.jsx";
import { act } from "react";
import DeleteConfirmBox from "../../../component/delete-confirmbox/delete-confirmbox.component.jsx";

const Farm = () => {
  const [data, setData] = useState({
    crop_type: "",
    location: "",
    field_name: "",
  });
  const [addFarm, setAddFarm] = useState(false);
  const [actionForEditAndDelete, setActionForEditAndDelete] = useState(false);
  const [farmIdToDelete, setFarmIdToDelete] = useState("");
  const [farmlist, setFarmList] = useState([]);
  //const [editWorkerId, seteditWorkerId] = useState("");
  const [isEditWorker, setIsEditWorker] = useState(false);

  const { postData } = usePost("http://localhost:5000/farm/addfarm");
  const { response } = useGet("http://localhost:5000/farm/getfarmlist");
  const { deleteData } = useDelete("http://localhost:5000/farm/deletefarm");

  const cancelAdd = () => {
    setAddFarm(!addFarm);
  };
  const handleClick = () => {
    setAddFarm(!addFarm);
    setIsEditWorker(false);
    setData({
      crop_type: "",
      location: "",
      field_name: "",
    });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  //add new farm
  const handleAddFarm = async () => {
    console.log(data);
    const res = await postData(data);
    if (res) {
      const resAfterInsert = await axios.get(
        "http://localhost:5000/farm/getfarmlist"
      );
      if (resAfterInsert) {
        setFarmList(resAfterInsert.data);
      }
      setData({
        crop_type: "",
        location: "",
        field_name: "",
      });
    }
  };
  const handleDelete = (id) => {
    setActionForEditAndDelete(true);
    setFarmIdToDelete(id);
    console.log("edit worked: dashboard farm");
  };
  const handleEdit = (e) => {
    setIsEditWorker(true);
    setAddFarm(!addFarm);
    const { Name: name, Crop_type: crop_type, Location: location } = e;
    setData({ field_name: name, crop_type: crop_type, location: location });
    console.log("edit worked: dashboard farm");
  };
  const cancelDeleteConfirmation = () => {
    setActionForEditAndDelete(false);
  };
  const handleDeleteFarm = async () => {
    const x = await deleteData({ id: farmIdToDelete });
    if (x) {
      setActionForEditAndDelete(false);
      const resAfterDelete = await axios.get(
        "http://localhost:5000/farm/getfarmlist"
      );
      if (resAfterDelete) {
        setFarmList(resAfterDelete.data);
      }
    }
  };
  useEffect(() => {
    if (response) {
      setFarmList(response.data);
      //console.log("dashboard farm component: ", farmlist);
    }
  }, [response]);
  return (
    <div className='p-5'>
      <div className='add-worker-btn-wrapper d-flex align-items-center justify-content-end'>
        <a
          type='button'
          className='add-worker-btn d-flex align-items-center'
          onClick={handleClick}
        >
          <LandPlot className='farm-icon' />
          {/* <div className='add-worker-btn-text'>အသစ်ထည့်မည်</div> */}
        </a>
      </div>

      {actionForEditAndDelete && (
        <DeleteConfirmBox
          cancelDelete={cancelDeleteConfirmation}
          handleDelete={handleDeleteFarm}
        />
      )}
      {addFarm && (
        <div className='adduser-form-wrapper'>
          <div className='assign-worker-form position-relative'>
            <div className='cancel-btn'>
              <X onClick={cancelAdd} />
            </div>
            <div className='position-relative'>
              <div className='mt-3 w-100'>
                <InputBox
                  typeProps={"text"}
                  name={"field_name"}
                  value={data.field_name}
                  holder={"လယ်ကွက် အမည်"}
                  InputValue={handleChange}
                />
              </div>
              <div className='mt-3 w-100'>
                <InputBox
                  typeProps={"text"}
                  name={"crop_type"}
                  value={data.crop_type}
                  holder={"သီးနှံ အမျိူးအစား ထည့်ရန်"}
                  InputValue={handleChange}
                />
              </div>
              <div className='mt-3 w-100'>
                <InputBox
                  typeProps={"text"}
                  name={"location"}
                  value={data.location}
                  holder={"လယ်ကွက်တည်နေရာ"}
                  InputValue={handleChange}
                />
              </div>
            </div>
            {isEditWorker && (
              <div className='d-flex mt-3 justify-content-end'>
                <button className='btn btn-primary'>ပြင်ဆင်ရန်</button>
              </div>
            )}
            {!isEditWorker && (
              <div className='d-flex mt-3 justify-content-end'>
                <button className='btn btn-primary' onClick={handleAddFarm}>
                  စာရင်းသွင်းရန်
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <div className=''>
        <Accordion>
          {farmlist?.map((res, index) => (
            <Accordion.Item eventKey={`${index}`} key={index}>
              <Accordion.Header>
                <div className='d-flex'>
                  <div className='me-5'>{index + 1}</div>
                  <div className=''>{res.Name}</div>
                </div>
              </Accordion.Header>
              <Accordion.Body className='accordion-content'>
                <div className='fw-bold d-flex w-100 justify-content-between mb-2'>
                  <div>လယ်ကွက် အချက်အလက်</div>
                  <div>
                    <button
                      className='btn btn-danger me-3'
                      onClick={() => handleDelete(res.FarmId)}
                    >
                      ဖျက်ရန်
                    </button>
                    <button
                      className={`btn btn-primary`}
                      onClick={() => handleEdit(res)}
                    >
                      ပြင်ရန်
                    </button>
                  </div>
                </div>
                <table className='table table-striped w-100'>
                  <tbody>
                    <tr>
                      <td>လယ်ကွက် အမည်</td>
                      <td>{res.Name}</td>
                    </tr>
                    <tr>
                      <td>သီးနှံအမျိုးအစား</td>
                      <td>{res.Crop_type}</td>
                    </tr>
                    <tr>
                      <td>လယ်ကွက် တည်နေရာ</td>
                      <td>{res.Location}</td>
                    </tr>
                  </tbody>
                </table>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
      <div className='empty-farm'>
        {farmlist.length == 0 && <div>လယ်ကွက်များမရှိပါ</div>}
      </div>
    </div>
  );
};
export default Farm;
