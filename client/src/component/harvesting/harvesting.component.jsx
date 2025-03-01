import classes from "./harvesting.module.css";
const HarvestingComponent = ({ wage, acre }) => {
  return (
    <div className={`${classes.harvest} w-100`}>
      <div className={`${classes.boxes} me-5`}>
        <div className={`${classes.box_label} mb-2`}>ရိတ်သိမ်းစရိတ်</div>
      </div>
      <div className={`mt-2`}>
        စက်ပစ္စည်းငှားရမ်းခ:
        {wage.harvesting && acre && (
          <strong>{wage.harvesting * acre} ကျပ်</strong>
        )}
      </div>
      {/* <div className={`mt-2`}>ကုန်ကျငွေ: </div> */}
    </div>
  );
};
export default HarvestingComponent;
