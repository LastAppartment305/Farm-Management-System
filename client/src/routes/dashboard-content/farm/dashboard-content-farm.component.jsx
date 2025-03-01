import { LandPlot, X } from "lucide-react";
import "./dashboard-content-farm.style.css";
import InputBox from "../../../component/InputBox/InputBox.component";
import Accordion from "react-bootstrap/Accordion";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  usePost,
  useGet,
  useDelete,
} from "../../../custom-hook/axios-post/axios-post.jsx";
import { z } from "zod";
import DeleteConfirmBox from "../../../component/delete-confirmbox/delete-confirmbox.component.jsx";

const Farm = () => {
  const farmSchema = z.object({
    field_name: z
      .string()
      .min(1, { message: "ကွင်း/အကွက်အမှတ်နှင့်အမည် ထည့်ရန်လိုအပ်ပါသည်" }),
    crop_type: z
      .string()
      .min(1, { message: "သီးနှံအမျိုးအစား ထည့်ရန်လိုအပ်ပါသည်" }),
    location: z
      .string()
      .min(1, { message: "လယ်ကွက်တည်နေရာ ထည့်ရန်လိုအပ်ပါသည်" }),
    legal_code: z
      .string()
      .min(1, { message: "ဦးပိုင်အမှတ်ထည့်ရန်လိုအပ်ပါသည်" }),
  });
  const [data, setData] = useState({
    field_name: "",
    crop_type: "",
    location: "",
    legal_code: "",
  });
  const [addFarm, setAddFarm] = useState(false);
  const [actionForEditAndDelete, setActionForEditAndDelete] = useState(false);
  const [farmIdToDelete, setFarmIdToDelete] = useState("");
  const [farmlist, setFarmList] = useState([]);
  const [editFarmId, setEditFarmId] = useState("");
  //const [editWorkerId, seteditWorkerId] = useState("");
  const farmValidationErrors = useRef(null);
  const [isEditWorker, setIsEditWorker] = useState(false);

  const { postData } = usePost("http://localhost:5000/farm/addfarm");
  const { response } = useGet("http://localhost:5000/farm/getfarmlist");
  const { deleteData } = useDelete("http://localhost:5000/farm/deletefarm");
  const { postData: editFarm } = usePost("http://localhost:5000/farm/editFarm");

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
      legal_code: "",
    });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  //post edited farm data
  const handleEditFarm = async (e) => {
    e.preventDefault();
    const result = farmSchema.safeParse(data);
    if (result.success) {
      const editResult = await editFarm({ id: editFarmId, data });
      if (editResult) {
        setIsEditWorker(false);
        setAddFarm(!addFarm);
      }
    } else {
      farmValidationErrors.current = result.error.formErrors.fieldErrors;
      toast.error(Object.values(farmValidationErrors.current)[0]);
      console.log(result.error.formErrors.fieldErrors);
    }
  };
  //add new farm
  const handleAddFarm = async (e) => {
    e.preventDefault();
    const result = farmSchema.safeParse(data);
    if (result.success) {
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
          legal_code: "",
        });
      }
    } else {
      farmValidationErrors.current = result.error.formErrors.fieldErrors;
      toast.error(Object.values(farmValidationErrors.current)[0]);
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
    setEditFarmId(e.FarmId);
    // console.log(e.FarmId);
    const {
      Name: name,
      Crop_type: crop_type,
      Location: location,
      Legal_farmcode: farm_code,
    } = e;
    setData({
      field_name: name,
      crop_type: crop_type,
      location: location,
      legal_code: farm_code,
    });
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
    const Farmdata = async () => {
      const takedata = await axios.get(
        "http://localhost:5000/farm/getfarmlist"
      );
      if (takedata) {
        setFarmList(takedata.data);
      }
    };
    Farmdata();
  }, [JSON.stringify(farmlist), isEditWorker]);
  // console.log("Farm component: ", data);
  return (
    <div className='p-5'>
      <Toaster toastOptions={{ duration: 2000 }} />
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
          <form
            className='assign-worker-form position-relative'
            onSubmit={isEditWorker ? handleEditFarm : handleAddFarm}
          >
            <div className='cancel-btn'>
              <X onClick={cancelAdd} />
            </div>
            <div className='position-relative'>
              <input
                type='text'
                name='field_name'
                value={data.field_name}
                placeholder='ကွင်း/အကွက်အမှတ်နှင့်အမည်'
                onChange={handleChange}
              />
              <input
                type='text'
                name='crop_type'
                value={data.crop_type}
                placeholder='သီးနှံ အမျိူးအစား ထည့်ရန်'
                onChange={handleChange}
              />
              <input
                type='text'
                name='location'
                value={data.location}
                placeholder='လယ်ကွက်တည်နေရာ'
                onChange={handleChange}
              />
              <input
                type='text'
                name='legal_code'
                value={data.legal_code}
                placeholder='ဦးပိုင်အမှတ်'
                onChange={handleChange}
              />
            </div>
            {isEditWorker && (
              <div className='d-flex mt-3 justify-content-end'>
                <button className='btn btn-primary' type='submit'>
                  ပြင်ဆင်ရန်
                </button>
              </div>
            )}
            {!isEditWorker && (
              <div className='d-flex mt-3 justify-content-end'>
                <button className='btn btn-primary' type='submit'>
                  စာရင်းသွင်းရန်
                </button>
              </div>
            )}
          </form>
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
                      <td>ကွင်း/အကွက်အမှတ်နှင့်အမည်</td>
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
                    <tr>
                      <td>ဦးပိုင်အမှတ်</td>
                      <td>{res.Legal_farmcode}</td>
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
