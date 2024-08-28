import classes from "./dashboard-content-assignworker.module.css";
import { useGet } from "../../../custom-hook/axios-post/axios-post.jsx";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import croptype from "./crop.json";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import print from "../../../assets/icon/print.png";
import ShowQR from "../../../component/show-QR/show-QR.component.jsx";

const AssignWorker = () => {
  const { response } = useGet("http://localhost:5000/getAgreedPosts");
  const [postList, setPostList] = useState(null);
  const [postId, setPostId] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [isShowQR, setIsShowQR] = useState(false);
  const reportRef = useRef();
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [postInfo, setPostInfo] = useState(null);

  const getPostDetail = async (id) => {
    // console.log("post Id", id);
    setPostId(id);
    setSelectedPostId(id);
    const result = await axios.post("http://localhost:5000/makeContract", {
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
        (post) => post.ApproveStatus === 1
      );
      setPostList(approvedPosts);
    }
  }, [response]);
  const handlePrint = () => {
    const input = reportRef.current;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg", 0.8); // Use JPEG format with compression
      const pdf = new jsPDF("p", "mm", "a4"); // Adjust page size and orientation
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
      pdf.save("expense-report.pdf");
    });
  };
  const jobLabels = {
    1: "ပေါင်းသတ်ခြင်း",
    2: "ပိုးသတ်ခြင်း",
    3: "ဓါတ်မြေဩဇာ",
    4: "ရိတ်သိမ်းစရိတ်",
    5: "ရေသွင်းခြင်း",
    6: "မှိုသတ်ခြင်း",
    7: "မြေပြင်စရိတ်",
    8: "စိုက်ပျိုးစရိတ်",
    10: "ရွက်ဖြန်းမြေဩဇာ",
  };
  const handleShowQR = async (id) => {
    try {
      const result = await axios.post(
        "http://localhost:5000/getQR",
        { id },
        { responseType: "blob" }
      );
      if (result) {
        // console.log(result);
        const imageBlob = new Blob([result.data], {
          type: "image/png",
        });
        const imageUrl = URL.createObjectURL(imageBlob);
        // console.log(imageUrl);
        setImageSrc(imageUrl);
      }
    } catch (error) {
      console.error("Error at showing QR: ", error);
    }
  };
  const handleClose = () => {
    setImageSrc(null);
  };
  console.log(postInfo);
  // console.log("dashboard-assignworker com", selectedFarmId);
  return (
    <div className={`${classes.component_wrapper}`}>
      <div className={`${classes.left_side}`}>
        <div className={`${classes.left_side_header}`}>
          လက်ခံထားသည့်အလုပ်များ
        </div>
        {postList && postList.length > 0 ? (
          postList.map((post, index) => (
            <div
              type='div'
              key={index}
              className={`${classes.post_button}`}
              onClick={() => getPostDetail(post.PostId)}
              style={{
                backgroundColor:
                  selectedPostId === post.PostId ? "#e8d3c0" : "",
              }}
            >
              {/* {post.CropName} */}
              <div className={`${classes.mini_post_header}`}>
                <strong>{post.UName}</strong>
                {post.ApproveStatus === 1 && (
                  // <img
                  //   src={approve}
                  //   className={`${classes.success_icon} ms-3`}
                  // />
                  <div className={`${classes.success_icon} text-success ms-3`}>
                    approved
                  </div>
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
          <div className={`${classes.expense_wrapper}`} ref={reportRef}>
            {postInfo &&
              postInfo.postGeneralInfo &&
              // Destructure postGeneralInfo
              (() => {
                const localDate = new Date(
                  postInfo.postGeneralInfo.Date
                ).toLocaleDateString();
                const {
                  Acre,
                  Latitude,
                  Longitude,
                  UName,
                  UNRC,
                  UPhone,
                  WPhone,
                  WName,
                  WAddress,
                  UAddress,
                  WNRC,
                } = postInfo.postGeneralInfo;
                const startDate = new Date(
                  postInfo.postGeneralInfo.StartDate
                ).toLocaleDateString();
                const { Name, NRC, Address } = postInfo.adminInformation;
                // const { username } = postInfo;
                return (
                  <>
                    <div className={`${classes.owner_info}`}>
                      <div className={`${classes.owner_info_wrapper} `}>
                        <div className='fw-bold fs-6 mb-2'>
                          လယ်ပိုင်ရှင်အချက်အလက်
                        </div>
                        <div>
                          ရက်စွဲ : <strong>{localDate}</strong>
                        </div>
                        <div>
                          ပိုင်ရှင်အမည် : <strong>{UName}</strong>
                        </div>
                        <div>
                          ပိုင်ရှင်မှတ်ပုံတင်အမှတ် :<strong>{UNRC}</strong>
                        </div>
                        <div className={`${classes.wrap_text}`}>
                          နေရပ်လိပ်စာ :<strong>{UAddress}</strong>
                        </div>
                        <div>
                          ဖုန်းနံပါတ် :<strong>{UPhone}</strong>
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
                        <div>
                          စတင်စိုက်ပျိုးမည့်နေ့ရက်:<strong>{startDate}</strong>
                        </div>
                      </div>
                    </div>
                    <div className={`${classes.person} mt-3`}>
                      <table
                        className={`${classes.expense_table} table table-bordered`}
                      >
                        <thead>
                          <tr>
                            <th scope='col'>အချက်အလက်များ</th>
                            <th scope='col'>အလုပ်သမား</th>
                            <th scope='col'>အတည်ပြုသူ</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th scope='row'>အမည်</th>
                            <td>{WName}</td>
                            <td>{Name}</td>
                          </tr>
                          <tr>
                            <th scope='row'>မှတ်ပုံတင်အမှတ်</th>
                            <td>{WNRC}</td>
                            <td>{UNRC}</td>
                          </tr>
                          <tr>
                            <th scope='row'>ဖုန်းနံပါတ်</th>
                            <td>{UPhone}</td>
                            <td>{WPhone}</td>
                          </tr>
                          <tr>
                            <th scope='row'>နေရပ်လိပ်စာ</th>
                            <td>{WAddress}</td>
                            <td>{Address}</td>
                          </tr>
                        </tbody>
                      </table>
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
          </div>
        )}
        {postInfo && (
          <div>
            <button className={`${classes.approve_btn}`} onClick={handlePrint}>
              <img src={print} /> printထုတ်မည်
            </button>
            <button
              className={`btn btn-primary ms-3`}
              onClick={() => handleShowQR(postId)}
            >
              ငွေချေမည်
            </button>
          </div>
        )}
        {imageSrc && <ShowQR imageSrc={imageSrc} handleClose={handleClose} />}
        <div className={`${classes.embed_map}`}>
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
    </div>
  );
};
export default AssignWorker;
