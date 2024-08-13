import classes from "./herbicide.module.css";
const HerbicideComponent = ({
  chemical,
  laborNeed,
  wage,
  acre,
  chemicalPrice,
  jobFrequentUsage,
  handleHerbicidePrice,
}) => {
  return (
    <div className={`${classes.herbicide} w-100`}>
      <div className={`${classes.boxes} me-5`}>
        <div className={`${classes.box_label} mb-2`}>ပေါင်းသတ်ဆေး</div>
        <select
          className={`${classes.inputs} w-100`}
          onChange={handleHerbicidePrice}
          value={chemicalPrice.herbicide}
        >
          <option value={0}></option>
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
        အသုံးပြုရမည့်ခန့်မှန်းအကြိမ်အရေအတွက်:
        {jobFrequentUsage && acre && (
          <strong>{jobFrequentUsage.herbicide} ကြိမ်</strong>
        )}
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
        {chemicalPrice.herbicide !== null && acre && (
          <strong>{chemicalPrice.herbicide} ကျပ်</strong>
        )}
      </div>

      <div className={`mt-2`}>
        ကုန်ကျငွေ:
        {wage.herbicide && acre && chemicalPrice.herbicide !== null && (
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
  );
};
export default HerbicideComponent;
