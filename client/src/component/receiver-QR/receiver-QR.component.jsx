import classes from "./receiver-QR.module.css";

import { useState } from "react";

const ReceiverQR = ({ submit }) => {
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = () => {
    submit(image);
  };
  return (
    <div>
      <div className={`${classes.delete_confirmation_wrapper}`}>
        <div className={`${classes.delete_confirmation_layout}`}>
          <div className='mb-3'>
            <strong>ငွေလက်ခံ QR ထည့်သွင်းပါ</strong>
          </div>
          <input
            type='file'
            id='avatar'
            name='avatar'
            accept='image/png, image/jpeg'
            onChange={handleFileChange}
          />
          <div className={`${classes.button_group}`}>
            <button type='button' class='btn btn-light w-100 me-3'>
              မလုပ်တော့ပါ
            </button>
            <button
              type='button'
              class='btn btn-danger w-100'
              onClick={handleSubmit}
            >
              ဆက်လက်လုပ်ဆောင်မည်
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReceiverQR;
