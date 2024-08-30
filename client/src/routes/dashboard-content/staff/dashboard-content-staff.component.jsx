import { UserRoundPlus, X } from "lucide-react";
import "./dashboard-content-staff.style.css";
import { useEffect, useState, useRef } from "react";
import Accordion from "react-bootstrap/Accordion";
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
import DeleteConfirmBox from "../../../component/delete-confirmbox/delete-confirmbox.component";
import AccordionItem from "react-bootstrap/esm/AccordionItem";
import { z } from "zod";
import { toast, Toaster } from "react-hot-toast";

const Staff = () => {
  const userSchema = z.object({
    name: z.string().min(1, { message: "နာမည် လိုအပ်ပါသည်" }),
    phone: z
      .string()
      .regex(new RegExp(/^\+?9509\d{9,9}$/), "ဖုန်းနံပါတ် မှန်ကန်စွာဖြည့်ပါ"),
    address: z.string().min(1, { message: "လိပ်စာ လိုအပ်ပါသည်" }),
    age: z
      .string()
      .regex(
        new RegExp(/^(1[89]|[2-6][0-9]|70)$/),
        "အသက် ၁၈နှစ် မှ ၇၀နှစ် အတွင်းဖြစ်ရမည်"
      ),
  });
  const [data, setData] = useState({
    name: "",
    gender: "male",
    phone: "",
    address: "",
    age: "",
  });
  const { response } = useGet("http://localhost:5000/dashboard/getStaffList");
  const { postData } = usePost("http://localhost:5000/dashboard/staff");
  const { postData: editWorker } = usePost(
    "http://localhost:5000/dashboard/staff/editworker"
  );
  const { deleteData } = useDelete("http://localhost:5000/dashboard/staff");
  const [workerList, setworkerList] = useState([]);

  useEffect(() => {
    if (response) {
      setworkerList(response.data);
    }
  }, [response]);
  // console.log("staff component ", workerList);
  return (
    <div>
      <Toaster toastOptions={{ duration: 2000 }} />
      <div className=''>
        <div className='m-5 h-100 staff-component-body'>
          {/* <div className='add-worker-btn-wrapper d-flex align-items-center justify-content-end'>
            <a
              type='button'
              className='add-worker-btn d-flex align-items-center'
              onClick={handleClick}
            >
              <UserRoundPlus className='user-icon' />
            </a>
          </div> */}
          {/* {actionForEditAndDelete && (
            <DeleteConfirmBox
              cancelDelete={cancelDeleteConfirmation}
              handleDelete={handleDeleteWorker}
            />
          )} */}
          {/* {addWorker && (
            <div className='adduser-form-wrapper'>
              <form
                onSubmit={isEditWorker ? postEditData : handleAdd}
                className='assign-worker-form position-relative'
              >
                <div className='cancel-btn'>
                  <X onClick={cancelAdd} />
                </div>
                <div className='position-relative'>
                  <input
                    name='name'
                    type='text'
                    value={data.name}
                    placeholder='အမည်ထည့်ရန်'
                    onChange={handleChange}
                  />

                  <select
                    aria-label='Default select example'
                    value={data.gender}
                    name='gender'
                    className='mb-3 form-select'
                    onChange={handleChange}
                  >
                    <option value='male' selected>
                      ကျား
                    </option>
                    <option value='female'>မ</option>
                  </select>

                  <PhoneInput
                    name='phone'
                    country={"mm"}
                    value={data.phone}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        phone: e,
                      }))
                    }
                  />

                  <input
                    type='text'
                    name='address'
                    value={data.address}
                    placeholder='လိပ်စာထည့်ရန်'
                    onChange={handleChange}
                  />

                  <input
                    type='text'
                    name='age'
                    value={data.age}
                    placeholder='အသက်ထည့်ရန်'
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
          )} */}
          {/* <div className='user-detail-card'>
            <div className='row g-2'>
              <div className='col-lg-4 col-md-6'>
                <DetailCard
                  icon={Users}
                  response={workerList ? workerList.length : "0"}
                  cardTitle={"အလုပ်သမား စုစုပေါင်း"}
                />
              </div>
              <div className='col-lg-4 col-md-6'>
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
              <div className='col-lg-4 col-md-6'>
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
          </div> */}
          <div className='user-detail'>
            <Accordion>
              {workerList?.map((res, index) => (
                <Accordion.Item eventKey={`${index}`}>
                  <Accordion.Header>
                    <div className='d-flex'>
                      <div className='me-5'>{index + 1}</div>
                      <div className=''>{res.Name}</div>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body className='accordion-content'>
                    <div className='fw-bold d-flex w-100 justify-content-between mb-2'>
                      <div>အလုပ်သမား အချက်အလက်</div>
                      {/* <div>
                        <button
                          className='btn btn-danger me-3'
                          onClick={() => handleDelete(res.WorkerId)}
                        >
                          ဖျက်ရန်
                        </button>
                        <button
                          className={`btn btn-primary`}
                          onClick={() => handleEdit(res)}
                        >
                          ပြင်ရန်
                        </button>
                      </div> */}
                    </div>
                    <table className='table table-striped w-100'>
                      <tbody>
                        <tr>
                          <td>အမည်</td>
                          <td>{res.Name}</td>
                        </tr>
                        <tr>
                          <td>ဖုန်းနံပါတ်</td>
                          <td>{res.Phone_no}</td>
                        </tr>
                        <tr>
                          <td>မှတ်ပုံတင်</td>
                          <td>{res.NRC}</td>
                        </tr>
                        <tr>
                          <td>လိပ်စာ</td>
                          <td>{res.Address}</td>
                        </tr>
                        <tr>
                          <td>အသက်</td>
                          <td>{res.Age}</td>
                        </tr>
                      </tbody>
                    </table>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
      <div className='empty-worker'>
        {workerList.length == 0 && <div>အလုပ်သမားမရှိပါ</div>}
      </div>
      {/* <input ref={validationErrors} style={{ display: "none" }} /> */}
    </div>
  );
};
export default Staff;
