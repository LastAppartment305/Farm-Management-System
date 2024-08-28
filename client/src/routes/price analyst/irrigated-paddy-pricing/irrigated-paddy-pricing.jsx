import classes from "./irrigated-paddy-pricing.module.css";
import {
  useGet,
  usePost,
} from "../../../custom-hook/axios-post/axios-post.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import Labor from "./irragated-paddy-labor-wage.json";
const IrrigatedPaddy = () => {
  const [detail, setDetail] = useState(null);
  const [selectedChemicalCategory, setSelectedChemicalCategory] =
    useState(null);
  const [selectedChemicalBrand, setSelectedChemicalBrand] = useState(null);
  const [laborWage, setLaborWage] = useState(Labor);
  const [chemicalUpdateValue, setChemicalUpdateValue] = useState({
    CropId: 3,
    ChemCategory: null,
    Brand: null,
    Price: null,
  });
  const [newChemical, setNewChemical] = useState({
    ChemCategory: "pesticide",
    Brand: null,
    MyanmarName: null,
    Price: null,
  });
  const [machineryCost, setMachineryCost] = useState({
    harvesting: null,
    plowing: null,
    irrigation: null,
  });
  const { postData, response } = usePost(
    "http://localhost:5000/priceAnalyst/getRainfedPaddyInfo"
  );

  const jobIdMap = {
    pesticide: 1,
    herbicide: 2,
    fertilizer: 3,
    harvesting: 4,
    irrigation: 5,
    plowing: 7,
    tranplanting: 8,
    seeding: 9,
    foliar_fertilizer: 10,
  };
  const handleChemicalChange = (e) => {
    // console.log(e.target.value);
    setSelectedChemicalCategory(e.target.value);
    setChemicalUpdateValue((prev) => ({
      ...prev,
      ChemCategory: e.target.value,
      Brand: null,
      Price: null,
    }));
  };
  const handlePrice = (e) => {
    setChemicalUpdateValue((prev) => ({
      ...prev,
      Price: e.target.value,
    }));
  };
  const handleBrandChange = (e) => {
    setSelectedChemicalBrand(e.target.value);
    setChemicalUpdateValue((prev) => ({
      ...prev,
      Brand: e.target.options[e.target.selectedIndex].dataset.brand,
      Price: e.target.value,
    }));
  };
  const updateChemicalPrice = async () => {
    const result = await axios.post(
      "http://localhost:5000/priceAnalyst/updateChemicalPrice",
      {
        chemicalUpdateValue,
      }
    );
    if (result) {
      result.data.status === true && toast.success("အောင်မြင်ပါသည်");
      // console.log(result);
    }
  };
  const handleNewChemicalChange = (e) => {
    const { name, value } = e.target;
    setNewChemical((prev) => ({
      ...prev,
      ChemCategory: value,
    }));
  };
  const handleInsertNewChemical = (e) => {
    const { name, value } = e.target;
    setNewChemical((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const insertNewChemicalPrice = async () => {
    // console.log("new chemical", newChemical);
    const result = await axios.post(
      "http://localhost:5000/priceAnalyst/addNewChemical",
      { cropid: 3, newChemical }
    );
    if (result) {
      result.data === true && toast.success("အောင်မြင်ပါသည်");
      // console.log(result);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const postResult = await postData({ cropid: 3 });
      console.log(postResult);
      if (postResult) {
        setDetail(postResult);
        setSelectedChemicalCategory("pesticide");
        setChemicalUpdateValue((prev) => ({
          ...prev,
          ChemCategory: "pesticide",
        }));
        setLaborWage({
          pesticide: {
            laborNeed: postResult.cropInfo.PestiLabor,
            wagePerLabor: postResult.WageInfo.find(
              (i) => i.JobId === jobIdMap.pesticide
            )?.Wage,
            jobFrequentUsage: postResult.WageInfo.find(
              (i) => i.JobId === jobIdMap.pesticide
            )?.FrequentUsage,
          },
          herbicide: {
            laborNeed: postResult.cropInfo.HerbiLabor,
            wagePerLabor: postResult.WageInfo.find(
              (i) => i.JobId === jobIdMap.herbicide
            )?.Wage,
            jobFrequentUsage: postResult.WageInfo.find(
              (i) => i.JobId === jobIdMap.herbicide
            )?.FrequentUsage,
          },
          fertilizer: {
            laborNeed: postResult.cropInfo.FertiLabor,
            wagePerLabor: postResult.WageInfo.find(
              (i) => i.JobId === jobIdMap.fertilizer
            )?.Wage,
            jobFrequentUsage: postResult.WageInfo.find(
              (i) => i.JobId === jobIdMap.fertilizer
            )?.FrequentUsage,
          },
          tranplanting: {
            laborNeed: postResult.cropInfo.TransplantLabor,
            wagePerLabor: postResult.WageInfo.find(
              (i) => i.JobId === jobIdMap.tranplanting
            )?.Wage,
            jobFrequentUsage: postResult.WageInfo.find(
              (i) => i.JobId === jobIdMap.tranplanting
            )?.FrequentUsage,
          },
          seeding: {
            laborNeed: postResult.cropInfo.SeedingLabor,
            wagePerLabor: postResult.WageInfo.find(
              (i) => i.JobId === jobIdMap.seeding
            )?.Wage,
            jobFrequentUsage: postResult.WageInfo.find(
              (i) => i.JobId === jobIdMap.seeding
            )?.FrequentUsage,
          },
        });
        setMachineryCost({
          harvesting: postResult.WageInfo.find(
            (i) => i.JobId === jobIdMap.harvesting
          )?.Wage,
          plowing: postResult.WageInfo.find((i) => i.JobId === jobIdMap.plowing)
            ?.Wage,
          irrigation: postResult.WageInfo.find(
            (i) => i.JobId === jobIdMap.irrigation
          )?.Wage,
        });
      }
    };
    fetchData();
  }, []);
  const handleChange = (category, e) => {
    const { name, value } = e.target;
    setLaborWage((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [name]: parseInt(value),
      },
    }));
  };
  const updateMachineryPrice = async () => {
    const result = await axios.post(
      "http://localhost:5000/priceAnalyst/updateMachineryCost",
      { cropid: 3, machineryCost }
    );
    if (result) {
      result.data === true && toast.success("အောင်မြင်ပါသည်");
      // console.log(result);
    }
  };
  const updateLaborWage = async () => {
    const result = await axios.post(
      "http://localhost:5000/priceAnalyst/updateLaborWage",
      { cropid: 3, laborWage }
    );
    if (result) {
      result.data === true && toast.success("အောင်မြင်ပါသည်");
      // console.log(result);
    }
  };
  const handleMachinery = (e) => {
    const { name, value } = e.target;
    setMachineryCost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className={`${classes.main_wrapper}`}>
      <Toaster toastOptions={{ duration: 3000 }} />
      <div className={`${classes.chemical_wrapper}`}>
        <div className={`${classes.chemical_header}`}>
          ဆေးတန်ဖိုးများပြောင်းလဲရန်
        </div>
        <div className={`${classes.chemical_body}`}>
          <div className={`${classes.chemical_category}`}>
            <strong>ဆေးအမျိုးအစား</strong>
            <select
              className={`${classes.inputs}`}
              onChange={handleChemicalChange}
            >
              <option value='pesticide'>ပိုးသတ်ဆေး</option>
              <option value='herbicide'>ပေါင်းသတ်ဆေး</option>
              <option value='fertilizer'>ဓါတ်မြေဩဇာ</option>
            </select>
          </div>
          <div className={`${classes.chemical_brand}`}>
            <strong>ဘရန်းနှင့်ဆေးအမည်</strong>
            <select
              className={`${classes.inputs}`}
              onChange={handleBrandChange}
            >
              <option value={null}></option>
              {selectedChemicalCategory &&
                detail.ChemicalInfo?.map((chem, index) => {
                  if (chem.ChemCategory === selectedChemicalCategory) {
                    return (
                      <option
                        key={index}
                        value={chem.Price}
                        data-brand={chem.Brand}
                      >
                        {chem.Brand}({chem.MyanmarName})
                      </option>
                    );
                  }
                })}
            </select>
          </div>
          <div className={`${classes.chemical_price}`}>
            <strong>ဈေးနှုန်း</strong>
            <input
              type='number'
              className={`${classes.inputs}`}
              value={
                chemicalUpdateValue.Price === null
                  ? ""
                  : chemicalUpdateValue.Price
              }
              onChange={handlePrice}
            />
          </div>
        </div>
        <div className={`${classes.chemical_price_update_btn}`}>
          <button
            className={`${classes.chemical_btn}  btn btn-primary`}
            onClick={updateChemicalPrice}
          >
            ပြင်ဆင်မည်
          </button>
        </div>
      </div>
      <form
        className={`${classes.chemical_wrapper}`}
        onSubmit={insertNewChemicalPrice}
      >
        <div className={`${classes.chemical_header}`}>
          ဆေးအသစ်များထည့်သွင်းရန်
        </div>
        <div className={`${classes.new_chemical_body}`}>
          <div className={`${classes.chemical_category}`}>
            <div>
              <strong>ဆေးအမျိုးအစား</strong>
            </div>
            <select
              className={`${classes.inputs} mb-3`}
              onChange={handleNewChemicalChange}
            >
              <option value='pesticide'>ပိုးသတ်ဆေး</option>
              <option value='herbicide'>ပေါင်းသတ်ဆေး</option>
              <option value='fertilizer'>ဓါတ်မြေဩဇာ</option>
            </select>
          </div>
          <div className={`${classes.chemical_brand}`}>
            <div>
              <strong>ဘရန်း</strong>
            </div>
            <input
              type='text'
              name='Brand'
              className={`${classes.inputs} mb-3`}
              onChange={handleInsertNewChemical}
              required='required'
            />
          </div>
          <div className={`${classes.chemical_brand}`}>
            <div>
              <strong>ဆေးအမည်(မြန်မာဖြင့်)</strong>
            </div>
            <input
              type='text'
              name='MyanmarName'
              className={`${classes.inputs} mb-3`}
              onChange={handleInsertNewChemical}
              required='required'
            />
          </div>
          <div className={`${classes.chemical_price}`}>
            <div>
              <strong>ဈေးနှုန်း</strong>
            </div>
            <input
              type='number'
              name='Price'
              className={`${classes.inputs} mb-3`}
              onChange={handleInsertNewChemical}
              required='required'
            />
          </div>
        </div>
        <div className={`${classes.chemical_price_update_btn}`}>
          <button
            type='submit'
            className={`${classes.chemical_btn}  btn btn-primary`}
          >
            ထည့်မည်
          </button>
        </div>
      </form>
      <div className={`${classes.labor_wrapper}`}>
        <div className={`${classes.labor_header}`}>
          လုပ်သားလိုအပ်ချက်နှင့်လုပ်အားခများပြင်ဆင်ရန်
        </div>
        <div className={`mb-3`}>
          <strong>* တစ်ဧကအတွက်နှုန်းထားများကိုသာသတ်မှတ်ရမည်။</strong>
        </div>
        <div className={`${classes.labor_body}`}>
          <div className={`${classes.pesticide}`}>
            <div className={`${classes.pesticide_header}`}>
              <strong>ပိုးသတ်ခြင်း</strong>
            </div>
            <div className={`${classes.pesticide_body}`}>
              <div className={`${classes.individual_field}`}>
                <div>တစ်ယောက်လုပ်အားခ</div>
                <div>
                  <input
                    type='number'
                    name='wagePerLabor'
                    className={`${classes.inputs}`}
                    value={laborWage?.pesticide.wagePerLabor}
                    onChange={(e) => handleChange("pesticide", e)}
                  />
                </div>
              </div>
              <div className={`${classes.individual_field}`}>
                <div>လုပ်သားလိုအပ်ချက်</div>
                <div>
                  <input
                    type='number'
                    className={`${classes.inputs}`}
                    name='laborNeed'
                    value={laborWage?.pesticide.laborNeed}
                    onChange={(e) => handleChange("pesticide", e)}
                  />
                </div>
              </div>
              <div className={`${classes.individual_field}`}>
                <div>ဆေးအသုံးပြုရမည့်အကြိမ်</div>
                <div>
                  <input
                    type='number'
                    className={`${classes.inputs}`}
                    name='jobFrequentUsage'
                    value={laborWage?.pesticide.jobFrequentUsage}
                    onChange={(e) => handleChange("pesticide", e)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={`${classes.herbicide}`}>
            <div className={`${classes.herbicide_header}`}>
              <strong>ပေါင်းသတ်ခြင်း</strong>
            </div>
            <div className={`${classes.herbicide_body}`}>
              <div className={`${classes.individual_field}`}>
                <div>တစ်ယောက်လုပ်အားခ</div>
                <div>
                  <input
                    type='number'
                    className={`${classes.inputs}`}
                    name='wagePerLabor'
                    value={laborWage?.herbicide.wagePerLabor}
                    onChange={(e) => handleChange("herbicide", e)}
                  />
                </div>
              </div>
              <div className={`${classes.individual_field}`}>
                <div>လုပ်သားလိုအပ်ချက်</div>
                <div>
                  <input
                    type='number'
                    className={`${classes.inputs}`}
                    name='laborNeed'
                    value={laborWage?.herbicide.laborNeed}
                    onChange={(e) => handleChange("herbicide", e)}
                  />
                </div>
              </div>
              <div className={`${classes.individual_field}`}>
                <div>ဆေးအသုံးပြုရမည့်အကြိမ်</div>
                <div>
                  <input
                    type='number'
                    className={`${classes.inputs}`}
                    name='jobFrequentUsage'
                    value={laborWage?.herbicide.jobFrequentUsage}
                    onChange={(e) => handleChange("herbicide", e)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={`${classes.fertilizer}`}>
            <div className={`${classes.fertilizer_header}`}>
              <strong>ဓါတ်မြေဩဇာပက်ဖြန်းခြင်း</strong>
            </div>
            <div className={`${classes.fertilizer_body}`}>
              <div className={`${classes.individual_field}`}>
                <div>တစ်ယောက်လုပ်အားခ</div>
                <div>
                  <input
                    type='number'
                    className={`${classes.inputs}`}
                    name='wagePerLabor'
                    value={laborWage?.fertilizer.wagePerLabor}
                    onChange={(e) => handleChange("fertilizer", e)}
                  />
                </div>
              </div>
              <div className={`${classes.individual_field}`}>
                <div>လုပ်သားလိုအပ်ချက်</div>
                <div>
                  <input
                    type='number'
                    className={`${classes.inputs}`}
                    name='laborNeed'
                    value={laborWage?.fertilizer.laborNeed}
                    onChange={(e) => handleChange("fertilizer", e)}
                  />
                </div>
              </div>
              <div className={`${classes.individual_field}`}>
                <div>ဆေးအသုံးပြုရမည့်အကြိမ်</div>
                <div>
                  <input
                    type='number'
                    className={`${classes.inputs}`}
                    name='jobFrequentUsage'
                    value={laborWage?.fertilizer.jobFrequentUsage}
                    onChange={(e) => handleChange("fertilizer", e)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={`${classes.seeding}`}>
            <div className={`${classes.seeding_header}`}>
              <strong>မျိုးစေ့ကြဲစိုက်ပျိုးခြင်း</strong>
            </div>
            <div className={`${classes.seeding_body}`}>
              <div className={`${classes.individual_field}`}>
                <div>တစ်ယောက်လုပ်အားခ</div>
                <div>
                  <input
                    type='number'
                    className={`${classes.inputs}`}
                    name='wagePerLabor'
                    value={laborWage?.seeding.wagePerLabor}
                    onChange={(e) => handleChange("seeding", e)}
                  />
                </div>
              </div>
              <div className={`${classes.individual_field}`}>
                <div>လုပ်သားလိုအပ်ချက်</div>
                <div>
                  <input
                    type='number'
                    className={`${classes.inputs}`}
                    name='laborNeed'
                    value={laborWage?.seeding.laborNeed}
                    onChange={(e) => handleChange("seeding", e)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${classes.labor_update_btn}`}>
          <button
            className={`${classes.labor_btn}  btn btn-primary`}
            onClick={updateLaborWage}
          >
            ပြင်ဆင်မည်
          </button>
        </div>
      </div>
      <div className={`${classes.machine_wrapper}`}>
        <div className={`${classes.machine_header}`}>
          စက်အသုံးပြုရသောလုပ်ငန်းများအတွက်ဈေးနှုန်းပြုပြင်ရန်
        </div>
        <div className={`mb-3`}>
          <strong>* တစ်ဧကအတွက်နှုန်းထားများကိုသာသတ်မှတ်ရမည်။</strong>
        </div>
        <div className={`${classes.machine_body}`}>
          <div className={`${classes.individual_field}`}>
            <div>
              <strong>ရိတ်သိမ်းစရိတ်</strong>
            </div>
            <div>
              <input
                type='number'
                className={`${classes.inputs}`}
                name='harvesting'
                value={machineryCost?.harvesting}
                onChange={(e) => handleMachinery(e)}
              />
            </div>
          </div>
          <div className={`${classes.individual_field}`}>
            <div>
              <strong>မြေပြင်စရိတ်</strong>
            </div>
            <div>
              <input
                type='number'
                className={`${classes.inputs}`}
                name='plowing'
                value={machineryCost?.plowing}
                onChange={(e) => handleMachinery(e)}
              />
            </div>
          </div>
          <div className={`${classes.individual_field}`}>
            <div>
              <strong>ရေသွင်းစရိတ်</strong>
            </div>
            <div>
              <input
                type='number'
                className={`${classes.inputs}`}
                name='plowing'
                value={machineryCost?.irrigation}
                onChange={(e) => handleMachinery(e)}
              />
            </div>
          </div>
        </div>
        <div className={`${classes.machine_price_update_btn}`}>
          <button
            className={`${classes.chemical_btn}  btn btn-primary`}
            onClick={updateMachineryPrice}
          >
            ပြင်ဆင်မည်
          </button>
        </div>
      </div>
    </div>
  );
};
export default IrrigatedPaddy;
