import "./InputBox.style.css";
import { CircleX } from "lucide-react";

import { useForm, fieldValues } from "react-hook-form";

const InputBox = ({ typeProps, name, holder, InputValue, value }) => {
  return (
    <div className=''>
      <input
        type={typeProps}
        name={name}
        placeholder={holder}
        className='inputbox'
        onChange={InputValue}
        autoComplete='off'
        value={value}
        required
      />
    </div>
  );
};
export default InputBox;
