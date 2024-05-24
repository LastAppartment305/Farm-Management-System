import InputBox from "../../component/InputBox/InputBox.component";
import SelectBox from "../../component/select-box/selectbox.component";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./sign-up.style.css";
import { CircleX, EyeOff, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [data, setdata] = useState({
    name: "",
    phone: "",
    password: "",
    confirm_password: "",
    userRole: "Owner",
  });
  const checkPassword = useRef(null);
  const checkConfirmPassword = useRef(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [registered, setRegistered] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    console.log(registered);
  });

  //navigate to another route after register
  if (registered) {
    navigate("/login", { replace: true });
  }

  const handleClick = async () => {
    if (data.password === data.confirm_password) {
      console.log("it is the same password");
      try {
        const response = await axios.post("http://localhost:5000/signup", data);
        console.log("Response from Server", response.data);
        setRegistered(true);
      } catch (error) {
        console.log("Error at sending data", error);
      }
    } else {
      alert("the password are not the same");
    }
  };

  const ClearInputBoxForName = () => {
    setdata((prevData) => ({
      ...prevData,
      name: "",
    }));
  };

  const ClearInputBoxForPhone = () => {
    setdata((prevData) => ({
      ...prevData,
      phone: "",
    }));
  };

  return (
    <div className="main-wrapper">
      <div className="container-fluid p-0">
        <div className="screen-wrapper">
          <div className="form-container border">
            <div className="w-100">
              <p className="form-header">အကောင့်သစ်ပြုလုပ်ရန်</p>
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
                    typeProps={"text"}
                    name={"phone"}
                    holder={"ဖုန်းနံပါတ်"}
                    InputValue={handleChange}
                    value={data.phone}
                  />
                  <button
                    className="position-absolute clear-btn"
                    onClick={ClearInputBoxForPhone}
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
                    ref={checkPassword}
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
              <div className="row mt-3">
                <div className="position-relative">
                  <InputBox
                    typeProps={confirmPasswordVisible ? "text" : "password"}
                    name={"confirm_password"}
                    ref={checkConfirmPassword}
                    holder={"စကားဝှက်ပြန်ရိုက်"}
                    InputValue={handleChange}
                    value={data.confirm_password}
                  />
                  <button className="position-absolute clear-btn">
                    {confirmPasswordVisible ? (
                      <Eye
                        onClick={() => {
                          setConfirmPasswordVisible(false);
                        }}
                        className="circleX"
                      />
                    ) : (
                      <EyeOff
                        onClick={() => {
                          setConfirmPasswordVisible(true);
                        }}
                        className="circleX"
                      />
                    )}
                  </button>
                </div>
              </div>
              <div className="row mt-3">
                <SelectBox InputValue={handleChange} name={"userRole"} />
              </div>
              <div className="button-wrapper">
                <button
                  type="button"
                  className="btn btn-primary w-100 mt-5 submit-btn"
                  onClick={handleClick}
                >
                  စာရင်းသွင်းရန်
                </button>
              </div>
              <p className="d-flex justify-content-center mt-3">
                <Link to="/login">အကောင့်ရှိပီးသားလား</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignUp;
