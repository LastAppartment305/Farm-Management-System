import classes from "./worker-login.module.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useEffect, useState } from "react";
import { auth } from "../../../firebase.config";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { usePost } from "../../../custom-hook/axios-post/axios-post";
import { toast, Toaster } from "react-hot-toast";
import OTPInput, { ResendOTP } from "otp-input-react";

const WorkerLogin = () => {
  const [data, setData] = useState({ phone: "" });
  const [showOTP, setShowOTP] = useState(false);
  const [OTP, setOTP] = useState("");
  //  const { postData } = usePost("http://localhost:5000/worker/send-otp");

  const onCaptchVerify = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            // ReCAPTCHA solved, allow signInWithPhoneNumber.
            onSignup();
          },
          "expired-callback": () => {
            // Response expired. Ask user to solve reCAPTCHA again.
            console.log("Captcha expired, please try again.");
          },
        }
      );
    }
  };

  const onSignup = () => {
    setShowOTP(true)
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;
    const formatPh = "+" + data.phone;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        console.log("OTP sent successfully!");
        toast.success("OTP sended successfully!");
      })
      .catch((error) => {
        console.error("Error during sign-in:", error);
      });
  };

  const onOTPVerify=()=>{
    window.confirmationResult.confirm(OTP)
    .then((result)=>{
      console.log(result);
      console.log("otp code is correct")
    })
    .catch((err)=>{
      console.log(err);
    })
  }
  console.log(showOTP)
  return (
    <div>
      <div id="recaptcha-container"></div>{" "}
      {/* Add this div for the RecaptchaVerifier */}
      <div className={classes.screen_wrapper}>
        <Toaster toastOptions={{ duration: 4000 }} />
        {!showOTP ? (
          <div className={classes.form_content}>
            <div className={classes.form_title}>
              နိုင်ငံရွေးချယ်၍ ဖုန်းနံပါတ်ဖြည့်သွင်းပါ
            </div>
            <div className="mt-3 w-100">
              <PhoneInput
                country={"mm"}
                value={data.phone}
                onChange={(phone) =>
                  setData((prev) => ({
                    ...prev,
                    phone: phone,
                  }))
                }
              />
            </div>
            <div className="button-wrapper">
              <button
                type="button"
                className={`w-100 mt-5 ${classes.submit_btn}`}
                onClick={onSignup}
              >
                OTP code ရယူရန်
              </button>
            </div>
          </div>
        ) : (
          <div className={classes.form_content}>
            <div className={classes.form_title}>
              OTP ဖြည့်သွင်းရန်
            </div>
            <div className="mt-3 w-100 d-flex justify-content-center">
              <OTPInput
                value={OTP}
                onChange={setOTP}
                autoFocus
                OTPLength={6}
                otpType="number"
                disabled={false}
                className="otp-container"
              />
            </div>
            <div className="button-wrapper">
              <button
                type="button"
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
