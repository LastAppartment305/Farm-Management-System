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
import FungicideComponent from "../../../component/fungicide/fungicide.component.jsx";
import point from "../../../assets/icon/location.svg";
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

const Calculator = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isPost, setIsPost] = useState(false);
  const [selectedOptionDetail, setSelectedOptionDetail] = useState(null);

  const [postPaddy, setPostPaddy] = useState(fallpaddy);
  const [chemical, setChemical] = useState(null);
  const [position, setposition] = useState({
    latitude: null,
    longitude: null,
  });
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
        fungicide: response.cropInfo.FungiLabor,
        harvesting: response.cropInfo.HarvestLabor,
        foliar_fertilizer: response.cropInfo.FoliarLabor,
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
        fungicide: response.overallInfo.find(
          (i) =>
            i.JobId ===
            response.job.find((data) => data.JobCategory === "fungicide")?.JobId
        )?.FrequentUsage,
        harvesting: response.overallInfo.find(
          (i) =>
            i.JobId ===
            response.job.find((data) => data.JobCategory === "harvesting")
              ?.JobId
        )?.FrequentUsage,
        foliar_fertilizer: response.overallInfo.find(
          (i) =>
            i.JobId ===
            response.job.find(
              (data) => data.JobCategory === "foliar_fertilizer"
            )?.JobId
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
        fungicide: response.overallInfo.find(
          (i) =>
            i.JobId ===
            response.job.find((data) => data.JobCategory === "fungicide")?.JobId
        )?.Wage,
        foliar_fertilizer: response.overallInfo.find(
          (i) =>
            i.JobId ===
            response.job.find(
              (data) => data.JobCategory === "foliar_fertilizer"
            )?.JobId
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
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        if (selectedOption === "paddy") {
          setPostPaddy((prev) => {
            const updateState = {
              ...prev,
              Cropname: selectedOption,
              Acre: acre,
              Latitude: position.coords.latitude,
              Longitude: position.coords.longitude,
              planting: {
                SeedCost: fetchData.cropInfo.SeedCost * acre,
                LaborNeed: laborNeed.planting * acre,
                WagePerLabor: wage.planting,
                TotalWagePerJob: wage.planting * laborNeed.planting * acre,
                TotalCostPerJob: plantingDetail.totalCost,
                FrequentUsage: null,
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
                FrequentUsage: jobFrequentUsage.pesticide,
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
                FrequentUsage: jobFrequentUsage.herbicide,
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
                FrequentUsage: jobFrequentUsage.fertilizer,
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
        console.log("Latitude: ", position.coords.latitude);
        console.log("Logitude: ", position.coords.longitude);
      });
    } else {
      console.log("Geolocation not supported");
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
  }, [laborNeed, wage, acre, chemicalPrice]);
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
  useEffect(() => {
    if (acre && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setposition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        console.log("Latitude: ", position.coords.latitude);
        console.log("Logitude: ", position.coords.longitude);
      });
    } else {
      console.log("Geolocation not supported");
    }
  }, [acre]);
  // console.log("fetchDataState", chemicalPrice.pesticide);

  const MapView = () => {
    let map = useMap();
    map.setView([position.latitude, position.longitude], map.getZoom());
    //Sets geographical center and zoom for the view of the map
    return null;
  };
  const customeIcon = L.icon({
    iconUrl: point,
    iconSize: [25, 35],
    iconAnchor: [5, 30],
  });
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
          {selectedOption === "paddy" && acre && (
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
          {selectedOption === "paddy" && acre && (
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
          {selectedOption === "paddy" && acre && (
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
          {selectedOption === "bean" && (
            <FungicideComponent
              chemical={chemical}
              laborNeed={laborNeed}
              wage={wage}
              acre={acre}
              chemicalPrice={chemicalPrice}
              jobFrequentUsage={jobFrequentUsage}
              handleHerbicidePrice={handleHerbicidePrice}
            />
          )}
          {selectedOption === "paddy" && acre && (
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
          {selectedOption && acre && (
            <PlowingComponent wage={wage} acre={acre} />
          )}
          {selectedOption && acre && (
            <HarvestingComponent wage={wage} acre={acre} />
          )}
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
                          wage.plowing * acre +
                          wage.harvesting * acre}{" "}
                        ကျပ်
                      </strong>
                    )}
                </div>
              </div>
            )}
        </div>
      </div>
      <div className={`${classes.column2} col-md-6`}>
        <div className={`${classes.decision_wrapper} bg-red`}>
          <div className={`mt-2`}>
            ခန့်မှန်းသီးနှံအထွက်နှုန်း:<strong>{acre * 100} တင်း</strong>
          </div>
          <div className={`mt-2`}>ယနေ့သီးနှံပေါက်ဈေး: </div>
          <div className={`mt-2`}>အသားတင်အမြတ်ငွေ:</div>
          <button className={`mt-2 btn btn-primary `} onClick={propose}>
            တင်မည်
          </button>
        </div>
        {/* <div className='mt-3'>
          {acre && position.latitude && position.longitude && (
            <MapContainer
              style={{ height: 600, width: 600 }}
              classsName='map'
              center={[position.latitude, position.longitude]}
              zoom={30}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> 
        contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              />
              <Marker
                icon={customeIcon}
                position={[position.latitude, position.longitude]}
              >
              </Marker>
              <MapView />
            </MapContainer>
          )}
        </div> */}
        <div className='mt-3'>
          {acre && (
            <iframe
              width='550'
              height='350'
              frameborder='0'
              style={{ border: 0 }}
              referrerpolicy='no-referrer-when-downgrade'
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDSegWYCf5Tzfc73v-s5KDm-OUIfn9UWME &q=${position.latitude},${position.longitude}&zoom=18
  &maptype=satellite`}
              allowfullscreen
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
};
export default Calculator;
