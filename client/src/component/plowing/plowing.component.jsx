import classes from "./plowing.module.css";
const PlowingComponent = ({ wage, acre }) => {
  return (
    <div className={`${classes.field_preparation} w-100`}>
      <div className={`${classes.boxes} me-5`}>
        <div className={`${classes.box_label} mb-2`}>မြေပြင်ဆင်စရိတ်</div>
      </div>
      <div className={`mt-2`}>
        စက်ပစ္စည်းငှားရမ်းခ:
        {wage.plowing && acre && <strong>{wage.plowing * acre}ကျပ်</strong>}
      </div>
      {/* <div className={`mt-2`}>ကုန်ကျငွေ: </div> */}
    </div>
  );
};
export default PlowingComponent;
