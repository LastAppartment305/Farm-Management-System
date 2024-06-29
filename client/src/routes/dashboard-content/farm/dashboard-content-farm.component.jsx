import { UserRoundPlus, X } from "lucide-react";
import "./dashboard-content-farm.style.css";
import InputBox from "../../../component/InputBox/InputBox.component";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  usePost,
  useGet,
  useDelete
} from "../../../custom-hook/axios-post/axios-post.jsx";
import { act } from "react";

const Farm = () => {
  const [data, setData] = useState({
    crop_type: "",
    location: "",
    field_name: "",
  });
  const [addFarm, setAddFarm] = useState(false);
  const [actionForEditAndDelete,setActionForEditAndDelete]=useState(false);
  const [farmIdToDelete,setFarmIdToDelete]=useState("");
  const [farmlist, setFarmList] = useState([]);
  //const [editWorkerId, seteditWorkerId] = useState("");
  const [isEditWorker, setIsEditWorker] = useState(false);

  const { postData } = usePost("http://localhost:5000/farm/addfarm");
  const { response } = useGet("http://localhost:5000/farm/getfarmlist");
  const {deleteData}=useDelete('http://localhost:5000/farm/deletefarm')

  const cancelAdd = () => {
    setAddFarm(!addFarm);
  };
  const handleClick = () => {
    setAddFarm(!addFarm);
    setIsEditWorker(false);
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
    console.log("edit worked: dashboard farm")
  };
  const handleEdit = () => {
    setActionForEditAndDelete(true);
    console.log("edit worked: dashboard farm")
  };
  const cancelDeleteConfirmation=()=>{
    setActionForEditAndDelete(false)
  }
  const handleDeleteFarm=async()=>{
    const x=await deleteData({id:farmIdToDelete});
    if(x){
      setActionForEditAndDelete(false)
      const resAfterDelete = await axios.get(
        "http://localhost:5000/farm/getfarmlist"
      );
      if (resAfterDelete) {
        setFarmList(resAfterDelete.data);
      }
    }
  }
  useEffect(() => {
    if (response) {
      setFarmList(response.data);
      //console.log("dashboard farm component: ", farmlist);
    }
  }, [response]);
  return (
    <div className="p-5">
      <div className="add-worker-btn-wrapper d-flex align-items-center justify-content-end py-2">
        <a
          type="button"
          className="add-worker-btn d-flex align-items-center"
          onClick={handleClick}
        >
          <UserRoundPlus className="icon" />
          <div className="add-worker-btn-text">အသစ်ထည့်မည်</div>
        </a>
      </div>
      
      {actionForEditAndDelete&&(
        <div className="delete-confirmation-wrapper">
          <div className="delete-confirmation-layout">
          <button type="button" class="btn btn-light w-100 me-3" onClick={cancelDeleteConfirmation}>မဖျက်တော့ပါ</button>
          <button type="button" class="btn btn-danger w-100" onClick={handleDeleteFarm}>ဖျက်မည်</button>
          </div>
        </div>
      )}
      {addFarm && (
        <div className="adduser-form-wrapper">
          <div className="assign-worker-form position-relative">
            <div className="cancel-btn">
              <X onClick={cancelAdd} />
            </div>
            <div className="position-relative">
              <div className="mt-3 w-100">
                <InputBox
                  typeProps={"text"}
                  name={"field_name"}
                  value={data.field_name}
                  holder={"လယ်ကွက် အမည်"}
                  InputValue={handleChange}
                />
              </div>
              <div className="mt-3 w-100">
                <InputBox
                  typeProps={"text"}
                  name={"crop_type"}
                  value={data.crop_type}
                  holder={"သီးနှံ အမျိူးအစား ထည့်ရန်"}
                  InputValue={handleChange}
                />
              </div>
              <div className="mt-3 w-100">
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
              <div className="d-flex mt-3 justify-content-end">
                <button className="btn btn-primary">ပြင်ဆင်ရန်</button>
              </div>
            )}
            {!isEditWorker && (
              <div className="d-flex mt-3 justify-content-end">
                <button className="btn btn-primary" onClick={handleAddFarm}>
                  စာရင်းသွင်းရန်
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="user-detail-table">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">စဉ်</th>
              <th scope="col">လယ်အမည်</th>
              <th scope="col">သီးနှံအမျိုးအစား</th>
            </tr>
          </thead>
          <tbody>
            {farmlist?.map((res, index) => (
              <tr key={index} className="w-100">
                <th scope="row">{index + 1}</th>
                <td>{res.Name}</td>
                <td>{res.Crop_type}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(res.FarmId)}
                  >
                    ဖျက်ရန်
                  </button>
                  <button
                    className="btn btn-primary ms-2"
                    onClick={() => handleEdit(res)}
                  >
                    ပြင်ရန်
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Farm;
