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

const Staff = () => {
  const [data, setData] = useState({
    name: "",
    gender: "male",
    phone: "",
    address: "",
    age: "",
  });

  const { postData } = usePost("http://localhost:5000/dashboard/staff");
  const { deleteData } = useDelete("http://localhost:5000/dashboard/staff");
  const { response, loading } = useGet("http://localhost:5000/dashboard/staff");
  const [workerList, setworkerList] = useState([]);
  const [addWorker, setAddWorker] = useState(false);
  const handleClick = () => {
    setAddWorker(!addWorker);
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
  };
  //Delete worker at onClick Delete
  const handleDelete = async (e) => {
    const x = await deleteData({ id: e });
    if (x) {
      const resAfterDelete = await axios.get(
        "http://localhost:5000/dashboard/staff"
      );
      if (resAfterDelete) {
        setworkerList(resAfterDelete.data.worker);
      }
    }
  };
  const handleAdd = () => {
    postData(data);
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
                      holder={"Enter name"}
                      InputValue={handleChange}
                    />
                  </div>
                  <div className="mt-3 w-100">
                    <select
                      class="form-select"
                      aria-label="Default select example"
                      name="gender"
                      onChange={handleChange}
                    >
                      <option value="male" selected>
                        ကျား
                      </option>
                      <option value="female">မ</option>
                    </select>
                  </div>
                  <div className="mt-3 w-100">
                    <InputBox
                      typeProps={"text"}
                      name={"phone"}
                      holder={"Phone-no"}
                      InputValue={handleChange}
                    />
                  </div>
                  <div className="mt-3 w-100">
                    <InputBox
                      typeProps={"text"}
                      name={"address"}
                      holder={"Enter address"}
                      InputValue={handleChange}
                    />
                  </div>
                  <div className="mt-3 w-100">
                    <InputBox
                      typeProps={"text"}
                      name={"age"}
                      holder={"Enter age"}
                      InputValue={handleChange}
                    />
                  </div>
                </div>
                <div className="d-flex mt-3 justify-content-end">
                  <button className="btn btn-primary" onClick={handleAdd}>
                    Add
                  </button>
                </div>
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
                        ဖျက်မည်
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
