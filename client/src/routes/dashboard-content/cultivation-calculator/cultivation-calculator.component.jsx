import { useRef, useState } from "react";
import classes from "./cultivation-calculator.module.css";
import { usePost } from "../../../custom-hook/axios-post/axios-post.jsx";
// import crops from "./sample.json";

const Calculator = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptionDetail, setSelectedOptionDetail] = useState(null);
  // const pesticide = useRef({});
  const [pesticidePrice, setPesticidePrice] = useState();
  const [acre, setAcre] = useState(null);

  const { postData } = usePost(
    "http://localhost:5000/calculator/get-crop-overall-data"
  );

  const handleChange = async (e) => {
    const value = e.target.value;
    setSelectedOption(value);

    const detail = crops[value];
    setSelectedOptionDetail(detail);
  };
  console.log(pesticidePrice);
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
          လုပ်သားလိုအပ်ချက်:
          {selectedOptionDetail && acre && (
            <strong>
              {" "}
              {selectedOptionDetail.pesticide.labor * acre} ယောက်
            </strong>
          )}
        </div>
        <div className={`mt-2`}>
          တစ်ယောက်လုပ်အားခ:
          {selectedOptionDetail && acre && (
            <strong>{selectedOptionDetail.pesticide.wage} ကျပ်</strong>
          )}
        </div>
        <div className={`mt-2`}>
          ကုန်ကျငွေ:
          {selectedOptionDetail && acre && pesticidePrice && (
            <strong>
              {selectedOptionDetail.pesticide.labor *
                acre *
                selectedOptionDetail.pesticide.wage +
                pesticidePrice.price}
            </strong>
          )}
        </div>
      </div>
      <div className={`${classes.pesticide} w-100`}>
        <div className={`${classes.boxes} me-5`}>
          <div className={`${classes.box_label} mb-2`}>ပိုးသတ်ဆေး</div>
          <select
            className={`${classes.inputs} w-100`}
            onChange={(e) => {
              setPesticidePrice(
                selectedOptionDetail.pesticide.brand.find(
                  (item) => item.value === e.target.value
                )
              );
            }}
          >
            <option></option>
            {selectedOptionDetail &&
              selectedOptionDetail.pesticide.brand.map((item, index) => (
                <option key={index} value={item.value}>
                  {item.name}
                </option>
              ))}
          </select>
        </div>
        <div className={`mt-2`}>
          လုပ်သားလိုအပ်ချက်:
          {selectedOptionDetail && acre && (
            <strong>
              {" "}
              {selectedOptionDetail.pesticide.labor * acre} ယောက်
            </strong>
          )}
        </div>
        <div className={`mt-2`}>
          တစ်ယောက်လုပ်အားခ:
          {selectedOptionDetail && acre && (
            <strong>{selectedOptionDetail.pesticide.wage} ကျပ်</strong>
          )}
        </div>
        <div className={`mt-2`}>
          ကုန်ကျငွေ:
          {selectedOptionDetail && acre && pesticidePrice && (
            <strong>
              {selectedOptionDetail.pesticide.labor *
                acre *
                selectedOptionDetail.pesticide.wage +
                pesticidePrice.price}
            </strong>
          )}
        </div>
      </div>
      <div className={`${classes.herbicide} w-100`}>
        <div className={`${classes.boxes} me-5`}>
          <div className={`${classes.box_label} mb-2`}>ပေါင်းသတ်ဆေး</div>
          <select className={`${classes.inputs} w-100`}>
            <option></option>
            {selectedOptionDetail &&
              selectedOptionDetail.herbicide.brand.map((item, index) => (
                <option key={index} value={item.name}>
                  {item.name}
                </option>
              ))}
          </select>
        </div>
        <div className={`mt-2`}>
          လုပ်သားလိုအပ်ချက်:
          {selectedOptionDetail && acre && (
            <strong>
              {" "}
              {selectedOptionDetail.herbicide.labor * acre} ယောက်
            </strong>
          )}
        </div>
        <div className={`mt-2`}>
          တစ်ယောက်လုပ်အားခ:
          {selectedOptionDetail && acre && (
            <strong>{selectedOptionDetail.pesticide.wage} ကျပ်</strong>
          )}
        </div>
        <div className={`mt-2`}>ကုန်ကျငွေ: </div>
      </div>
      <div className={`${classes.fertilizer} w-100`}>
        <div className={`${classes.boxes} me-5`}>
          <div className={`${classes.box_label} mb-2`}>ဓါတ်မြေဩဇာ</div>
          <select className={`${classes.inputs} w-100`}>
            <option></option>
            {selectedOptionDetail &&
              selectedOptionDetail.fertilizer.brand.map((item, index) => (
                <option key={index} value={item.name}>
                  {item.name}
                </option>
              ))}
          </select>
        </div>
        <div className={`mt-2`}>
          လုပ်သားလိုအပ်ချက်:
          {selectedOptionDetail && acre && (
            <strong>
              {selectedOptionDetail.fertilizer.labor * acre} ယောက်
            </strong>
          )}
        </div>
        <div className={`mt-2`}>တစ်ယောက်လုပ်အားခ: </div>
        <div className={`mt-2`}>ကုန်ကျငွေ: </div>
      </div>
      <div className={`${classes.field_preparation} w-100`}>
        <div className={`${classes.boxes} me-5`}>
          <div className={`${classes.box_label} mb-2`}>မြေပြင်ဆင်စရိတ်</div>
        </div>
        <div className={`mt-2`}>
          စက်ပစ္စည်းငှားရမ်းခ:
          {selectedOptionDetail && acre && (
            <strong>
              {selectedOptionDetail.field_preparation.machinery_cost * acre}{" "}
              ကျပ်
            </strong>
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
          {selectedOptionDetail && acre && (
            <strong>
              {selectedOptionDetail.harvest.machinery_cost * acre} ကျပ်
            </strong>
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
        <div className={`mt-2`}>လုပ်အားခစုစုပေါင်း: </div>
        <div className={`mt-2`}>အလုပ်သမားစုစုပေါင်း: </div>
        <div className={`mt-2`}>စုစုပေါင်းကုန်ကျစရိတ်: </div>
      </div>
    </div>
  );
};
export default Calculator;
