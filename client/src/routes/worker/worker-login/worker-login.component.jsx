import classes from "./worker-login.module.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useContext, useEffect, useState, useRef } from "react";
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { usePost } from "../../../custom-hook/axios-post/axios-post";
import { toast, Toaster } from "react-hot-toast";
import OTPInput, { ResendOTP } from "otp-input-react";
import { authContext } from "../../../context/context";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase.config";
import { z } from "zod";
import { CircleX, Eye, EyeOff } from "lucide-react";

const WorkerLogin = () => {
  const validationSchema = z.object({
    name: z.string().min(1, { message: "နာမည်လိုအပ်ပါသည်" }),
    password: z.string().min(1, { message: "စကားဝှက်ထည့်ရန်လိုအပ်ပါသည်" }),
  });
  const { setRole, role } = useContext(authContext);
  const [data, setData] = useState({ name: "", password: "" });
  const [showOTP, setShowOTP] = useState(false);
  const [ids, setIds] = useState(null);
  const validationErrors = useRef("");
  const [OTP, setOTP] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const { postData } = usePost("http://localhost:5000/worker/send-token");
  const { postData: sendFarmIdAndWorkerId } = usePost(
    "http://localhost:5000/worker/send-auth"
  );
  const { verifyWorker, setVerifyWorker } = useContext(authContext);
  const loginSubmit = async (e) => {
    e.preventDefault();
    const result = validationSchema.safeParse(data);
    if (result.success) {
      const response = await postData(data);
      console.log(response);
      if (response != "") {
        localStorage.setItem("role", response);
        localStorage.setItem("username", data.name);
        setRole(response);
      } else {
        toast.error("မှန်ကန်မှုမရှိပါ");
      }
    } else {
      validationErrors.current = result.error.formErrors.fieldErrors;
      // console.log(validationErrors.current);

      // console.log("This is validation errors: ", validationErrors.current);
      toast.error(Object.values(validationErrors.current)[0]);
    }
  };

  const onOTPVerify = () => {
    window.confirmationResult
      .confirm(OTP)
      .then(async (result) => {
        const response = await sendFarmIdAndWorkerId(ids);
        if (response) {
          // setVerifyWorker(true);
          navigate("/worker");
        }
        console.log(response);
        console.log("otp code is correct");
      })
      .catch((err) => {
        console.log(err);
        toast.error("ကုဒ်နံပါတ်မမှန်ပါ");
      });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const ClearInputBoxForName = () => {
    setData((prevData) => ({
      ...prevData,
      name: "",
    }));
  };

  const goToHome = () => {
    navigate("/");
  };
  useEffect(() => {
    //console.log("login component", role);
    if (role === "worker") {
      // console.log("true");
      navigate("/dashboard");
    }
  });
  return (
    <div>
      <div id='recaptcha-container'></div>
      {/* Add this div for the RecaptchaVerifier */}
      <div className={classes.screen_wrapper}>
        <Toaster toastOptions={{ duration: 3000 }} />
        {!showOTP ? (
          <form className={classes.form_content} onSubmit={loginSubmit}>
            <div className={classes.form_title}>
              နိုင်ငံရွေးချယ်၍ ဖုန်းနံပါတ်ဖြည့်သွင်းပါ
            </div>
            <div className='mt-3 w-100'>
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
            </div>
            <div className='row mt-5'>
              <div className='position-relative'>
                <input
                  type={passwordVisible ? "text" : "password"}
                  name='password'
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
            <div className='button-wrapper'>
              <button
                type='submit'
                className={`w-100 mt-5 ${classes.submit_btn}`}
              >
                ဝင်ရောက်ရန်
              </button>
            </div>
            <div className={`${classes.go_to_home}`}>
              <a href='#' onClick={goToHome}>
                မူလစာမျက်နှာသို့သွားရန်
              </a>
            </div>
          </form>
        ) : (
          <div className={classes.form_content}>
            <div className={classes.form_title}>
              တစ်ခါသုံးကုဒ် ဖြည့်သွင်းရန်
            </div>
            <div className='mt-3 w-100 d-flex justify-content-center'>
              <OTPInput
                value={OTP}
                onChange={setOTP}
                autoFocus
                OTPLength={6}
                otpType='number'
                disabled={false}
                className='otp-container'
              />
            </div>
            <div className='button-wrapper'>
              <button
                type='button'
                className={`w-100 mt-5 ${classes.submit_btn}`}
                onClick={onOTPVerify}
              >
                ဝင်ရောက်ရန်
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerLogin;
