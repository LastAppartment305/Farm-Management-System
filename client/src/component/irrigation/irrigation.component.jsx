import classes from "./irrigation.module.css";
const IrrigationComponent = ({ wage, acre, jobFrequentUsage }) => {
  return (
    <div className={`${classes.irrigation} w-100`}>
      <div className={`${classes.boxes} me-5`}>
        <div className={`${classes.box_label} mb-2`}>ရေသွင်းစရိတ်</div>
      </div>
      <div className={`mt-2`}>
        စက်ပစ္စည်းငှားရမ်းခ:
        {wage.irrigation && jobFrequentUsage.irrigation && acre && (
          <strong>{wage.irrigation} ကျပ်</strong>
        )}
      </div>
      <div className={`mt-2`}>
        အကြိမ်အရေအတွက်:
        {jobFrequentUsage.irrigation && acre && (
          <strong>{jobFrequentUsage.irrigation} ကြိမ်</strong>
        )}
      </div>
      <div className={`mt-2`}>
        ကုန်ကျငွေ:{" "}
        {wage.irrigation && jobFrequentUsage.irrigation && acre && (
          <strong>
            {wage.irrigation * acre * jobFrequentUsage.irrigation} ကျပ်
          </strong>
        )}
      </div>
    </div>
  );
};
export default IrrigationComponent;
