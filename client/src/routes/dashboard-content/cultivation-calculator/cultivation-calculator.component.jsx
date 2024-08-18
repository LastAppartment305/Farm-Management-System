import { useEffect, useRef, useState } from "react";
import classes from "./cultivation-calculator.module.css";
import { usePost } from "../../../custom-hook/axios-post/axios-post.jsx";
import crops from "./sample.json";
import fallpaddy from "./fallpaddy.json";
import PesticideComponent from "../../../component/pesticide/pesticide.component.jsx";
import PlantingComponent from "../../../component/planting/planting.component.jsx";
import HerbicideComponent from "../../../component/herbicide/herbicide.component.jsx";
import FertilizerComponent from "../../../component/fertilizer/fertilizer.component.jsx";
import PlowingComponent from "../../../component/plowing/plowing.component.jsx";
import HarvestingComponent from "../../../component/harvesting/harvesting.component.jsx";

const Calculator = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isPost, setIsPost] = useState(false);
  const [selectedOptionDetail, setSelectedOptionDetail] = useState(null);
  const [postPaddy, setPostPaddy] = useState(fallpaddy);
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
    totalCost: null,
  });
  const [pesticideDetail, setPesticideDetail] = useState({
    totalLaborNeed: null,
    totalLaborWage: null,
    chemicalCost: null,
    totalCost: null,
  });
  const [herbicideDetail, setHerbicideDetail] = useState({
    totalLaborNeed: null,
    totalLaborWage: null,
    chemicalCost: null,
    totalCost: null,
  });
  const [fertilizerDetail, setFertilizerDetail] = useState({
    totalLaborNeed: null,
    totalLaborWage: null,
    chemicalCost: null,
    totalCost: null,
  });
  const [totalExpense, setTotalExpense] = useState(null);
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
  // const [totalpesticideCost, setTotalPesticideCost] = useState();
  const [acre, setAcre] = useState(null);
  const [initialResult, setInitialResult] = useState(null);

  const { postData } = usePost(
    "http://localhost:5000/calculator/get-crop-overall-data"
  );
  const { postData: storePropose } = usePost(
    "http://localhost:5000/calculator/store-post"
  );

  const handleChange = async (e) => {
    const value = e.target.value === "" ? null : e.target.value;
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
      pesticide: e.target.value === "" ? null : parseInt(e.target.value),
    }));
  };
  const handleHerbicidePrice = (e) => {
    setChemicalPrice((prev) => ({
      ...prev,
      herbicide: e.target.value === "" ? null : parseInt(e.target.value),
    }));
  };
  const handleFertilizerPrice = (e) => {
    setChemicalPrice((prev) => ({
      ...prev,
      fertilizer: e.target.value === "" ? null : parseInt(e.target.value),
    }));
  };
  const propose = () => {
    if (selectedOption === "paddy") {
      setPostPaddy((prev) => {
        const updateState = {
          ...prev,
          Cropname: selectedOption,
          Acre: acre,
          Latitude: null,
          Longitude: null,
          planting: {
            SeedCost: fetchData.cropInfo.SeedCost * acre,
            LaborNeed: laborNeed.planting * acre,
            WagePerLabor: wage.planting,
            TotalWagePerJob: wage.planting * laborNeed.planting * acre,
            TotalCostPerJob: plantingDetail.totalCost,
          },
          pesticide: {
            ChemicalPrice: chemicalPrice.pesticide,
            LaborNeed: laborNeed.pesticide * acre,
            WagePerLabor: wage.pesticide,
            TotalLaborPerJob: null,
            TotalWagePerJob:
              wage.pesticide *
              laborNeed.pesticide *
              acre *
              jobFrequentUsage.pesticide,
            TotalCostPerJob:
              wage.pesticide *
                laborNeed.pesticide *
                acre *
                jobFrequentUsage.pesticide +
              parseInt(chemicalPrice.pesticide),
          },
          herbicide: {
            ChemicalPrice: chemicalPrice.herbicide,
            LaborNeed: laborNeed.herbicide * acre,
            WagePerLabor: wage.herbicide,
            TotalLaborPerJob: null,
            TotalWagePerJob:
              wage.herbicide *
              laborNeed.herbicide *
              acre *
              jobFrequentUsage.herbicide,
            TotalCostPerJob:
              wage.herbicide *
                laborNeed.herbicide *
                acre *
                jobFrequentUsage.herbicide +
              chemicalPrice.herbicide,
          },
          fertilizer: {
            ChemicalPrice: chemicalPrice.fertilizer,
            LaborNeed: laborNeed.fertilizer * acre,
            WagePerLabor: wage.fertilizer,
            TotalLaborPerJob: null,
            TotalWagePerJob:
              wage.fertilizer *
              laborNeed.fertilizer *
              acre *
              jobFrequentUsage.fertilizer,
            TotalCostPerJob:
              wage.fertilizer *
                laborNeed.fertilizer *
                acre *
                jobFrequentUsage.fertilizer +
              chemicalPrice.fertilizer,
          },
          plowing: {
            ChemicalPrice: null,
            LaborNeed: null,
            WagePerLabor: null,
            TotalLaborPerJob: null,
            TotalWagePerJob: null,
            TotalCostPerJob: wage.plowing * acre,
          },
          harvesting: {
            ChemicalPrice: null,
            LaborNeed: null,
            WagePerLabor: null,
            TotalLaborPerJob: null,
            TotalWagePerJob: null,
            TotalCostPerJob: wage.harvesting * acre,
          },
          TotalChemicalPrice:
            chemicalPrice.pesticide +
            chemicalPrice.herbicide +
            chemicalPrice.fertilizer,
          TotalWage:
            plantingDetail.totalLaborWage +
            pesticideDetail.totalLaborWage +
            herbicideDetail.totalLaborWage +
            fertilizerDetail.totalLaborWage,
          TotalMachineryCost: wage.plowing * acre + wage.harvesting * acre,
          TotalExpense:
            plantingDetail.totalCost +
            pesticideDetail.totalCost +
            herbicideDetail.totalCost +
            fertilizerDetail.totalCost +
            (wage.plowing * acre + wage.harvesting * acre),
        };
        console.log(updateState);
        return updateState;
      });
      setIsPost(true);
    }
  };
  useEffect(() => {
    console.log(postPaddy);
    const sendData = async () => {
      try {
        const response = await storePropose(postPaddy);
      } catch (error) {
        console.error("Error sending data:", error); // Handle any errors
      }
    };

    // Call the async function
    isPost && sendData();
  }, [postPaddy, isPost]);
  useEffect(() => {
    laborNeed.planting &&
      acre &&
      selectedOption &&
      setPlantingDetail((prev) => ({
        ...prev,
        totalLaborNeed: laborNeed.planting * acre,
        totalLaborWage: wage.planting * laborNeed.planting * acre,
        totalCost:
          wage.planting * laborNeed.planting * acre +
          fetchData.cropInfo.SeedCost * acre,
      }));
    setPesticideDetail((prev) => ({
      ...prev,
      totalLaborNeed: laborNeed.pesticide * acre,
      totalLaborWage:
        wage.pesticide *
        laborNeed.pesticide *
        acre *
        jobFrequentUsage.pesticide,
      chemicalCost: chemicalPrice.pesticide,
      totalCost:
        wage.pesticide *
          laborNeed.pesticide *
          acre *
          jobFrequentUsage.pesticide +
        chemicalPrice.pesticide,
    }));
    setHerbicideDetail((prev) => ({
      ...prev,
      totalLaborNeed: laborNeed.herbicide * acre,
      totalLaborWage:
        wage.herbicide *
        laborNeed.herbicide *
        acre *
        jobFrequentUsage.herbicide,
      chemicalCost: chemicalPrice.herbicide,
      totalCost:
        wage.herbicide *
          laborNeed.herbicide *
          acre *
          jobFrequentUsage.herbicide +
        chemicalPrice.herbicide,
    }));
    setFertilizerDetail((prev) => ({
      ...prev,
      totalLaborNeed: laborNeed.fertilizer * acre,
      totalLaborWage:
        wage.fertilizer *
        laborNeed.fertilizer *
        acre *
        jobFrequentUsage.fertilizer,
      chemicalCost: chemicalPrice.fertilizer,
      totalCost:
        wage.fertilizer *
          laborNeed.fertilizer *
          acre *
          jobFrequentUsage.fertilizer +
        chemicalPrice.fertilizer,
    }));
  }, [laborNeed, wage, acre]);
  useEffect(() => {
    acre &&
      plantingDetail.totalCost &&
      fertilizerDetail.totalCost &&
      pesticideDetail.totalCost &&
      herbicideDetail.totalCost &&
      setTotalExpense(
        plantingDetail.totalCost +
          pesticideDetail.totalCost +
          herbicideDetail.totalCost +
          fertilizerDetail.totalCost +
          (wage.plowing * acre + wage.harvesting * acre)
      );
  }, [
    plantingDetail.totalCost,
    fertilizerDetail.totalCost,
    pesticideDetail.totalCost,
    herbicideDetail.totalCost,
    acre,
  ]);
  // useEffect(()=>{
  //   setPesticideDetail((prev)=>({
  //     ...prev,
  //     to
  //   }))
  // },[])
  console.log("fetchDataState", chemicalPrice.pesticide);
  return (
    <div className={`${classes.row} row`}>
      <div className={`${classes.column1} col-md-6`}>
        <div className={`${classes.calculator_wrapper}`}>
          <div className={`${classes.crop}`}>
            <div className={`${classes.boxes} me-5`}>
              <div className={`${classes.box_label} mb-2`}>
                စိုက်ပျိုးသီးနှံ
              </div>
              <select
                className={`${classes.inputs} w-100`}
                onChange={handleChange}
              >
                <option value={null}></option>
                {crops.crop.map((item, index) => (
                  <option key={index} value={item.value}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={`${classes.boxes}`}>
              <div className={`${classes.box_label} mb-2`}>
                မြေဧကအကျယ်အဝန်း(ဧက)
              </div>
              <input
                className={`${classes.inputs}`}
                onChange={(e) => setAcre(e.target.value)}
              />
            </div>
          </div>
          {selectedOption && (
            <PlantingComponent
              fetchData={fetchData}
              clickRadioBtn1={clickRadioBtn1}
              clickRadioBtn2={clickRadioBtn2}
              laborNeed={laborNeed}
              wage={wage}
              acre={acre}
              plantingDetail={plantingDetail}
            />
          )}
          {selectedOption && (
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
          {selectedOption && (
            <HerbicideComponent
              chemical={chemical}
              laborNeed={laborNeed}
              wage={wage}
              acre={acre}
              chemicalPrice={chemicalPrice}
              jobFrequentUsage={jobFrequentUsage}
              handleHerbicidePrice={handleHerbicidePrice}
            />
          )}
          {selectedOption && (
            <FertilizerComponent
              chemical={chemical}
              laborNeed={laborNeed}
              wage={wage}
              acre={acre}
              chemicalPrice={chemicalPrice}
              jobFrequentUsage={jobFrequentUsage}
              handleFertilizerPrice={handleFertilizerPrice}
            />
          )}
          {selectedOption && <PlowingComponent wage={wage} acre={acre} />}
          {selectedOption && <HarvestingComponent wage={wage} acre={acre} />}
          {selectedOption !== null &&
            chemicalPrice.pesticide !== null &&
            chemicalPrice.herbicide !== null &&
            chemicalPrice.fertilizer !== null && (
              <div className={`${classes.total_expense} w-100`}>
                <div className={`${classes.boxes} me-5`}>
                  <div className={`${classes.box_label} mb-2`}>
                    စုစုပေါင်းကုန်ကျစရိတ်
                  </div>
                </div>
                <div className={`mt-2`}>
                  မျိုးစရိတ်:
                  {fetchData?.cropInfo.SeedCost && acre && (
                    <strong>{fetchData.cropInfo.SeedCost * acre}ကျပ်</strong>
                  )}
                </div>
                <div className={`mt-2`}>
                  ဆေးတန်ဖိုးစုစုပေါင်း:{" "}
                  {acre &&
                    chemicalPrice.pesticide &&
                    chemicalPrice.herbicide &&
                    chemicalPrice.fertilizer && (
                      <strong>
                        {chemicalPrice.pesticide +
                          chemicalPrice.herbicide +
                          chemicalPrice.fertilizer}{" "}
                        ယောက်
                      </strong>
                    )}{" "}
                </div>
                <div className={`mt-2`}>
                  လုပ်အားခစုစုပေါင်း:{" "}
                  {acre && (
                    <strong>
                      {plantingDetail.totalLaborWage +
                        pesticideDetail.totalLaborWage +
                        herbicideDetail.totalLaborWage +
                        fertilizerDetail.totalLaborWage}{" "}
                      ယောက်
                    </strong>
                  )}
                </div>
                {/* <div className={`mt-2`}>
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
        </div> */}
                <div className={`mt-2`}>
                  စက်ပစ္စည်းငှားရမ်းခစုစုပေါင်း:{" "}
                  {acre && (
                    <strong>
                      {wage.plowing * acre + wage.harvesting * acre} ကျပ်
                    </strong>
                  )}
                </div>
                <div className={`mt-2`}>
                  စုစုပေါင်းကုန်ကျစရိတ်:{" "}
                  {acre &&
                    selectedOption &&
                    plantingDetail.totalCost &&
                    fertilizerDetail.totalCost &&
                    pesticideDetail.totalCost &&
                    herbicideDetail.totalCost && (
                      <strong>
                        {plantingDetail.totalCost +
                          pesticideDetail.totalCost +
                          herbicideDetail.totalCost +
                          fertilizerDetail.totalCost +
                          (wage.plowing * acre + wage.harvesting * acre)}{" "}
                        ကျပ်
                      </strong>
                    )}
                </div>
              </div>
            )}
        </div>
      </div>
      <div className={`${classes.column2} col-md-6`}>
        {
          <div className={`${classes.decision_wrapper} bg-red`}>
            <div className={`mt-2`}>ခန့်မှန်းသီးနှံအထွက်နှုန်း:</div>
            <div className={`mt-2`}>ယနေ့သီးနှံပေါက်ဈေး:</div>
            <div className={`mt-2`}>အသားတင်အမြတ်ငွေ:</div>
            <button className={`mt-2 btn btn-primary `} onClick={propose}>
              တင်မည်
            </button>
          </div>
        }
      </div>
    </div>
  );
};
export default Calculator;
