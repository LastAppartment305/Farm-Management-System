import classes from "./fungicide.module.css";

const FungicideComponent = ({
  chemical,
  laborNeed,
  wage,
  chemicalPrice,
  jobFrequentUsage,
  handleFungicidePrice,
  acre,
}) => {
  return (
    <div className={`${classes.fungicide} w-100`}>
      <div className={`${classes.boxes} me-5`}>
        <div className={`${classes.box_label} mb-2`}>မှိုသတ်ဆေး</div>
        <select
          className={`${classes.inputs} w-100`}
          onChange={handleFungicidePrice}
          // value={chemicalPrice.fungicide}
        >
          <option value={null}></option>
          {chemical?.map((item, index) => {
            if (item.ChemCategory === "fungicide") {
              return (
                <option key={index} value={item.Price}>
                  {item.Brand}({item.MyanmarName})
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
          <strong>{jobFrequentUsage.fungicide} ကြိမ်</strong>
        )}
      </div>
      <div className={`mt-2`}>
        လုပ်သားလိုအပ်ချက်:
        {laborNeed.fungicide && acre && (
          <strong>{laborNeed.fungicide * acre}ယောက်</strong>
        )}
      </div>
      <div className={`mt-2`}>
        တစ်ယောက်လုပ်အားခ:
        {wage.fungicide && acre && <strong>{wage.fungicide}ယောက်</strong>}
      </div>
      <div className={`mt-2`}>
        သီးနှံကာလတစ်ခုလုံးအတွက်လုပ်အားခ:
        {wage.fungicide && acre && (
          <strong>
            {wage.fungicide *
              laborNeed.fungicide *
              acre *
              jobFrequentUsage.fungicide}{" "}
            ကျပ်
          </strong>
        )}
      </div>
      <div className={`mt-2`}>
        သီးနှံကာလတစ်ခုလုံးအတွက်ဆေးတန်ဖိုး:
        {chemicalPrice.fungicide !== null && acre && (
          <strong>{chemicalPrice.fungicide * acre} ကျပ်</strong>
        )}
      </div>

      <div className={`mt-2`}>
        ကုန်ကျငွေ:
        {acre && chemicalPrice.fungicide !== null && (
          <strong>
            {wage.fungicide *
              laborNeed.fungicide *
              acre *
              jobFrequentUsage.fungicide +
              parseInt(chemicalPrice.fungicide * acre)}{" "}
            ကျပ်
          </strong>
        )}
      </div>
    </div>
  );
};
export default FungicideComponent;
