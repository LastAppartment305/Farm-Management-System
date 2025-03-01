import "./selectbox.style.css";

const SelectBox = ({ InputValue, name }) => {
  return (
    <div>
      <select
        class='form-select'
        aria-label='Default select example'
        onChange={InputValue}
        name={name}
      >
        <option value='Owner' selected>
          ပိုင်ရှင်
        </option>
        <option value='Admin'>Admin</option>
        <option value='Worker'>အလုပ်သမား</option>
      </select>
    </div>
  );
};
export default SelectBox;
