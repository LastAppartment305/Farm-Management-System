import { UserRoundPlus, X } from "lucide-react";
import "./dashboard-content-staff.style.css";
import { useEffect, useState } from "react";
import InputBox from "../../../component/InputBox/InputBox.component";
import {
  usePost,
  useGet,
  useDelete,
} from "../../../custom-hook/axios-post/axios-post";
import { Users } from "lucide-react";
import axios from "axios";
import DetailCard from "../../../component/Dashboard-Card/detail-card.component";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const Staff = () => {
  const [data, setData] = useState({
    name: "",
    gender: "male",
    phone: "",
    address: "",
    age: "",
  });

  const { postData } = usePost("http://localhost:5000/dashboard/staff");
  const { postData: editWorker } = usePost(
    "http://localhost:5000/dashboard/staff/editworker"
  );
  const { deleteData } = useDelete("http://localhost:5000/dashboard/staff");
  const [actionForEditAndDelete, setActionForEditAndDelete] = useState(false);
  const { response, loading } = useGet("http://localhost:5000/dashboard/staff");
  const [workerList, setworkerList] = useState([]);
  const [addWorker, setAddWorker] = useState(false);
  const [WorkerIdToDelete, setWorkerIdToDelete] = useState("");
  const [editWorkerId, seteditWorkerId] = useState("");
  const [isEditWorker, setIsEditWorker] = useState(false);
  const handleClick = () => {
    setAddWorker(!addWorker);
    setIsEditWorker(false);
    setData({
      name: "",
      gender: "male",
      phone: "",
      address: "",
      age: "",
    });
  };
  const cancelAdd = () => {
    setAddWorker(!addWorker);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log("staff component ",data)
  };
  //Delete worker at onClick Delete
  const handleDelete = (e) => {
    setActionForEditAndDelete(true);
    setWorkerIdToDelete(e);
  };
  //add new user to database
  const handleAdd = async () => {
    const x = await postData(data);
    if (x) {
      //console.log("adding worked: staff component")
      const resAfterInsert = await axios.get(
        "http://localhost:5000/dashboard/staff"
      );
      if (resAfterInsert) {
        setworkerList(resAfterInsert.data.worker);
      }
      setData({
        name: "",
        gender: "male",
        phone: "",
        address: "",
        age: "",
      });
    }
  };
  const handleEdit = (e) => {
    setAddWorker(!addWorker);
    setIsEditWorker(true);
    seteditWorkerId(e.WorkerId);
    const {
      Name: name,
      Gender: gender,
      Phone_no: phone,
      Address: address,
      Age: age,
    } = e;
    setData({
      name: name,
      gender: gender,
      phone: phone,
      address: address,
      age: age,
    });
    //console.log("staff component: ", data);
  };
  //confirm to delete
  const cancelDeleteConfirmation = () => {
    setActionForEditAndDelete(false);
  };
  const handleDeleteWorker = async () => {
    //console.log("staff component ",WorkerIdToDelete)
    const x = await deleteData({ id: WorkerIdToDelete });
    if (x) {
      setActionForEditAndDelete(false);
      const resAfterDelete = await axios.get(
        "http://localhost:5000/dashboard/staff"
      );
      if (resAfterDelete) {
        setworkerList(resAfterDelete.data.worker);
      }
    }
  };
  const postEditData = async () => {
    //console.log({ editWorkerId, data });
    const result = await editWorker({ id: editWorkerId, data });
  };
  useEffect(() => {
    if (response) {
      setworkerList(response.data.worker);
    }
  }, [response]);
  //console.log("assign worker component: ", workerList);
  return (
    <div>
      <div className="navigation-bar ">
        <div className="m-5 h-100">
          <div className="add-worker-btn-wrapper d-flex align-items-center justify-content-end">
            <a
              type="button"
              className="add-worker-btn d-flex align-items-center"
              onClick={handleClick}
            >
              <UserRoundPlus className="icon" />
              <div className="add-worker-btn-text">အသစ်ထည့်မည်</div>
            </a>
          </div>
          {actionForEditAndDelete && (
            <div className="delete-confirmation-wrapper">
              <div className="delete-confirmation-layout">
                <button
                  type="button"
                  class="btn btn-light w-100 me-3"
                  onClick={cancelDeleteConfirmation}
                >
                  မဖျက်တော့ပါ
                </button>
                <button
                  type="button"
                  class="btn btn-danger w-100"
                  onClick={handleDeleteWorker}
                >
                  ဖျက်မည်
                </button>
              </div>
            </div>
          )}
          {addWorker && (
            <div className="adduser-form-wrapper">
              <div className="assign-worker-form position-relative">
                <div className="cancel-btn">
                  <X onClick={cancelAdd} />
                </div>
                <div className="position-relative">
                  <div className="mt-3 w-100">
                    <InputBox
                      typeProps={"text"}
                      name={"name"}
                      value={data.name}
                      holder={"Enter name"}
                      InputValue={handleChange}
                    />
                  </div>
                  <div className="mt-3 w-100">
                    <select
                      class="form-select"
                      aria-label="Default select example"
                      value={data.gender}
                      name="gender"
                      onChange={handleChange}
                    >
                      <option value="male" selected>
                        ကျား
                      </option>
                      <option value="female">မ</option>
                    </select>
                  </div>
                  {/* <div className="mt-3 w-100">
                    <InputBox
                      typeProps={"text"}
                      name={"phone"}
                      value={data.phone}
                      holder={"Phone-no"}
                      InputValue={handleChange}
                    />
                  </div> */}

                  <div className="mt-3 w-100">
                    <PhoneInput
                      country={"mm"}
                      value={data.phone}
                      onChange={(e)=>setData((prev)=>({
                        ...prev,
                        phone:e,
                      }))}
                    />
                  </div>

                  <div className="mt-3 w-100">
                    <InputBox
                      typeProps={"text"}
                      name={"address"}
                      value={data.address}
                      holder={"Enter address"}
                      InputValue={handleChange}
                    />
                  </div>
                  <div className="mt-3 w-100">
                    <InputBox
                      typeProps={"text"}
                      name={"age"}
                      value={data.age}
                      holder={"Enter age"}
                      InputValue={handleChange}
                    />
                  </div>
                </div>
                {isEditWorker && (
                  <div className="d-flex mt-3 justify-content-end">
                    <button className="btn btn-primary" onClick={postEditData}>
                      ပြင်ဆင်ရန်
                    </button>
                  </div>
                )}
                {!isEditWorker && (
                  <div className="d-flex mt-3 justify-content-end">
                    <button className="btn btn-primary" onClick={handleAdd}>
                      စာရင်းသွင်းရန်
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="user-detail-card">
            <div className="row g-2">
              <div className="col-lg-4 col-md-6">
                <DetailCard
                  icon={Users}
                  response={workerList ? workerList.length : "0"}
                  cardTitle={"အလုပ်သမား စုစုပေါင်း"}
                />
              </div>
              <div className="col-lg-4 col-md-6">
                <DetailCard
                  icon={Users}
                  response={
                    workerList
                      ? workerList.filter((p) => p.Gender === "male").length
                      : "0"
                  }
                  cardTitle={"ကျား"}
                />
              </div>
              <div className="col-lg-4 col-md-6">
                <DetailCard
                  icon={Users}
                  response={
                    workerList
                      ? workerList.filter((p) => p.Gender === "female").length
                      : "0"
                  }
                  cardTitle={"မ"}
                />
              </div>
            </div>
          </div>
          <div className="user-detail-table">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">စဉ်</th>
                  <th scope="col">နာမည်</th>
                  <th scope="col">ဖုန်းနံပါတ်</th>
                  <th scope="col">ကျား/မ</th>
                  <th scope="col">အသက်</th>
                </tr>
              </thead>
              <tbody>
                {workerList?.map((res, index) => (
                  <tr key={index} className="w-100">
                    <th scope="row">{index + 1}</th>
                    <td className="row">{res.Name}</td>
                    <td>{res.Phone_no}</td>
                    <td>{res.Gender === "male" ? "ကျား" : "မ"}</td>
                    <td>{res.Age}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(res.WorkerId)}
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
      </div>
    </div>
  );
};
export default Staff;
