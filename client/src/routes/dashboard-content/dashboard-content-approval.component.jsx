// import classes from "./dashboard-content-approval.module.css";
import { useGet } from "../../custom-hook/axios-post/axios-post.jsx";
import axios from "axios";
import TotalExpenseSlip from "../../component/total-expense-slip/total-expense.component";
import classes from "./dashboard-content-approval.module.css";
import croptype from "../dashboard-content/cultivation-calculator/sample.json";
import { useEffect, useRef, useState } from "react";
import approve from "../../assets/icon/success.png";
import {
  MapContainer,
  TileLayer,
  Marker,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import point from "../../assets/icon/location.svg";

const AdminApproval = () => {
  const { response } = useGet("http://localhost:5000/getAllPost");
  const [postList, setPostList] = useState(null);
  const [postId, setPostId] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [postInfo, setPostInfo] = useState(null);

  const getPostDetail = async (id) => {
    // console.log("post Id", id);
    setPostId(id);
    setSelectedPostId(id);
    const result = await axios.post("http://localhost:5000/getSpecificPost", {
      postid: id,
    });
    if (result) {
      // console.log(result);
      setPostInfo(result.data);
    }
  };

  useEffect(() => {
    if (response) {
      const approvedPosts = response.data.filter(
        (post) => post.ApproveStatus === 0
      );
      setPostList(approvedPosts);
    }
  }, [response]);
  const jobLabels = {
    1: "ပေါင်းသတ်ခြင်း",
    2: "ပိုးသတ်ခြင်း",
    3: "ဓါတ်မြေဩဇာ",
    4: "ရိတ်သိမ်းစရိတ်",
    6: "မှိုသတ်ခြင်း",
    7: "မြေပြင်စရိတ်",
    8: "စိုက်ပျိုးစရိတ်",
    10: "ရွက်ဖြန်းမြေဩဇာ",
  };
  console.log("postInfo; ", postInfo);
  const approvePurpose = async (id) => {
    const result = await axios.post("http://localhost:5000/approvePropose", {
      postid: id,
    });
    if (result) {
      const getList = await axios.get("http://localhost:5000/getAllPost");
      if (getList) {
        const approvedPosts = getList.data.filter(
          (post) => post.ApproveStatus === 0
        );
        setPostList(approvedPosts);
        setPostId(null);
      }
    }
  };
  const MapView = () => {
    let map = useMap();
    map.setView(
      [postInfo.postGeneralInfo.Latitude, postInfo.postGeneralInfo.Longitude],
      map.getZoom()
    );
    //Sets geographical center and zoom for the view of the map
    return null;
  };
  // console.log(postList);
  return (
    <div className={`${classes.component_wrapper}`}>
      <div className={`${classes.left_side}`}>
        {postList && postList.length > 0 ? (
          postList.map((post, index) => (
            <div
              type='div'
              key={index}
              className={`${classes.post_button}`}
              onClick={() => getPostDetail(post.PostId)}
              style={{
                backgroundColor:
                  selectedPostId === post.PostId ? "#93ebf587" : "",
              }}
            >
              {/* {post.CropName} */}
              <div className={`${classes.mini_post_header}`}>
                <strong>{post.Name}</strong>
                {post.ApproveStatus === 1 && (
                  <img
                    src={approve}
                    className={`${classes.success_icon} ms-3`}
                  />
                )}
              </div>
              <div className={`${classes.mini_post_body}`}>
                <div className='me-3'>
                  {
                    croptype.crop.find((crop) => crop.value === post.CropName)
                      .name
                  }
                </div>
                <div>{post.Acre} ဧက</div>
              </div>
            </div>
          ))
        ) : (
          <div className={`${classes.no_post}`}>no post</div>
        )}
      </div>
      <div className={`${classes.right_side}`}>
        {postId && (
          <div className={`${classes.expense_wrapper}`}>
            {postInfo &&
              postInfo.postGeneralInfo &&
              // Destructure postGeneralInfo
              (() => {
                const localDate = new Date(
                  postInfo.postGeneralInfo.Date
                ).toLocaleDateString();
                const { Acre, Latitude, Longitude, Name } =
                  postInfo.postGeneralInfo;
                const { username } = postInfo;
                return (
                  <>
                    <div className={`${classes.owner_info}`}>
                      <div className={`${classes.owner_info_wrapper} `}>
                        <div>
                          ရက်စွဲ : <strong>{localDate}</strong>
                        </div>
                        <div>
                          ပိုင်ရှင်အမည် : <strong>{Name}</strong>
                        </div>
                        <div>
                          ပိုင်ရှင်မှတ်ပုံတင်အမှတ် :
                          <strong>
                            {postInfo && postInfo.postGeneralInfo.NRC}
                          </strong>
                        </div>
                      </div>
                    </div>
                    <div className={`${classes.farm_info}`}>
                      <div className={`${classes.farm_info_wrapper} `}>
                        <div>
                          ကွင်းအကျယ်အဝန်း : <strong>{Acre} ဧက</strong>
                        </div>
                        <div>
                          စိုက်ပျိုးသီးနှံ :{" "}
                          <strong>
                            {
                              croptype.crop.find(
                                (crop) =>
                                  crop.value ===
                                  postInfo.postGeneralInfo.CropName
                              ).name
                            }
                          </strong>
                        </div>
                        <div>
                          လတ္တီကျု:<strong>{Latitude}</strong>
                        </div>
                        <div>
                          လောင်ဂျီကျု:<strong>{Longitude}</strong>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}

            <div className={`${classes.expenses} mt-3`}>
              <div className={`${classes.expense_table_header} mb-3`}>
                အထွေထွေကုန်ကျစရိတ်
              </div>
              <table
                className={`${classes.expense_table} table table-bordered`}
              >
                <thead>
                  <tr>
                    <th scope='col'>အကြောင်းအရာ</th>
                    <th scope='col'>ဆေးတန်ဖိုး</th>
                    <th scope='col'>လူဉီးရေ</th>
                    <th scope='col'>တစ်ယောက်လုပ်အားခ</th>
                    <th scope='col'>ဆေးဖြန်းနှုန်း(ကြိမ်)</th>
                    <th scope='col'>စုစုပေါင်း</th>
                  </tr>
                </thead>
                <tbody>
                  {postInfo &&
                    postInfo.postJobInfo.map((job, index) => (
                      <tr key={index}>
                        <th scope='row'>{jobLabels[job.JobId]}</th>
                        <td>{job.ChemicalPrice || "-"}</td>
                        <td>{job.LaborNeed || "-"}</td>
                        <td>{job.WagePerLabor || "-"}</td>
                        <td>{job.FrequentUsage || "-"}</td>
                        <td>{job.TotalCostPerJob || "-"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {postInfo &&
              postInfo.postTotalCost &&
              // Destructure postGeneralInfo
              (() => {
                const {
                  TotalChemicalPrice,
                  TotalMachineryCost,
                  TotalWage,
                  TotalExpense,
                } = postInfo.postTotalCost[0];
                return (
                  <>
                    <div className={`${classes.total_expense_wrapper} mt-3`}>
                      <div className={`${classes.total_expense} `}>
                        <div>
                          {" "}
                          ဆေးတန်ဖိုးစုစုပေါင်း :{" "}
                          <strong>{TotalChemicalPrice} ကျပ်</strong>
                        </div>
                        <div>
                          လုပ်အားခစုစုပေါင်း : <strong>{TotalWage} ကျပ်</strong>
                        </div>
                        <div>
                          စက်ပစ္စည်းငှားရမ်းခစုစုပေါင်း :{" "}
                          <strong>{TotalMachineryCost} ကျပ်</strong>
                        </div>
                        <div>
                          စုစုပေါင်းကုန်ကျစရိတ် :{" "}
                          <strong>{TotalExpense} ကျပ်</strong>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            <button
              className={`${classes.approve_btn} btn btn-primary`}
              onClick={() => approvePurpose(postId)}
            >
              မှန်ကန်ပါသည်
            </button>
            <div className='mt-3'>
              {postInfo &&
                postInfo.postGeneralInfo.Latitude &&
                postInfo.postGeneralInfo.Longitude && (
                  <iframe
                    width='550'
                    height='350'
                    frameborder='0'
                    style={{ border: 0 }}
                    referrerpolicy='no-referrer-when-downgrade'
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDSegWYCf5Tzfc73v-s5KDm-OUIfn9UWME &q=${postInfo.postGeneralInfo.Latitude},${postInfo.postGeneralInfo.Longitude}&zoom=18
  &maptype=satellite`}
                    allowfullscreen
                  ></iframe>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminApproval;
