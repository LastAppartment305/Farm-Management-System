// import { UserRoundPlus, X } from "lucide-react";
// import "./dashboard-content-staff.style.css";
// import { useEffect, useState } from "react";
// import Accordion from "react-bootstrap/Accordion";
// import InputBox from "../../../component/InputBox/InputBox.component";
// import {
//   usePost,
//   useGet,
//   useDelete,
// } from "../../../custom-hook/axios-post/axios-post";
// import { Users } from "lucide-react";
// import axios from "axios";
// import DetailCard from "../../../component/Dashboard-Card/detail-card.component";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import DeleteConfirmBox from "../../../component/delete-confirmbox/delete-confirmbox.component";
// import AccordionItem from "react-bootstrap/esm/AccordionItem";

// const Staff = () => {
//   const [data, setData] = useState({
//     name: "",
//     gender: "male",
//     phone: "",
//     address: "",
//     age: "",
//   });

//   const { postData } = usePost("http://localhost:5000/dashboard/staff");
//   const { postData: editWorker } = usePost(
//     "http://localhost:5000/dashboard/staff/editworker"
//   );
//   const { deleteData } = useDelete("http://localhost:5000/dashboard/staff");
//   const [actionForEditAndDelete, setActionForEditAndDelete] = useState(false);
//   const [workerList, setworkerList] = useState([]);
//   const [addWorker, setAddWorker] = useState(false);
//   const [WorkerIdToDelete, setWorkerIdToDelete] = useState("");
//   const [editWorkerId, seteditWorkerId] = useState("");
//   const [isEditWorker, setIsEditWorker] = useState(false);
//   const handleClick = () => {
//     setAddWorker(!addWorker);
//     setIsEditWorker(false);
//     setData({
//       name: "",
//       gender: "male",
//       phone: "",
//       address: "",
//       age: "",
//     });
//   };
//   const cancelAdd = () => {
//     setAddWorker(!addWorker);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     // console.log("staff component ", data);
//   };
//   //Delete worker at onClick Delete
//   const handleDelete = (e) => {
//     setActionForEditAndDelete(true);
//     setWorkerIdToDelete(e);
//   };
//   //add new user to database
//   const handleAdd = async () => {
//     const x = await postData(data);
//     if (x) {
//       const resAfterInsert = await axios.get(
//         "http://localhost:5000/dashboard/staff"
//       );
//       if (resAfterInsert) {
//         setworkerList(resAfterInsert.data.worker);
//       }
//       setData({
//         name: "",
//         gender: "male",
//         phone: "",
//         address: "",
//         age: "",
//       });
//     }
//   };
//   const handleEdit = (e) => {
//     setAddWorker(!addWorker);
//     setIsEditWorker(true);
//     seteditWorkerId(e.WorkerId);
//     const {
//       Name: name,
//       Gender: gender,
//       Phone_no: phone,
//       Address: address,
//       Age: age,
//     } = e;
//     setData({
//       name: name,
//       gender: gender,
//       phone: phone,
//       address: address,
//       age: age,
//     });
//   };
//   //confirm to delete
//   const cancelDeleteConfirmation = () => {
//     setActionForEditAndDelete(false);
//   };

//   const handleDeleteWorker = async () => {
//     //console.log("staff component ",WorkerIdToDelete)
//     const x = await deleteData({ id: WorkerIdToDelete });
//     if (x) {
//       setActionForEditAndDelete(false);
//       const resAfterDelete = await axios.get(
//         "http://localhost:5000/dashboard/staff"
//       );
//       if (resAfterDelete) {
//         setworkerList(resAfterDelete.data.worker);
//       }
//     }
//   };
//   const postEditData = async () => {
//     const result = await editWorker({ id: editWorkerId, data });
//     if (result) {
//       setAddWorker(!addWorker);
//       setIsEditWorker(false);
//     }
//   };
//   useEffect(() => {
//     const workerdata = async () => {
//       const takedata = await axios.get("http://localhost:5000/dashboard/staff");
//       if (takedata) {
//         setworkerList(takedata.data.worker);
//       }
//     };
//     workerdata();
//     // console.log("staff component: ", workerList);
//   }, [JSON.stringify(workerList), isEditWorker]);
//   return (
//     <div>
//       <div className=''>
//         <div className='m-5 h-100 staff-component-body'>
//           <div className='add-worker-btn-wrapper d-flex align-items-center justify-content-end'>
//             <a
//               type='button'
//               className='add-worker-btn d-flex align-items-center'
//               onClick={handleClick}
//             >
//               <UserRoundPlus className='user-icon' />
//               {/* <div className='add-worker-btn-text'>အသစ်ထည့်မည်</div> */}
//             </a>
//           </div>
//           {actionForEditAndDelete && (
//             <DeleteConfirmBox
//               cancelDelete={cancelDeleteConfirmation}
//               handleDelete={handleDeleteWorker}
//             />
//           )}
//           {addWorker && (
//             <div className='adduser-form-wrapper'>
//               <div className='assign-worker-form position-relative'>
//                 <div className='cancel-btn'>
//                   <X onClick={cancelAdd} />
//                 </div>
//                 <div className='position-relative'>
//                   <div className='mt-3 w-100'>
//                     <InputBox
//                       typeProps={"text"}
//                       name={"name"}
//                       value={data.name}
//                       holder={"အမည်ထည့်ရန်"}
//                       InputValue={handleChange}
//                     />
//                   </div>
//                   <div className='mt-3 w-100'>
//                     <select
//                       class='form-select'
//                       aria-label='Default select example'
//                       value={data.gender}
//                       name='gender'
//                       onChange={handleChange}
//                     >
//                       <option value='male' selected>
//                         ကျား
//                       </option>
//                       <option value='female'>မ</option>
//                     </select>
//                   </div>

//                   <div className='mt-3 w-100'>
//                     <PhoneInput
//                       country={"mm"}
//                       value={data.phone}
//                       onChange={(e) =>
//                         setData((prev) => ({
//                           ...prev,
//                           phone: e,
//                         }))
//                       }
//                     />
//                   </div>

//                   <div className='mt-3 w-100'>
//                     <InputBox
//                       typeProps={"text"}
//                       name={"address"}
//                       value={data.address}
//                       holder={"လိပ်စာထည့်ရန်"}
//                       InputValue={handleChange}
//                     />
//                   </div>
//                   <div className='mt-3 w-100'>
//                     <InputBox
//                       typeProps={"text"}
//                       name={"age"}
//                       value={data.age}
//                       holder={"အသက်ထည့်ရန်"}
//                       InputValue={handleChange}
//                     />
//                   </div>
//                 </div>
//                 {isEditWorker && (
//                   <div className='d-flex mt-3 justify-content-end'>
//                     <button className='btn btn-primary' onClick={postEditData}>
//                       ပြင်ဆင်ရန်
//                     </button>
//                   </div>
//                 )}
//                 {!isEditWorker && (
//                   <div className='d-flex mt-3 justify-content-end'>
//                     <button className='btn btn-primary' onClick={handleAdd}>
//                       စာရင်းသွင်းရန်
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//           <div className='user-detail-card'>
//             <div className='row g-2'>
//               <div className='col-lg-4 col-md-6'>
//                 <DetailCard
//                   icon={Users}
//                   response={workerList ? workerList.length : "0"}
//                   cardTitle={"အလုပ်သမား စုစုပေါင်း"}
//                 />
//               </div>
//               <div className='col-lg-4 col-md-6'>
//                 <DetailCard
//                   icon={Users}
//                   response={
//                     workerList
//                       ? workerList.filter((p) => p.Gender === "male").length
//                       : "0"
//                   }
//                   cardTitle={"ကျား"}
//                 />
//               </div>
//               <div className='col-lg-4 col-md-6'>
//                 <DetailCard
//                   icon={Users}
//                   response={
//                     workerList
//                       ? workerList.filter((p) => p.Gender === "female").length
//                       : "0"
//                   }
//                   cardTitle={"မ"}
//                 />
//               </div>
//             </div>
//           </div>
//           <div className='user-detail'>
//             <Accordion>
//               {workerList?.map((res, index) => (
//                 <Accordion.Item eventKey={`${index}`}>
//                   <Accordion.Header>
//                     <div className='d-flex'>
//                       <div className='me-5'>{index + 1}</div>
//                       <div className=''>{res.Name}</div>
//                     </div>
//                   </Accordion.Header>
//                   <Accordion.Body className='accordion-content'>
//                     <div className='fw-bold d-flex w-100 justify-content-between mb-2'>
//                       <div>အလုပ်သမား အချက်အလက်</div>
//                       <div>
//                         <button
//                           className='btn btn-danger me-3'
//                           onClick={() => handleDelete(res.WorkerId)}
//                         >
//                           ဖျက်ရန်
//                         </button>
//                         <button
//                           className={`btn btn-primary`}
//                           onClick={() => handleEdit(res)}
//                         >
//                           ပြင်ရန်
//                         </button>
//                       </div>
//                     </div>
//                     <table className='table table-striped w-100'>
//                       <tbody>
//                         <tr>
//                           <td>အမည်</td>
//                           <td>{res.Name}</td>
//                         </tr>
//                         <tr>
//                           <td>ဖုန်းနံပါတ်</td>
//                           <td>{res.Phone_no}</td>
//                         </tr>
//                         <tr>
//                           <td>ကျား/မ</td>
//                           <td>{res.Gender === "male" ? "ကျား" : "မ"}</td>
//                         </tr>
//                         <tr>
//                           <td>လိပ်စာ</td>
//                           <td>{res.Address}</td>
//                         </tr>
//                         <tr>
//                           <td>အသက်</td>
//                           <td>{res.Age}</td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </Accordion.Body>
//                 </Accordion.Item>
//               ))}
//             </Accordion>
//           </div>
//         </div>
//       </div>
//       <div className='empty-worker'>
//         {workerList.length == 0 && <div>အလုပ်သမားမရှိပါ</div>}
//       </div>
//     </div>
//   );
// };
// export default Staff;

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
      .regex(new RegExp(/^\+?[1-9]\d{1,14}$/), "ဖုန်းနံပါတ် မှန်ကန်စွာဖြည့်ပါ"),
    address: z.string().min(1, { message: "လိပ်စာ လိုအပ်ပါသည်" }),
    age: z
      .string()
      .regex(
        new RegExp(/^[1-6][0-9]$/),
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

  const { postData } = usePost("http://localhost:5000/dashboard/staff");
  const { postData: editWorker } = usePost(
    "http://localhost:5000/dashboard/staff/editworker"
  );
  const { deleteData } = useDelete("http://localhost:5000/dashboard/staff");
  const [actionForEditAndDelete, setActionForEditAndDelete] = useState(false);
  const [workerList, setworkerList] = useState([]);
  const [addWorker, setAddWorker] = useState(false);
  const [WorkerIdToDelete, setWorkerIdToDelete] = useState("");
  const [editWorkerId, seteditWorkerId] = useState("");
  const [isEditWorker, setIsEditWorker] = useState(false);
  const validationErrors = useRef("");
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
    // console.log("staff component ", data);
  };
  //Delete worker at onClick Delete
  const handleDelete = (e) => {
    setActionForEditAndDelete(true);
    setWorkerIdToDelete(e);
  };
  //add new user to database
  const handleAdd = async (e) => {
    // errors.name && console.log(errors.name.message);
    e.preventDefault();
    const result = userSchema.safeParse(data);
    if (result.success) {
      // console.log("validation success");
      const x = await postData(data);
      if (x) {
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
    } else {
      validationErrors.current = result.error.formErrors.fieldErrors;

      // console.log("This is validation errors: ", validationErrors.current);
      toast.error(Object.values(validationErrors.current)[0]);
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
  const postEditData = async (e) => {
    e.preventDefault();
    const result = userSchema.safeParse(data);
    if (result.success) {
      const editResult = await editWorker({ id: editWorkerId, data });
      if (editResult) {
        setAddWorker(!addWorker);
        setIsEditWorker(false);
      }
    } else {
      validationErrors.current = result.error.formErrors.fieldErrors;
      console.log(validationErrors.current);

      // console.log("This is validation errors: ", validationErrors.current);
      toast.error(Object.values(validationErrors.current)[0]);
    }
  };
  useEffect(() => {
    const workerdata = async () => {
      const takedata = await axios.get("http://localhost:5000/dashboard/staff");
      if (takedata) {
        setworkerList(takedata.data.worker);
      }
    };
    workerdata();
    // console.log("staff component: ", workerList);
  }, [JSON.stringify(workerList), isEditWorker]);
  return (
    <div>
      <Toaster toastOptions={{ duration: 2000 }} />
      <div className=''>
        <div className='m-5 h-100 staff-component-body'>
          <div className='add-worker-btn-wrapper d-flex align-items-center justify-content-end'>
            <a
              type='button'
              className='add-worker-btn d-flex align-items-center'
              onClick={handleClick}
            >
              <UserRoundPlus className='user-icon' />
              {/* <div className='add-worker-btn-text'>အသစ်ထည့်မည်</div> */}
            </a>
          </div>
          {actionForEditAndDelete && (
            <DeleteConfirmBox
              cancelDelete={cancelDeleteConfirmation}
              handleDelete={handleDeleteWorker}
            />
          )}
          {addWorker && (
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
          )}
          <div className='user-detail-card'>
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
          </div>
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
                      <div>
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
                      </div>
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
                          <td>ကျား/မ</td>
                          <td>{res.Gender === "male" ? "ကျား" : "မ"}</td>
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
