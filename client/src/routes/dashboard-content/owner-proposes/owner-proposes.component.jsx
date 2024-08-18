import classes from "./owner-proposes.module.css";
import Accordion from "react-bootstrap/Accordion";
import { useGet } from "../../../custom-hook/axios-post/axios-post.jsx";
import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
const OwnerPropose = () => {
  const [postList, setPostList] = useState(null);
  const [postId, setPostId] = useState(null);
  const [postInfo, setPostInfo] = useState(null);
  const reportRef = useRef();
  const { response } = useGet("http://localhost:5000/getPosts");
  useEffect(() => {
    if (response) {
      setPostList(response);
    }
  });
  const getPostDetail = async (id) => {
    // console.log("post Id", id);
    setPostId(id);
    const result = await axios.post("http://localhost:5000/getSpecificPost", {
      postid: id,
    });
    if (result) {
      // console.log(result);
      setPostInfo(result.data);
    }
  };
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
    4: "မြေပြင်စရိတ်",
    7: "ရိတ်သိမ်းစရိတ်",
  };
  console.log("postInfo", postInfo);
  return (
    <div className={`${classes.component_wrapper}`}>
      <div className={`${classes.left_side}`}>
        This is propose.
        {postList &&
          postList.data.map((post, index) => (
            <div
              type='div'
              key={index}
              className={`${classes.post_button}`}
              onClick={() => getPostDetail(post.PostId)}
            >
              {post.PostId}
            </div>
          ))}
      </div>
      <div className={`${classes.right_side}`}>
        {postId && (
          <div className={`${classes.expense_wrapper}`} ref={reportRef}>
            {postInfo &&
              postInfo.postGeneralInfo &&
              // Destructure postGeneralInfo
              (() => {
                const { Date, UserId, Acre } = postInfo.postGeneralInfo;
                return (
                  <>
                    <div className={`${classes.owner_info}`}>
                      <div className={`${classes.owner_info_wrapper} `}>
                        <div>Date : {Date}</div>
                        <div>ပိုင်ရှင်အမည် : {UserId}</div>
                        <div>ပိုင်ရှင်မှတ်ပုံတင်အမှတ် :</div>
                      </div>
                    </div>
                    <div className={`${classes.farm_info}`}>
                      <div className={`${classes.farm_info_wrapper} `}>
                        <div>ကွင်းအကျယ်အဝန်း : {Acre} ဧက</div>
                        <div>စိုက်ပျိုးသီးနှံ : မိုးစပါး</div>
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
                          ဆေးတန်ဖိုးစုစုပေါင်း : {TotalChemicalPrice} MMK
                        </div>
                        <div>လုပ်အားခစုစုပေါင်း : {TotalWage} ကျပ်</div>
                        <div>
                          စက်ပစ္စည်းငှားရမ်းခစုစုပေါင်း : {TotalMachineryCost}{" "}
                          ကျပ်
                        </div>
                        <div>စုစုပေါင်းကုန်ကျစရိတ် : {TotalExpense} ကျပ်</div>
                      </div>
                    </div>
                  </>
                );
              })()}
          </div>
        )}
        <button onClick={handlePrint}>Print as PDF</button>
      </div>
    </div>
  );
};
export default OwnerPropose;
