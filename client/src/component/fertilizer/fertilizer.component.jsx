import classes from "./fertilizer.module.css";

const FertilizerComponent = ({
  chemical,
  laborNeed,
  wage,
  acre,
  chemicalPrice,
  jobFrequentUsage,
  handleFertilizerPrice,
}) => {
  return (
    <div className={`${classes.fertilizer} w-100`}>
      <div className={`${classes.boxes} me-5`}>
        <div className={`${classes.box_label} mb-2`}>ဓါတ်မြေဩဇာ</div>
        <select
          className={`${classes.inputs} w-100`}
          onChange={handleFertilizerPrice}
          value={chemicalPrice.fertilizer}
        >
          <option value={null}></option>
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
        အသုံးပြုရမည့်ခန့်မှန်းအကြိမ်အရေအတွက်:
        {jobFrequentUsage && acre && (
          <strong>{jobFrequentUsage.fertilizer} ကြိမ်</strong>
        )}
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
        သီးနှံကာလတစ်ခုလုံးအတွက်ဆေးတန်ဖိုး:
        {chemicalPrice.fertilizer !== null && acre && (
          <strong>{chemicalPrice.fertilizer} ကျပ်</strong>
        )}
      </div>
      <div className={`mt-2`}>
        ကုန်ကျငွေ:{" "}
        {wage.fertilizer && acre && chemicalPrice.fertilizer !== null && (
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
  );
};
export default FertilizerComponent;
