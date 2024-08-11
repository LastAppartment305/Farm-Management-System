import { useRef, useState } from "react";
import classes from "./cultivation-calculator.module.css";
import { usePost } from "../../../custom-hook/axios-post/axios-post.jsx";
import crops from "./sample.json";

const Calculator = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptionDetail, setSelectedOptionDetail] = useState(null);
  const laborNeed = useRef({
    tranplating: null,
    seeding: null,
    pesticide: null,
    herbicide: null,
    fertilizer: null,
  });
  const wage = useRef({
    tranplanting: null,
    seeding: null,
    pesticide: null,
    herbicide: null,
    fertilizer: null,
    plowing: null,
    irrigating: null,
    harvesting: null,
  });
  const [pesticidePrice, setPesticidePrice] = useState();
  const [acre, setAcre] = useState(null);
  const [initialResult, setInitialResult] = useState(null);

  const { postData } = usePost(
    "http://localhost:5000/calculator/get-crop-overall-data"
  );

  const handleChange = async (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    const response = await postData({ crop: value });
    if (response) {
      laborNeed.current.tranplating = response.cropInfo.TransplantLabor;
      laborNeed.current.pesticide = response.cropInfo.PestiLabor;
      laborNeed.current.herbicide = response.cropInfo.HerbiLabor;
      laborNeed.current.fertilizer = response.cropInfo.FertiLabor;
      wage.current.tranplanting = response.overallInfo.find(
        (i) =>
          i.JobId ===
          response.job.find((data) => data.JobCategory === "tranplanting")
            ?.JobId
      )?.Wage;
      wage.current.pesticide = response.overallInfo.find(
        (i) =>
          i.JobId ===
          response.job.find((data) => data.JobCategory === "pesticide")?.JobId
      )?.Wage;
      wage.current.herbicide = response.overallInfo.find(
        (i) =>
          i.JobId ===
          response.job.find((data) => data.JobCategory === "herbicide")?.JobId
      )?.Wage;
      wage.current.fertilizer = response.overallInfo.find(
        (i) =>
          i.JobId ===
          response.job.find((data) => data.JobCategory === "fertilizer")?.JobId
      )?.Wage;
      wage.current.harvesting = response.overallInfo.find(
        (i) =>
          i.JobId ===
          response.job.find((data) => data.JobCategory === "harvesting")?.JobId
      )?.Wage;
      wage.current.plowing = response.overallInfo.find(
        (i) =>
          i.JobId ===
          response.job.find((data) => data.JobCategory === "plowing")?.JobId
      )?.Wage;
    }
    console.log("initaial result", response);
    setInitialResult(response);
    const detail = crops[value];
    setSelectedOptionDetail(detail);
    if (laborNeed.current) {
      console.log(wage.current);
      console.log(laborNeed.current.herbicide);
    }
  };
  return (
    <div className={`${classes.calculator_wrapper}`}>
      <div className={`${classes.crop}`}>
        <div className={`${classes.boxes} me-5`}>
          <div className={`${classes.box_label} mb-2`}>စိုက်ပျိုးသီးနှံ</div>
          <select className={`${classes.inputs} w-100`} onChange={handleChange}>
            <option></option>
            {crops.crop.map((item, index) => (
              <option key={index} value={item.value}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className={`${classes.boxes}`}>
          <div className={`${classes.box_label} mb-2`}>မြေဧကအကျယ်အဝန်း(ဧက)</div>
          <input
            className={`${classes.inputs}`}
            onChange={(e) => setAcre(e.target.value)}
          />
        </div>
      </div>
      <div className={`${classes.pesticide} w-100`}>
        <div className={`${classes.boxes} me-5`}>
          <div className={`${classes.box_label} mb-2`}>စိုက်ပျိုးစရိတ်</div>
        </div>
        {/* <div className={`${classes.radio_btn_wrapper}`}>
          <div className='d-flex align-items-center'>
            <input
              type='radio'
              id='radio1'
              name='seed_cost'
              className={`${classes.radio_btn}`}
            />
            <label for='radio1' className='me-5'>
              ပျိုးပင်ဖြင့်စိုက်ပျိုးခြင်း
            </label>
          </div>
          <div className='d-flex align-items-center'>
            <input
              type='radio'
              id='radio2'
              name='seed_cost'
              className={`${classes.radio_btn}`}
            />
            <label for='radio2' className='me-5'>
              မျိုးစေ့ကြဲစိုက်ပျိုးခြင်း
            </label>
          </div>
        </div> */}
        <div className={`mt-2`}>
          မျိုးစရိတ်:
          {wage.current.Seed_Cost && acre && (
            <strong>{wage.current.Seed_Cost * acre}ကျပ်</strong>
          )}
        </div>
        <div className={`mt-2`}>
          လုပ်သားလိုအပ်ချက်:
          {laborNeed.current.sowing && acre && (
            <strong>{laborNeed.current.sowing * acre}ယောက်</strong>
          )}
        </div>
        <div className={`mt-2`}>
          တစ်ယောက်လုပ်အားခ:
          {wage.current.sowing && acre && (
            <strong>{wage.current.sowing * acre} ကျပ်</strong>
          )}
        </div>
        <div className={`mt-2`}>
          ကုန်ကျငွေ:
          {<strong></strong>}
        </div>
      </div>
      <div className={`${classes.pesticide} w-100`}>
        <div className={`${classes.boxes} me-5`}>
          <div className={`${classes.box_label} mb-2`}>ပိုးသတ်ဆေး</div>
          <select className={`${classes.inputs} w-100`}>
            <option></option>
          </select>
        </div>
        <div className={`mt-2`}>
          လုပ်သားလိုအပ်ချက်:
          {laborNeed.current.pesticide && acre && (
            <strong>{laborNeed.current.pesticide * acre}ယောက်</strong>
          )}
        </div>
        <div className={`mt-2`}>
          တစ်ယောက်လုပ်အားခ:
          {wage.current.pesticide && acre && (
            <strong>{wage.current.pesticide * acre} ကျပ်</strong>
          )}
        </div>
        <div className={`mt-2`}>
          ကုန်ကျငွေ:
          {<strong></strong>}
        </div>
      </div>
      <div className={`${classes.herbicide} w-100`}>
        <div className={`${classes.boxes} me-5`}>
          <div className={`${classes.box_label} mb-2`}>ပေါင်းသတ်ဆေး</div>
          <select className={`${classes.inputs} w-100`}>
            <option></option>
          </select>
        </div>
        <div className={`mt-2`}>
          လုပ်သားလိုအပ်ချက်:
          {laborNeed.current.herbicide && acre && (
            <strong>{laborNeed.current.herbicide * acre}ယောက်</strong>
          )}
        </div>
        <div className={`mt-2`}>
          တစ်ယောက်လုပ်အားခ:
          {wage.current.herbicide && acre && (
            <strong>{wage.current.herbicide * acre} ကျပ်</strong>
          )}
        </div>
        <div className={`mt-2`}>ကုန်ကျငွေ: </div>
      </div>
      <div className={`${classes.fertilizer} w-100`}>
        <div className={`${classes.boxes} me-5`}>
          <div className={`${classes.box_label} mb-2`}>ဓါတ်မြေဩဇာ</div>
          <select className={`${classes.inputs} w-100`}>
            <option></option>
          </select>
        </div>
        <div className={`mt-2`}>
          လုပ်သားလိုအပ်ချက်:
          {laborNeed.current.fertilizer && acre && (
            <strong>{laborNeed.current.fertilizer * acre} ယောက်</strong>
          )}
        </div>
        <div className={`mt-2`}>
          တစ်ယောက်လုပ်အားခ:
          {wage.current.fertilizer && acre && (
            <strong>{wage.current.fertilizer * acre} ကျပ်</strong>
          )}
        </div>
        <div className={`mt-2`}>ကုန်ကျငွေ: </div>
      </div>
      <div className={`${classes.field_preparation} w-100`}>
        <div className={`${classes.boxes} me-5`}>
          <div className={`${classes.box_label} mb-2`}>မြေပြင်ဆင်စရိတ်</div>
        </div>
        <div className={`mt-2`}>
          စက်ပစ္စည်းငှားရမ်းခ:
          {wage.current.plowing && acre && (
            <strong>{wage.current.plowing * acre}ကျပ်</strong>
          )}
        </div>
        {/* <div className={`mt-2`}>ကုန်ကျငွေ: </div> */}
      </div>
      <div className={`${classes.harvest} w-100`}>
        <div className={`${classes.boxes} me-5`}>
          <div className={`${classes.box_label} mb-2`}>ရိတ်သိမ်းစရိတ်</div>
        </div>
        <div className={`mt-2`}>
          စက်ပစ္စည်းငှားရမ်းခ:
          {wage.current.harvesting && acre && (
            <strong>{wage.current.harvesting * acre} ကျပ်</strong>
          )}
        </div>
        {/* <div className={`mt-2`}>ကုန်ကျငွေ: </div> */}
      </div>
      <div className={`${classes.total_expense} w-100`}>
        <div className={`${classes.boxes} me-5`}>
          <div className={`${classes.box_label} mb-2`}>
            စုစုပေါင်းကုန်ကျစရိတ်
          </div>
        </div>
        <div className={`mt-2`}>ဆေးတန်ဖိုးစုစုပေါင်း: </div>
        <div className={`mt-2`}>
          လုပ်အားခစုစုပေါင်း:{" "}
          {acre && (
            <strong>
              {wage.current.sowing * (laborNeed.current.sowing * acre) +
                wage.current.pesticide * (laborNeed.current.pesticide * acre) +
                wage.current.herbicide * (laborNeed.current.herbicide * acre) +
                wage.current.fertilizer *
                  (laborNeed.current.fertilizer * acre)}{" "}
              ယောက်
            </strong>
          )}
        </div>
        <div className={`mt-2`}>
          အလုပ်သမားစုစုပေါင်း:{" "}
          {acre && (
            <strong>
              {(laborNeed.current.sowing +
                laborNeed.current.pesticide +
                laborNeed.current.herbicide +
                laborNeed.current.fertilizer) *
                acre}{" "}
              ယောက်
            </strong>
          )}
        </div>
        <div className={`mt-2`}>
          စက်ပစ္စည်းငှားရမ်းခစုစုပေါင်း:{" "}
          {acre && (
            <strong>
              {wage.current.plowing * acre + wage.current.Harvesting * acre}{" "}
              ယောက်
            </strong>
          )}
        </div>
        <div className={`mt-2`}>စုစုပေါင်းကုန်ကျစရိတ်: </div>
      </div>
    </div>
  );
};
export default Calculator;
