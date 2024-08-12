import { useEffect, useRef, useState } from "react";
import classes from "./cultivation-calculator.module.css";
import { usePost } from "../../../custom-hook/axios-post/axios-post.jsx";
import crops from "./sample.json";
import PesticideComponent from "../../../component/pesticide/pesticide.component.jsx";

const Calculator = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptionDetail, setSelectedOptionDetail] = useState(null);
  const [chemical, setChemical] = useState(null);
  const [chemicalPrice, setChemicalPrice] = useState({
    pesticide: null,
    herbicide: null,
    fertilizer: null,
  });
  const [plantingDetail, setPlantingDetail] = useState({
    seedCost: null,
    totalLaborNeed: null,
    totalLaborWage: null,
  });
  const [pesticideDetail, setPesticideDetail] = useState({
    totalLaborNeed: null,
    totalLaborWage: null,
    chemicalCost: null,
  });
  const [herbicideDetail, setHerbicideDetail] = useState({
    totalLaborNeed: null,
    totalLaborWage: null,
    chemicalCost: null,
  });
  const [fertilizerDetail, setFertilizerDetail] = useState({
    totalLaborNeed: null,
    totalLaborWage: null,
    chemicalCost: null,
  });
  const [totalLoborCost, setTotalLaborCost] = useState({});
  const [fetchData, setFetchData] = useState(null);
  const [laborNeed, setLaborNeed] = useState({
    // tranplating: null,
    // seeding: null,
    planting: null,
    pesticide: null,
    herbicide: null,
    fertilizer: null,
    fungicide: null,
  });
  const [wage, setWage] = useState({
    planting: null,
    pesticide: null,
    herbicide: null,
    fertilizer: null,
    plowing: null,
    irrigating: null,
    harvesting: null,
    fungicide: null,
  });
  const [jobFrequentUsage, setJobFrequentUsage] = useState({
    pesticide: null,
    herbicide: null,
    fertilizer: null,
  });
  const [totalpesticideCost, setTotalPesticideCost] = useState();
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
      setFetchData(response);
      setChemical(response.chemical);
      setLaborNeed({
        // tranplating: response.cropInfo.TransplantLabor,
        // seeding: response.cropInfo.SeedingLabor,
        pesticide: response.cropInfo.PestiLabor,
        herbicide: response.cropInfo.HerbiLabor,
        fertilizer: response.cropInfo.FertiLabor,
      });
      setJobFrequentUsage({
        pesticide: response.overallInfo.find(
          (i) =>
            i.JobId ===
            response.job.find((data) => data.JobCategory === "pesticide")?.JobId
        )?.FrequentUsage,
        herbicide: response.overallInfo.find(
          (i) =>
            i.JobId ===
            response.job.find((data) => data.JobCategory === "herbicide")?.JobId
        )?.FrequentUsage,
        fertilizer: response.overallInfo.find(
          (i) =>
            i.JobId ===
            response.job.find((data) => data.JobCategory === "fertilizer")
              ?.JobId
        )?.FrequentUsage,
      });
      setWage({
        pesticide: response.overallInfo.find(
          (i) =>
            i.JobId ===
            response.job.find((data) => data.JobCategory === "pesticide")?.JobId
        )?.Wage,

        herbicide: response.overallInfo.find(
          (i) =>
            i.JobId ===
            response.job.find((data) => data.JobCategory === "herbicide")?.JobId
        )?.Wage,

        fertilizer: response.overallInfo.find(
          (i) =>
            i.JobId ===
            response.job.find((data) => data.JobCategory === "fertilizer")
              ?.JobId
        )?.Wage,

        harvesting: response.overallInfo.find(
          (i) =>
            i.JobId ===
            response.job.find((data) => data.JobCategory === "harvesting")
              ?.JobId
        )?.Wage,

        plowing: response.overallInfo.find(
          (i) =>
            i.JobId ===
            response.job.find((data) => data.JobCategory === "plowing")?.JobId
        )?.Wage,
      });
    }
    console.log("initaial result", response);
    setInitialResult(response);
    const detail = crops[value];
    setSelectedOptionDetail(detail);
    // if (laborNeed.current) {
    //   console.log(wage.current);
    //   console.log(laborNeed.current.herbicide);
    // }
  };
  const clickRadioBtn1 = (e) => {
    setLaborNeed((prev) => ({ ...prev, planting: e.target.value }));
    setWage((prev) => ({
      ...prev,
      planting: fetchData.overallInfo.find(
        (i) =>
          i.JobId ===
          fetchData.job.find((data) => data.JobCategory === "tranplanting")
            ?.JobId
      )?.Wage,
    }));
  };
  const clickRadioBtn2 = (e) => {
    setLaborNeed((prev) => ({ ...prev, planting: e.target.value }));
    setWage((prev) => ({
      ...prev,
      planting: fetchData.overallInfo.find(
        (i) =>
          i.JobId ===
          fetchData.job.find((data) => data.JobCategory === "seeding")?.JobId
      )?.Wage,
    }));
  };
  const handlePesticidePrice = (e) => {
    setChemicalPrice((prev) => ({
      ...prev,
      pesticide: parseInt(e.target.value),
    }));
  };
  const handleHerbicidePrice = (e) => {
    setChemicalPrice((prev) => ({
      ...prev,
      herbicide: parseInt(e.target.value),
    }));
  };
  const handleFertilizerPrice = (e) => {
    setChemicalPrice((prev) => ({
      ...prev,
      fertilizer: parseInt(e.target.value),
    }));
  };
  useEffect(() => {
    laborNeed.planting &&
      acre &&
      setPlantingDetail((prev) => ({
        ...prev,
        totalLaborNeed: laborNeed.planting * acre,
      }));
  });
  console.log("fetchDataState", chemicalPrice);
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
        <div className={`${classes.radio_btn_wrapper}`}>
          <div className='d-flex align-items-center'>
            <input
              type='radio'
              id='radio1'
              name='planting'
              className={`${classes.radio_btn}`}
              onChange={clickRadioBtn1}
              value={fetchData?.cropInfo.TransplantLabor}
            />
            <label for='radio1' className='me-5'>
              ပျိုးပင်ဖြင့်စိုက်ပျိုးခြင်း
            </label>
          </div>
          <div className='d-flex align-items-center'>
            <input
              type='radio'
              id='radio2'
              name='planting'
              className={`${classes.radio_btn}`}
              onChange={clickRadioBtn2}
              value={fetchData?.cropInfo.SeedingLabor}
            />
            <label for='radio2' className='me-5'>
              မျိုးစေ့ကြဲစိုက်ပျိုးခြင်း
            </label>
          </div>
        </div>
        <div className={`mt-2`}>
          မျိုးစရိတ်:
          {fetchData?.cropInfo.SeedCost && acre && (
            <strong>{fetchData.cropInfo.SeedCost * acre}ကျပ်</strong>
          )}
        </div>
        <div className={`mt-2`}>
          လုပ်သားလိုအပ်ချက်:
          {laborNeed.planting && acre && (
            <strong>{laborNeed.planting * acre}ယောက်</strong>
          )}
        </div>
        <div className={`mt-2`}>
          တစ်ယောက်လုပ်အားခ:
          {wage.planting && acre && <strong>{wage.planting} ကျပ်</strong>}
        </div>
        <div className={`mt-2`}>
          လုပ်အားခစုစုပေါင်း:
          {wage.planting && laborNeed.planting && acre && (
            <strong>{wage.planting * laborNeed.planting * acre}</strong>
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
          <select
            className={`${classes.inputs} w-100`}
            onChange={handlePesticidePrice}
          >
            <option></option>
            {chemical?.map((item, index) => {
              if (item.ChemCategory === "pesticide") {
                return (
                  <option key={index} value={item.Price}>
                    {item.Brand}
                  </option>
                );
                // console.log(item.Brand);
              }
            })}
          </select>
        </div>
        <div className={`mt-2`}>
          လုပ်သားလိုအပ်ချက်:
          {laborNeed.pesticide && acre && (
            <strong>{laborNeed.pesticide * acre}ယောက်</strong>
          )}
        </div>
        <div className={`mt-2`}>
          တစ်ယောက်လုပ်အားခ:
          {wage.pesticide && acre && <strong>{wage.pesticide}ယောက်</strong>}
        </div>
        <div className={`mt-2`}>
          သီးနှံကာလတစ်ခုလုံးအတွက်လုပ်အားခ:
          {wage.pesticide && acre && (
            <strong>
              {wage.pesticide *
                laborNeed.pesticide *
                acre *
                jobFrequentUsage.pesticide}{" "}
              ကျပ်
            </strong>
          )}
        </div>
        <div className={`mt-2`}>
          သီးနှံကာလတစ်ခုလုံးအတွက်ဆေးတန်ဖိုး:
          {chemicalPrice.pesticide && acre && (
            <strong>{chemicalPrice.pesticide} ကျပ်</strong>
          )}
        </div>
        <div className={`mt-2`}>
          အသုံးပြုမှုအကြိမ်အရေအတွက်:
          {jobFrequentUsage && acre && (
            <strong>{jobFrequentUsage.pesticide} ကြိမ်</strong>
          )}
        </div>
        <div className={`mt-2`}>
          ကုန်ကျငွေ:
          {wage.pesticide && acre && chemicalPrice.pesticide && (
            <strong>
              {wage.pesticide *
                laborNeed.pesticide *
                acre *
                jobFrequentUsage.pesticide +
                chemicalPrice.pesticide}{" "}
              ကျပ်
            </strong>
          )}
        </div>
      </div>
      {acre && (
        <PesticideComponent
          chemical={chemical}
          laborNeed={laborNeed}
          wage={wage}
          chemicalPrice={chemicalPrice}
          jobFrequentUsage={jobFrequentUsage}
          handlePesticidePrice={handlePesticidePrice}
          acre={acre}
        />
      )}
      <div className={`${classes.herbicide} w-100`}>
        <div className={`${classes.boxes} me-5`}>
          <div className={`${classes.box_label} mb-2`}>ပေါင်းသတ်ဆေး</div>
          <select
            className={`${classes.inputs} w-100`}
            onChange={handleHerbicidePrice}
          >
            <option></option>
            {chemical?.map((item, index) => {
              if (item.ChemCategory === "herbicide") {
                return (
                  <option key={index} value={item.Price}>
                    {item.Brand}
                  </option>
                );
                // console.log(item.Brand);
              }
            })}
          </select>
        </div>
        <div className={`mt-2`}>
          လုပ်သားလိုအပ်ချက်:
          {laborNeed.herbicide && acre && (
            <strong>{laborNeed.herbicide * acre}ယောက်</strong>
          )}
        </div>
        <div className={`mt-2`}>
          တစ်ယောက်လုပ်အားခ:
          {wage.herbicide && acre && <strong>{wage.herbicide}ယောက်</strong>}
        </div>
        <div className={`mt-2`}>
          သီးနှံကာလတစ်ခုလုံးအတွက်လုပ်အားခ:
          {wage.herbicide && acre && (
            <strong>
              {wage.herbicide *
                laborNeed.herbicide *
                acre *
                jobFrequentUsage.herbicide}{" "}
              ကျပ်
            </strong>
          )}
        </div>
        <div className={`mt-2`}>
          သီးနှံကာလတစ်ခုလုံးအတွက်ဆေးတန်ဖိုး:
          {chemicalPrice.herbicide && acre && (
            <strong>{chemicalPrice.herbicide} ကျပ်</strong>
          )}
        </div>
        <div className={`mt-2`}>
          အသုံးပြုမှုအကြိမ်အရေအတွက်:
          {jobFrequentUsage && acre && (
            <strong>{jobFrequentUsage.herbicide} ကြိမ်</strong>
          )}
        </div>
        <div className={`mt-2`}>
          ကုန်ကျငွေ:
          {wage.herbicide && acre && chemicalPrice.herbicide && (
            <strong>
              {wage.herbicide *
                laborNeed.herbicide *
                acre *
                jobFrequentUsage.herbicide +
                chemicalPrice.herbicide}{" "}
              ကျပ်
            </strong>
          )}
        </div>
      </div>
      <div className={`${classes.fertilizer} w-100`}>
        <div className={`${classes.boxes} me-5`}>
          <div className={`${classes.box_label} mb-2`}>ဓါတ်မြေဩဇာ</div>
          <select
            className={`${classes.inputs} w-100`}
            onChange={handleFertilizerPrice}
          >
            <option></option>
            {chemical?.map((item, index) => {
              if (item.ChemCategory === "fertilizer") {
                return (
                  <option key={index} value={item.Price}>
                    {item.Brand}
                  </option>
                );
                // console.log(item.Brand);
              }
            })}
          </select>
        </div>
        <div className={`mt-2`}>
          လုပ်သားလိုအပ်ချက်:
          {laborNeed.fertilizer && acre && (
            <strong>{laborNeed.fertilizer * acre} ယောက်</strong>
          )}
        </div>
        <div className={`mt-2`}>
          တစ်ယောက်လုပ်အားခ:
          {wage.fertilizer && acre && <strong>{wage.fertilizer}ယောက်</strong>}
        </div>
        <div className={`mt-2`}>
          သီးနှံကာလတစ်ခုလုံးအတွက်လုပ်အားခ:
          {wage.fertilizer && acre && (
            <strong>
              {wage.fertilizer *
                laborNeed.fertilizer *
                acre *
                jobFrequentUsage.fertilizer}{" "}
              ကျပ်
            </strong>
          )}
        </div>
        <div className={`mt-2`}>
          အသုံးပြုမှုအကြိမ်အရေအတွက်:
          {jobFrequentUsage && acre && (
            <strong>{jobFrequentUsage.fertilizer} ကြိမ်</strong>
          )}
        </div>
        <div className={`mt-2`}>
          သီးနှံကာလတစ်ခုလုံးအတွက်ဆေးတန်ဖိုး:
          {chemicalPrice.fertilizer && acre && (
            <strong>{chemicalPrice.fertilizer} ကျပ်</strong>
          )}
        </div>
        <div className={`mt-2`}>
          ကုန်ကျငွေ:{" "}
          {wage.fertilizer && acre && chemicalPrice.fertilizer && (
            <strong>
              {wage.fertilizer *
                laborNeed.fertilizer *
                acre *
                jobFrequentUsage.fertilizer +
                chemicalPrice.fertilizer}{" "}
              ကျပ်
            </strong>
          )}
        </div>
      </div>
      <div className={`${classes.field_preparation} w-100`}>
        <div className={`${classes.boxes} me-5`}>
          <div className={`${classes.box_label} mb-2`}>မြေပြင်ဆင်စရိတ်</div>
        </div>
        <div className={`mt-2`}>
          စက်ပစ္စည်းငှားရမ်းခ:
          {wage.plowing && acre && <strong>{wage.plowing * acre}ကျပ်</strong>}
        </div>
        {/* <div className={`mt-2`}>ကုန်ကျငွေ: </div> */}
      </div>
      <div className={`${classes.harvest} w-100`}>
        <div className={`${classes.boxes} me-5`}>
          <div className={`${classes.box_label} mb-2`}>ရိတ်သိမ်းစရိတ်</div>
        </div>
        <div className={`mt-2`}>
          စက်ပစ္စည်းငှားရမ်းခ:
          {wage.harvesting && acre && (
            <strong>{wage.harvesting * acre} ကျပ်</strong>
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
              {wage.sowing * (laborNeed.sowing * acre) +
                wage.pesticide * (laborNeed.pesticide * acre) +
                wage.herbicide * (laborNeed.herbicide * acre) +
                wage.fertilizer * (laborNeed.fertilizer * acre)}{" "}
              ယောက်
            </strong>
          )}
        </div>
        <div className={`mt-2`}>
          အလုပ်သမားစုစုပေါင်း:{" "}
          {acre && (
            <strong>
              {(laborNeed.sowing +
                laborNeed.pesticide +
                laborNeed.herbicide +
                laborNeed.fertilizer) *
                acre}{" "}
              ယောက်
            </strong>
          )}
        </div>
        <div className={`mt-2`}>
          စက်ပစ္စည်းငှားရမ်းခစုစုပေါင်း:{" "}
          {acre && (
            <strong>{wage.plowing * acre + wage.harvesting * acre} ကျပ်</strong>
          )}
        </div>
        <div className={`mt-2`}>စုစုပေါင်းကုန်ကျစရိတ်: </div>
      </div>
    </div>
  );
};
export default Calculator;
