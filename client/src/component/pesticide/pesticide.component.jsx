import classes from "./pesticide.module.css";

const PesticideComponent = ({
  chemical,
  laborNeed,
  wage,
  chemicalPrice,
  jobFrequentUsage,
  handlePesticidePrice,
  acre,
}) => {
  return (
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
        အသုံးပြုမှုအကြိမ်အရေအတွက်:
        {jobFrequentUsage && acre && (
          <strong>{jobFrequentUsage.pesticide} ကြိမ်</strong>
        )}
      </div>
      <div className={`mt-2`}>
        လုပ်သားလိုအပ်ချက်:
        {laborNeed.pesticide && acre && (
          <strong>
            {laborNeed.pesticide * acre * jobFrequentUsage.pesticide}ယောက်
          </strong>
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
  );
};
export default PesticideComponent;
