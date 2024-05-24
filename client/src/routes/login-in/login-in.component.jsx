import "./login-in.style.css";
import { useState } from "react";
import InputBox from "../../component/InputBox/InputBox.component";
import { CircleX, Eye, EyeOff } from "lucide-react";
import { usePost } from "../../custom-hook/axios-post/axios-post";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [data, setdata] = useState({
    name: "",
    password: "",
  });

  const { response, postData, loading } = usePost(
    "http://localhost:5000/login"
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const ClearInputBoxForName = () => {
    setdata((prevData) => ({
      ...prevData,
      name: "",
    }));
  };

  const handleClick = async () => {
    await postData(data);
  };
  return (
    <div>
      <div className="screen-wrapper m-0">
        <div className="form-wrapper">
          <p className="form-header">အကောင့်ဝင်ရောက်ရန်</p>
          <div className="row">
            <div className="position-relative">
              <InputBox
                typeProps={"text"}
                name={"name"}
                holder={"အမည်"}
                InputValue={handleChange}
                value={data.name}
              />
              <button
                className="position-absolute clear-btn"
                onClick={ClearInputBoxForName}
              >
                <CircleX className="circleX" />
              </button>
            </div>
          </div>
          <div className="row mt-3">
            <div className="position-relative">
              <InputBox
                typeProps={passwordVisible ? "text" : "password"}
                name={"password"}
                // ref={checkPassword}
                holder={"စကားဝှက်"}
                InputValue={handleChange}
                value={data.password}
              />
              <button className="position-absolute clear-btn">
                {passwordVisible ? (
                  <Eye
                    onClick={() => {
                      setPasswordVisible(false);
                    }}
                    className="circleX"
                  />
                ) : (
                  <EyeOff
                    onClick={() => {
                      setPasswordVisible(true);
                    }}
                    className="circleX"
                  />
                )}
              </button>
            </div>
          </div>
          <div className="button-wrapper">
            <button
              type="button"
              className="btn btn-primary w-100 mt-5 submit-btn"
              onClick={handleClick}
            >
              ဝင်ရောက်ရန်
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
