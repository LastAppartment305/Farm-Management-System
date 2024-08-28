import classes from "./foliar-fertilizer.module.css";
const FoliarFertilizer = ({
  chemical,
  laborNeed,
  wage,
  chemicalPrice,
  jobFrequentUsage,
  handleFoliarFertilizerPrice,
  acre,
}) => {
  return (
    <div className={`${classes.foliar_fertilizer} w-100`}>
      <div className={`${classes.boxes} me-5`}>
        <div className={`${classes.box_label} mb-2`}>ရွက်ဖြန်းအားဆေး</div>
        <select
          className={`${classes.inputs} w-100`}
          onChange={handleFoliarFertilizerPrice}
          value={chemicalPrice.foliar_fertilizer}
        >
          <option value={null}></option>
          {chemical?.map((item, index) => {
            if (item.ChemCategory === "foliar_fertilizer") {
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
          <strong>{jobFrequentUsage.foliar_fertilizer} ကြိမ်</strong>
        )}
      </div>
      <div className={`mt-2`}>
        လုပ်သားလိုအပ်ချက်:
        {laborNeed.foliar_fertilizer && acre && (
          <strong>{laborNeed.foliar_fertilizer * acre}ယောက်</strong>
        )}
      </div>
      <div className={`mt-2`}>
        တစ်ယောက်လုပ်အားခ:
        {wage.foliar_fertilizer && acre && (
          <strong>{wage.foliar_fertilizer}ယောက်</strong>
        )}
      </div>
      <div className={`mt-2`}>
        သီးနှံကာလတစ်ခုလုံးအတွက်လုပ်အားခ:
        {wage.foliar_fertilizer && acre && (
          <strong>
            {wage.foliar_fertilizer *
              laborNeed.foliar_fertilizer *
              acre *
              jobFrequentUsage.foliar_fertilizer}{" "}
            ကျပ်
          </strong>
        )}
      </div>
      <div className={`mt-2`}>
        သီးနှံကာလတစ်ခုလုံးအတွက်ဆေးတန်ဖိုး:
        {chemicalPrice.foliar_fertilizer !== null && acre && (
          <strong>{chemicalPrice.foliar_fertilizer * acre} ကျပ်</strong>
        )}
      </div>

      <div className={`mt-2`}>
        ကုန်ကျငွေ:
        {acre && chemicalPrice.foliar_fertilizer !== null && (
          <strong>
            {wage.foliar_fertilizer *
              laborNeed.foliar_fertilizer *
              acre *
              jobFrequentUsage.foliar_fertilizer +
              parseInt(chemicalPrice.foliar_fertilizer * acre)}{" "}
            ကျပ်
          </strong>
        )}
      </div>
    </div>
  );
};
export default FoliarFertilizer;
