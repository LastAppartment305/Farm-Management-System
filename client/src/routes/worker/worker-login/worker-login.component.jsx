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

const WorkerLogin = () => {
  const validationSchema = z.object({
    ownerPhone: z
      .string()
      .regex(
        new RegExp(/^\+?9509\d{9,9}$/),
        "ပိုင်ရှင်ဖုန်းနံပါတ် မှန်ကန်စွာဖြည့်ပါ"
      ),
    workerPhone: z
      .string()
      .regex(
        new RegExp(/^\+?9509\d{9,9}$/),
        "အလုပ်သမားဖုန်းနံပါတ် မှန်ကန်စွာဖြည့်ပါ"
      ),
  });
  const [data, setData] = useState({ ownerPhone: "", workerPhone: "" });
  const [showOTP, setShowOTP] = useState(false);
  const [ids, setIds] = useState(null);
  const validationErrors = useRef("");
  const [OTP, setOTP] = useState("");
  const navigate = useNavigate();
  const { postData } = usePost("http://localhost:5000/worker/check-assign");
  const { postData: sendFarmIdAndWorkerId } = usePost(
    "http://localhost:5000/worker/send-auth"
  );
  const { verifyWorker, setVerifyWorker } = useContext(authContext);

  // if (window.recaptchaVerifier) {
  //   window.recaptchaVerifier.render().then(function (widgetId) {
  //     window.grecaptcha.reset(widgetId);
  //   });
  // }
  const onCaptchVerify = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            // ReCAPTCHA solved, allow signInWithPhoneNumber.
          },
          "expired-callback": () => {
            // Response expired. Ask user to solve reCAPTCHA again.
            console.log("Captcha expired, please try again.");
          },
        }
      );
    }
  };

  const onSignup = async (e) => {
    e.preventDefault();
    const result = validationSchema.safeParse(data);
    if (result.success) {
      const response = await postData(data);
      if (response.farmid !== null) {
        console.log(response);
        setIds(response);

        onCaptchVerify();

        const appVerifier = window.recaptchaVerifier;
        const formatPh = "+" + data.workerPhone;
        signInWithPhoneNumber(auth, formatPh, appVerifier)
          .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            setShowOTP(true);
            console.log("OTP sent successfully!");
            toast.success("ကုဒ်ပေးပို့မှုအောင််မြင်ပါသည်");
          })
          .catch((error) => {
            // if (error.code === "auth/too-many-requests") {
            //   toast.error("အချိန်အနည်းငယ်ကြာမှပြန်လယ်စတင်ပါ");
            // } else {
            //   toast.error("တစ်ခုခုမှားယွင်းနေပါသည်");
            //   console.error("Error during sign-in:", error);
            // }
            console.log(error);
            toast.error("တစ်ခုခုမှားယွင်းနေပါသည်");
            // toast.error("too many request.");
          });
      } else {
        toast.error("သင့်အတွက်အလုပ်မရှိပါ");
        // console.log("not an assign worker");
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
      });
  };
  // useEffect(() => {
  //   if (verifyWorker) {
  //     navigate("/worker");
  //   }
  //   // return () => {
  //   //   setVerifyWorker(false);
  //   // };
  // }, [verifyWorker]);

  const goToHome = () => {
    navigate("/");
  };
  // console.log("verfyworker from worker-login: ", verifyWorker);
  return (
    <div>
      <div id='recaptcha-container'></div>
      {/* Add this div for the RecaptchaVerifier */}
      <div className={classes.screen_wrapper}>
        <Toaster toastOptions={{ duration: 3000 }} />
        {!showOTP ? (
          <form className={classes.form_content} onSubmit={onSignup}>
            <div className={classes.form_title}>
              နိုင်ငံရွေးချယ်၍ ဖုန်းနံပါတ်ဖြည့်သွင်းပါ
            </div>
            <div className='mt-3 w-100'>
              <div className={classes.phone_title}>
                ပိုင်ရှင် ဖုန်းနံပါတ်ဖြည့်သွင်းပါ
              </div>
              <PhoneInput
                name='ownerPhone'
                country={"mm"}
                value={data.ownerPhone}
                onChange={(phone) =>
                  setData((prev) => ({
                    ...prev,
                    ownerPhone: phone,
                  }))
                }
              />
            </div>
            <div className='mt-3 w-100'>
              <div className={classes.phone_title}>
                အလုပ်သမား ဖုန်းနံပါတ်ဖြည့်သွင်းပါ
              </div>
              <PhoneInput
                name='workerPhone'
                country={"mm"}
                value={data.phone}
                onChange={(phone) =>
                  setData((prev) => ({
                    ...prev,
                    workerPhone: phone,
                  }))
                }
              />
            </div>
            <div className='button-wrapper'>
              <button
                type='submit'
                className={`w-100 mt-5 ${classes.submit_btn}`}
              >
                တစ်ခါသုံးကုဒ် ရယူရန်
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

// import classes from "./worker-login.module.css";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import { useContext, useEffect, useState } from "react";
// import {
//   signInWithPhoneNumber,
//   RecaptchaVerifier,
//   getAuth,
// } from "firebase/auth";
// import { usePost } from "../../../custom-hook/axios-post/axios-post";
// import { toast, Toaster } from "react-hot-toast";
// import OTPInput from "otp-input-react";
// import { authContext } from "../../../context/context";
// import { useNavigate } from "react-router-dom";
// import { initializeApp } from "firebase/app"; // Import only what you need
// import { firebaseConfig } from "../../../firebase.config"; // Make sure this is correct

// // Initialize Firebase app
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// const WorkerLogin = () => {
//   const [data, setData] = useState({ ownerPhone: "", workerPhone: "" });
//   const [showOTP, setShowOTP] = useState(false);
//   const [ids, setIds] = useState(null);
//   const [OTP, setOTP] = useState("");
//   const navigate = useNavigate();
//   const { postData } = usePost("http://localhost:5000/worker/check-assign");
//   const { postData: sendFarmIdAndWorkerId } = usePost(
//     "http://localhost:5000/worker/send-auth"
//   );
//   const { verifyWorker, setVerifyWorker } = useContext(authContext);

//   useEffect(() => {
//     // Create and render RecaptchaVerifier instance

//     const recaptchaVerifier = new RecaptchaVerifier(
//       auth,
//       "recaptcha-container",
//       {
//         size: "invisible", // Set to 'normal' if you want the widget to be visible
//         callback: (response) => {
//           // Handle reCAPTCHA response
//           console.log("reCAPTCHA solved:", response);
//         },
//         "expired-callback": () => {
//           // Handle reCAPTCHA expiration
//           console.log("reCAPTCHA expired");
//         },
//       }
//     );

//     // Render the reCAPTCHA widget and store the widgetId
//     recaptchaVerifier
//       .render()
//       .then((widgetId) => {
//         window.recaptchaWidgetId = widgetId;
//         console.log(widgetId);
//       })
//       .catch((error) => {
//         console.error("Error rendering reCAPTCHA:", error);
//         throw error;
//       });

//     window.recaptchaVerifier = recaptchaVerifier;

//     return () => {
//       // Cleanup reCAPTCHA verifier on component unmount if necessary
//       recaptchaVerifier.clear();
//     };
//   }, []);

//   const onSignup = async () => {
//     const response = await postData(data);
//     if (response.farmid !== null) {
//       console.log(response);
//       setIds(response);
//       const appVerifier = window.recaptchaVerifier;
//       const formatPh = "+" + data.workerPhone;
//       await signInWithPhoneNumber(auth, formatPh, appVerifier)
//         .then((confirmationResult) => {
//           window.confirmationResult = confirmationResult;
//           setShowOTP(true);
//           console.log("OTP sent successfully!");
//           toast.success("ကုဒ်ပေးပို့မှုအောင်မြင်ပါသည်");
//         })
//         .catch((error) => {
//           console.error("Error during sign-in:", error);
//           toast.error("တစ်ခုခုမှားယွင်းနေပါသည်");
//         });
//     } else {
//       toast.error("ဝင်ရောက်ခွင့်မရှိပါ");
//     }
//   };

//   const onOTPVerify = () => {
//     window.confirmationResult
//       .confirm(OTP)
//       .then(async (result) => {
//         const response = await sendFarmIdAndWorkerId(ids);
//         if (response) {
//           setVerifyWorker(true);
//         }
//         console.log(response);
//         console.log("OTP code is correct");
//       })
//       .catch((err) => {
//         console.error(err);
//       });
//   };

//   useEffect(() => {
//     if (verifyWorker) {
//       navigate("/worker");
//     }
//   }, [verifyWorker]);

//   console.log("data from worker-login:", data);

//   return (
//     <div>
//       <div id='recaptcha-container'></div>
//       {/* Add this div for the RecaptchaVerifier */}
//       <div className={classes.screen_wrapper}>
//         <Toaster toastOptions={{ duration: 4000 }} />
//         {!showOTP ? (
//           <div className={classes.form_content}>
//             <div className={classes.form_title}>
//               နိုင်ငံရွေးချယ်၍ ဖုန်းနံပါတ်ဖြည့်သွင်းပါ
//             </div>
//             <div className='mt-3 w-100'>
//               <PhoneInput
//                 country={"mm"}
//                 value={data.ownerPhone}
//                 onChange={(phone) =>
//                   setData((prev) => ({
//                     ...prev,
//                     ownerPhone: phone,
//                   }))
//                 }
//               />
//             </div>
//             <div className='mt-3 w-100'>
//               <PhoneInput
//                 country={"mm"}
//                 value={data.workerPhone}
//                 onChange={(phone) =>
//                   setData((prev) => ({
//                     ...prev,
//                     workerPhone: phone,
//                   }))
//                 }
//               />
//             </div>
//             <div className='button-wrapper'>
//               <button
//                 type='button'
//                 className={`w-100 mt-5 ${classes.submit_btn}`}
//                 onClick={onSignup}
//               >
//                 တစ်ခါသုံးကုဒ် ရယူရန်
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className={classes.form_content}>
//             <div className={classes.form_title}>
//               တစ်ခါသုံးကုဒ် ဖြည့်သွင်းရန်
//             </div>
//             <div className='mt-3 w-100 d-flex justify-content-center'>
//               <OTPInput
//                 value={OTP}
//                 onChange={setOTP}
//                 autoFocus
//                 OTPLength={6}
//                 otpType='number'
//                 disabled={false}
//                 className='otp-container'
//               />
//             </div>
//             <div className='button-wrapper'>
//               <button
//                 type='button'
//                 className={`w-100 mt-5 ${classes.submit_btn}`}
//                 onClick={onOTPVerify}
//               >
//                 ဝင်ရောက်ရန်
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default WorkerLogin;
