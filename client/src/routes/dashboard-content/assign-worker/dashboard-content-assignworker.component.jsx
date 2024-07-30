import classes from "./dashboard-content-assignworker.module.css";
import {
  useGet,
  usePost,
  useDelete,
} from "../../../custom-hook/axios-post/axios-post.jsx";
import success from "../../../assets/icon/success.png";
import { useState, useEffect, useRef } from "react";
import numtowords from "number-to-words";
import axios from "axios";
// import { Offcanvas } from "bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
// import * as bootstrap from 'bootstrap';
// window.bootstrap = bootstrap;

const AssignWorker = () => {
  const [farmlist, setFarmList] = useState([]);
  const [workerlist, setworkerlist] = useState([]);
  const [assignWorker, setAssignWorker] = useState(false);
  const assignWorkerRef = useRef([]);
  const [openRightNavBar, setopenRightNavBar] = useState(false);
  const [selectedFarmId, setSelectedFarmId] = useState(null);

  const { response } = useGet(
    "http://localhost:5000/farm/getfarmlist",
    assignWorker
  );
  const { response: res } = useGet("http://localhost:5000/dashboard/staff");
  const { postData } = usePost(
    "http://localhost:5000/dashboard/staff/assign-worker"
  );
  const { deleteData } = useDelete(
    "http://localhost:5000/dashboard/staff/assign-worker"
  );

  //console.log("assign-worker component")
  useEffect(() => {
    if (response && res) {
      setFarmList(response.data);
      setworkerlist(res.data.worker);
      //console.log("dashboard farm component: ", assignWorkerRef.current.length);
    }
    return () => {
      for (let i = assignWorkerRef.current.length - 1; i >= 0; i--) {
        assignWorkerRef.current.splice([i], 1);
      }
    };
  }, [response, res, assignWorker]);
  const assignWorkerbtn = (data) => {
    setSelectedFarmId(data);
  };

  const deleteAssignWorker = async (FarmId, WorkerId) => {
    const deleteResult = await axios.delete(
      "http://localhost:5000/dashboard/staff/assign-worker",
      { data: { id: { farmid: FarmId, workerid: WorkerId } } }
    );
    setAssignWorker(!assignWorker);
    //const deleteResult = await deleteData({id:FarmId});
  };
  const assignWorkerToFarm = async (workerData, farmData) => {
    const result = await postData({ workerId: workerData, farmId: farmData });

    setAssignWorker((prev) => !prev);
    return () => {
      for (let i = assignWorkerRef.current.length - 1; i >= 0; i--) {
        assignWorkerRef.current.splice([i], 1);
      }
    };
  };
  // console.log("dashboard-assignworker com", selectedFarmId);
  return (
    <div className={`${classes.content} p-5`}>
      <div class='accordion' id='accordionExample'>
        {farmlist?.map((res, index) => (
          <div class='accordion-item' key={index}>
            <h2 class='accordion-header'>
              <button
                class='accordion-button collapsed'
                type='button'
                data-bs-toggle='collapse'
                data-bs-target={`#collapse${numtowords.toWords(index + 1)}`}
                aria-expanded='false'
                aria-controls={`collapse${numtowords.toWords(index + 1)}`}
              >
                <div className='row w-100'>
                  <div className='col-4'>{res.Name}</div>
                  <div className='col-4'>{res.Crop_type}</div>
                  <div className='col-4'>
                    {res.WorkerId && (
                      <div className=' d-flex justify-content-end me-3'>
                        <img
                          src={success}
                          className={`${classes.success_icon} ms-3`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            </h2>
            <div
              id={`collapse${numtowords.toWords(index + 1)}`}
              class='accordion-collapse collapse'
              aria-labelledby='headingOne'
              data-bs-parent='#accordionExample'
            >
              <div class={`accordion-body ${classes.accordion_body}`}>
                <div className='fw-bold d-flex w-100 justify-content-between'>
                  <div>အလုပ်သမား အချက်အလက်</div>
                  <div>
                    {res.WorkerId && (
                      <button
                        className='btn btn-danger'
                        onClick={() =>
                          deleteAssignWorker(res.FarmId, res.WorkerId)
                        }
                      >
                        ထုတ်မည်
                      </button>
                    )}
                    {!res.WorkerId && (
                      <button
                        type='button'
                        className={`${classes.assign_worker_btn} btn btn-primary`}
                        onClick={() => assignWorkerbtn(res.FarmId)}
                        data-bs-toggle='offcanvas'
                        href='#assignWorker'
                        data-bs-target='#assignWorker'
                        aria-controls='offcanvasExample'
                      >
                        အလုပ်သမားထည့်ရန်
                      </button>
                    )}
                  </div>
                </div>
                <table className='table table-striped w-100'>
                  <tbody>
                    {workerlist
                      ?.filter((data) => data.WorkerId === res.WorkerId)
                      .map((filteredData) => (
                        <>
                          <tr className='w-100' key={filteredData.WorkerId}>
                            <td>အမည်</td>
                            <td>{filteredData.Name}</td>
                          </tr>
                          <tr>
                            <td>ဖုန်းနံပါတ်</td>
                            <td>{filteredData.Phone_no}</td>
                          </tr>
                          <div className='d-none'>
                            {assignWorkerRef.current.push(
                              filteredData.WorkerId
                            )}
                          </div>
                        </>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div
              class={`offcanvas offcanvas-end ${classes.assign_worker_offcanvas}`}
              tabindex='-1'
              id='assignWorker'
              aria-labelledby='offcanvasExampleLabel'
              aria-modal='false'
            >
              <div class='offcanvas-header'>
                <button
                  type='button'
                  class='btn-close text-reset'
                  data-bs-dismiss='offcanvas'
                  aria-label='Close'
                ></button>
              </div>
              <div class='offcanvas-body'>
                <h5 class='offcanvas-title' id='offcanvasExampleLabel'>
                  ကျန်သောအလုပ်သမားများ
                </h5>
                {selectedFarmId && (
                  <div
                    className={`${classes.assign_worker_content} mt-3 list-group`}
                  >
                    {workerlist
                      .filter(
                        (worker) =>
                          !assignWorkerRef.current.includes(worker.WorkerId)
                      )
                      .map((r, index) => (
                        <button
                          key={index}
                          className='list-group-item list-group-item-action'
                          type='button'
                          onClick={() => {
                            assignWorkerToFarm(r.WorkerId, selectedFarmId);
                          }}
                        >
                          {r.Name}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='empty-farm'>
        {farmlist.length == 0 && <div>လယ်ကွက်များမရှိပါ</div>}
      </div>
    </div>
  );
};
export default AssignWorker;
