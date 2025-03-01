import classes from "./planting.module.css";
const PlantingComponent = ({
  fetchData,
  clickRadioBtn1,
  clickRadioBtn2,
  laborNeed,
  wage,
  acre,
  plantingDetail,
  selectedOption,
}) => {
  return (
    <div className={`${classes.planting} w-100`}>
      <div className={`${classes.boxes} me-5`}>
        <div className={`${classes.box_label} mb-2`}>စိုက်ပျိုးစရိတ်</div>
      </div>
      {selectedOption === "paddy" && (
        <div className={`${classes.radio_btn_wrapper}`}>
          <div className='d-flex align-items-center'>
            <input
              type='radio'
              id='radio1'
              name='planting'
              className={`${classes.radio_btn}`}
              onChange={clickRadioBtn1}
              value={fetchData?.cropInfo.TransplantLabor}
            />
            <label for='radio1' className='me-5'>
              ပျိုးပင်ဖြင့်စိုက်ပျိုးခြင်း
            </label>
          </div>
          <div className='d-flex align-items-center'>
            <input
              type='radio'
              id='radio2'
              name='planting'
              className={`${classes.radio_btn}`}
              onChange={clickRadioBtn2}
              value={fetchData?.cropInfo.SeedingLabor}
            />
            <label for='radio2' className='me-5'>
              မျိုးစေ့ကြဲစိုက်ပျိုးခြင်း
            </label>
          </div>
        </div>
      )}
      <div className={`mt-2`}>
        မျိုးစရိတ်:
        {fetchData?.cropInfo.SeedCost && acre && (
          <strong>{fetchData.cropInfo.SeedCost * acre}ကျပ်</strong>
        )}
      </div>
      <div className={`mt-2`}>
        လုပ်သားလိုအပ်ချက်:
        {laborNeed.planting && acre && (
          <strong>{laborNeed.planting * acre}ယောက်</strong>
        )}
      </div>
      <div className={`mt-2`}>
        တစ်ယောက်လုပ်အားခ:
        {wage.planting && acre && <strong>{wage.planting} ကျပ်</strong>}
      </div>
      <div className={`mt-2`}>
        လုပ်အားခစုစုပေါင်း:
        {wage.planting && laborNeed.planting && acre && (
          <strong>{wage.planting * laborNeed.planting * acre}</strong>
        )}
      </div>
      <div className={`mt-2`}>
        ကုန်ကျငွေ:
        {plantingDetail.totalCost && acre && (
          <strong>{plantingDetail.totalCost}</strong>
        )}
      </div>
    </div>
  );
};
export default PlantingComponent;
