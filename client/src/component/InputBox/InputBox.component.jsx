import "./InputBox.style.css";
import { CircleX } from "lucide-react";

const InputBox = ({ typeProps, name, holder, InputValue, value }) => {
  return (
    <div className="">
      <input
        type={typeProps}
        name={name}
        placeholder={holder}
        required="required"
        className="inputbox"
        onChange={InputValue}
        autoComplete="off"
        value={value}
      />
    </div>
  );
};
export default InputBox;
