import InputBox from "../../component/InputBox/InputBox.component";
import SelectBox from "../../component/select-box/selectbox.component";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./sign-up.style.css";
import { CircleX, EyeOff, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { z } from "zod";
import { toast, Toaster } from "react-hot-toast";

const SignUp = () => {
  const registerSchema = z.object({
    name: z.string().min(1, { message: "နာမည်လိုအပ်ပါသည်" }),
    phone: z
      .string()
      .regex(new RegExp(/^\+?9509\d{9,9}$/), "ဖုန်းနံပါတ် မှန်ကန်စွာဖြည့်ပါ"),
    password: z
      .string()
      .regex(
        new RegExp(/^[0-9 A-Z a-z]{6,}$/),
        "စကားဝှက်အနည်းဆုံး(၆)လုံးဖြည့်သွင်းပါ"
      ),
    confirm_password: z
      .string()
      .min(1, { message: "စကားဝှက်ပြန်ရိုက်ရန်လိုအပ်ပါသည်" }),
  });
  const [data, setdata] = useState({
    name: "",
    phone: "",
    password: "",
    confirm_password: "",
    NRC: "",
    Address: "",
    Age: "",
    userRole: "Owner",
  });
  const checkPassword = useRef(null);
  const checkConfirmPassword = useRef(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const validationErrors = useRef("");
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

  const handleClick = async (e) => {
    e.preventDefault();
    const result = registerSchema.safeParse(data);
    if (result.success) {
      if (data.password === data.confirm_password) {
        console.log("it is the same password");
        try {
          const nameRegularExpression = /^[^\d].*$/i;
          if (nameRegularExpression.test(data.name) == false) {
            toast.error(`အမည် ကိန်းဂဏာန်းမဖြစ်ရပါ`);
            // console.log("regulat expression work");
          } else {
            if (data.userRole === "Worker") {
              // console.log("Register User: ", data);
              const response = await axios.post(
                "http://localhost:5000/worker/createWorker",
                data
              );

              console.log("registered User: ", response);
              if (response.data.insertId) {
                navigate("/worker-login");
              }
            } else {
              const response = await axios.post(
                "http://localhost:5000/signup",
                data
              );
              console.log("Response from Server", response.data);
              if (response.data[0]) {
                if ("Name" in response.data[0] === false) {
                  if ("Phone_no" in response.data[0] === false) {
                  } else {
                    toast.error("အခြားဖုန်းနံပါတ်တစ်ခုရွေးချယ်ပါ");
                  }
                } else {
                  toast.error("အခြားနာမည်တစ်ခုရွေးချယ်ပါ");
                }
              } else {
                setRegistered(true);
              }
            }
          }
        } catch (error) {
          console.log("Error at sending data", error);
        }
      } else {
        toast.error("စကားဝှက်တူညီရန်လိုအပ်ပါသည်");
      }
    } else {
      validationErrors.current = result.error.formErrors.fieldErrors;
      // console.log(validationErrors.current);

      // console.log("This is validation errors: ", validationErrors.current);
      toast.error(Object.values(validationErrors.current)[0]);
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
  const ClearInputBoxForNRC = () => {
    setdata((prevData) => ({
      ...prevData,
      NRC: "",
    }));
  };
  const ClearInputBoxForAddress = () => {
    setdata((prevData) => ({
      ...prevData,
      Address: "",
    }));
  };
  const ClearInputBoxForAge = () => {
    setdata((prevData) => ({
      ...prevData,
      Age: "",
    }));
  };
  return (
    <div className='main-wrapper'>
      <Toaster toastOptions={{ duration: 3000 }} />
      <div className='container-fluid p-0'>
        <div className='screen-wrapper'>
          <form className='form-container border' onSubmit={handleClick}>
            <div className='w-100'>
              <p className='form-header'>အကောင့်သစ်ပြုလုပ်ရန်</p>
              <div className='row'>
                <div className='position-relative'>
                  <input
                    type='text'
                    name='name'
                    placeholder='အမည်'
                    onChange={handleChange}
                    value={data.name}
                  />
                  <a
                    className='position-absolute clear-btn'
                    onClick={ClearInputBoxForName}
                  >
                    <CircleX className='circleX' />
                  </a>
                </div>
              </div>
              <div className='row mt-3'>
                <div className='position-relative'>
                  <PhoneInput
                    name='phone'
                    country={"mm"}
                    value={data.phone}
                    onChange={(e) =>
                      setdata((prev) => ({
                        ...prev,
                        phone: e,
                      }))
                    }
                  />
                  <a
                    className='position-absolute clear-btn'
                    onClick={ClearInputBoxForPhone}
                  >
                    <CircleX className='circleX' />
                  </a>
                </div>
              </div>
              <div className='row mt-3'>
                <div className='position-relative'>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    name='password'
                    ref={checkPassword}
                    placeholder='စကားဝှက်'
                    onChange={handleChange}
                    value={data.password}
                  />
                  <a className='position-absolute clear-btn'>
                    {passwordVisible ? (
                      <Eye
                        onClick={() => {
                          setPasswordVisible(false);
                        }}
                        className='circleX'
                      />
                    ) : (
                      <EyeOff
                        onClick={() => {
                          setPasswordVisible(true);
                        }}
                        className='circleX'
                      />
                    )}
                  </a>
                </div>
              </div>
              <div className='row mt-3'>
                <div className='position-relative'>
                  <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    name='confirm_password'
                    ref={checkConfirmPassword}
                    placeholder='စကားဝှက်ထပ်မံရိုက်သွင်းပါ'
                    onChange={handleChange}
                    value={data.confirm_password}
                  />
                  <a className='position-absolute clear-btn'>
                    {confirmPasswordVisible ? (
                      <Eye
                        onClick={() => {
                          setConfirmPasswordVisible(false);
                        }}
                        className='circleX'
                      />
                    ) : (
                      <EyeOff
                        onClick={() => {
                          setConfirmPasswordVisible(true);
                        }}
                        className='circleX'
                      />
                    )}
                  </a>
                </div>
              </div>
              <div className='row mt-3'>
                <div className='position-relative'>
                  <input
                    type='text'
                    name='NRC'
                    placeholder='nrc'
                    onChange={handleChange}
                    value={data.NRC}
                  />
                  <a
                    className='position-absolute clear-btn'
                    onClick={ClearInputBoxForNRC}
                  >
                    <CircleX className='circleX' />
                  </a>
                </div>
              </div>
              <div className='row mt-3'>
                <div className='position-relative'>
                  <input
                    type='text'
                    name='Address'
                    placeholder='လိပ်စာ'
                    onChange={handleChange}
                    value={data.Address}
                  />
                  <a
                    className='position-absolute clear-btn'
                    onClick={ClearInputBoxForAddress}
                  >
                    <CircleX className='circleX' />
                  </a>
                </div>
              </div>
              <div className='row mt-3'>
                <div className='position-relative'>
                  <input
                    type='text'
                    name='Age'
                    placeholder='အသက်'
                    onChange={handleChange}
                    value={data.Age}
                  />
                  <a
                    className='position-absolute clear-btn'
                    onClick={ClearInputBoxForAge}
                  >
                    <CircleX className='circleX' />
                  </a>
                </div>
              </div>
              <div className='row mt-3'>
                <SelectBox InputValue={handleChange} name={"userRole"} />
              </div>

              <div className='button-wrapper'>
                <button
                  type='submit'
                  className='btn btn-primary w-100 mt-3 submit-btn'
                >
                  စာရင်းသွင်းရန်
                </button>
              </div>
              <p className='d-flex justify-content-center mt-3'>
                <Link to='/login'>အကောင့်ရှိပီးသားလား</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default SignUp;
