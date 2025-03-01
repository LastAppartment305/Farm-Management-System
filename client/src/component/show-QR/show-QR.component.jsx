import classes from "./show-QR.module.css";
import { X } from "lucide-react";

const ShowQR = ({ imageSrc, handleClose }) => {
  return (
    <div>
      <div className={`${classes.delete_confirmation_wrapper}`}>
        <div className={`${classes.delete_confirmation_layout}`}>
          <X className={`${classes.close_btn}`} onClick={handleClose} />
          <div className={`${classes.image}`}>
            {imageSrc && (
              <img src={imageSrc} alt='Fetched from DB' className='mb-3' />
            )}
          </div>
          {/* <div className='mb-2'>
            <strong>ပြေစာဖြည့်သွင်းပါ</strong>
          </div>
          <input
            type='file'
            id='avatar'
            name='avatar'
            accept='image/png, image/jpeg'
            className={`${classes.image_input}`}
          />
          <div>
            <button className='btn btn-primary'>ဆက်လက်လုပ်ဆောင်မည်</button>
          </div> */}
        </div>
      </div>
    </div>
  );
};
export default ShowQR;
