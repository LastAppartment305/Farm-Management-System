import { UserRoundPlus, X } from "lucide-react";
import "./dashboard-content-assignworker.style.css";
import { useState } from "react";
import InputBox from "../../component/InputBox/InputBox.component";
import { usePost } from "../../custom-hook/axios-post/axios-post";

const AssignWorker = () => {
  const [data, setData] = useState({
    name: "",
    gender: "",
    phone: "",
    address: "",
    age: "",
  });

  const { postData } = usePost("http://localhost:5000/dashboard/assign-worker");
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
  const handleAdd = () => {
    postData(data);
  };
  return (
    <div>
      <div className="navigation-bar ">
        <div className="container-fluid">
          <div className="dropdown-wrapper">
            <div class="dropdown">
              <button
                class="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton2"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Dropdown button
              </button>
              <ul
                class="dropdown-menu dropdown-menu-dark"
                aria-labelledby="dropdownMenuButton2"
              >
                <li>
                  <a class="dropdown-item active" href="#">
                    Action
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    Another action
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    Something else here
                  </a>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    Separated link
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="add-worker-btn-wrapper d-flex align-items-center justify-content-end py-2">
            <a
              type="button"
              className="add-worker-btn d-flex align-items-center"
              onClick={handleClick}
            >
              <UserRoundPlus className="icon" />
              <div className="add-worker-btn-text">Add Worker</div>
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
                    <InputBox
                      typeProps={"text"}
                      name={"gender"}
                      holder={"Enter gender"}
                      InputValue={handleChange}
                    />
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
        </div>
      </div>
    </div>
  );
};
export default AssignWorker;
