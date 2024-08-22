import classes from "./harvesting-bean.module.css";
const HarvestingBean = ({ laborNeed, wage, jobFrequentUsage, acre }) => {
  return (
    <div className={`${classes.harvesting} w-100`}>
      <div className={`${classes.boxes} me-5`}>
        <div className={`${classes.box_label} mb-2`}>ရိတ်သိမ်းစရိတ်</div>
      </div>
      <div className={`mt-2`}>
        လုပ်သားလိုအပ်ချက်:
        {laborNeed.harvesting && acre && (
          <strong>{laborNeed.harvesting * acre} ယောက်</strong>
        )}
      </div>
      <div className={`mt-2`}>
        တစ်ယောက်လုပ်အားခ:
        {wage.harvesting && acre && <strong>{wage.harvesting} ယောက်</strong>}
      </div>
      <div className={`mt-2`}>
        သီးနှံကာလတစ်ခုလုံးအတွက်လုပ်အားခ:
        {wage.harvesting && acre && (
          <strong>
            {wage.harvesting *
              laborNeed.harvesting *
              acre *
              jobFrequentUsage.harvesting}{" "}
            ကျပ်
          </strong>
        )}
      </div>

      <div className={`mt-2`}>
        ကုန်ကျငွေ:
        {acre && (
          <strong>
            {wage.harvesting *
              laborNeed.harvesting *
              acre *
              jobFrequentUsage.harvesting}{" "}
            ကျပ်
          </strong>
        )}
      </div>
    </div>
  );
};
export default HarvestingBean;
