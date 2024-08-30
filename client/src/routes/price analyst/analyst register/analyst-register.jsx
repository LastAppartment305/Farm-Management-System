import classes from "./analyst-register.module.css";
import "react-phone-input-2/lib/style.css";
import { z } from "zod";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import { useState, useRef, useEffect, useContext } from "react";
import { CircleX, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authContext } from "../../../context/context";

const AnalystRegister = () => {
  const registerSchema = z.object({
    name: z.string().min(1, { message: "နာမည်လိုအပ်ပါသည်" }),
    NRC: z.string().min(1, { message: "မှတ်ပုံတင်ထည့်ရန်လိုအပ်ပါသည်" }),
    password: z
      .string()
      .regex(
        new RegExp(/^[0-9 A-Z a-z]{6,}$/),
        "စကားဝှက်အနည်းဆုံး(၆)လုံးဖြည့်သွင်းပါ"
      ),
    confirm_password: z
      .string()
      .min(1, { message: "စကားဝှက်ပြန်ရိုက်ရန်လိုအပ်ပါသည်" }),
    age: z
      .string()
      .regex(
        new RegExp(/^(1[89]|[2-6][0-9]|70)$/),
        "အသက် ၁၈နှစ် မှ ၇၀နှစ် အတွင်းဖြစ်ရမည်"
      ),
    phone: z
      .string()
      .regex(new RegExp(/^\+?9509\d{9,9}$/), "ဖုန်းနံပါတ် မှန်ကန်စွာဖြည့်ပါ"),

    address: z.string().min(1, { message: "လိပ်စာထည့်ရန်လိုအပ်ပါသည်" }),
  });

  const loginSchema = z.object({
    name: z.string().min(1, { message: "နာမည်လိုအပ်ပါသည်" }),
    password: z
      .string()
      .regex(
        new RegExp(/^[0-9 A-Z a-z]{6,}$/),
        "စကားဝှက်အနည်းဆုံး(၆)လုံးဖြည့်သွင်းပါ"
      ),
  });
  const [data, setdata] = useState({
    name: "",
    phone: "",
    password: "",
    confirm_password: "",
    NRC: "",
    address: "",
    age: "",
  });
  const { setRole, role } = useContext(authContext);
  const [isChecked, setIsChecked] = useState(false);
  const validationErrors = useRef("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleLongin = async (e) => {
    e.preventDefault();
    const result = loginSchema.safeParse(data);
    if (result.success) {
      try {
        const nameRegularExpression = /^[^\d].*$/i;
        if (nameRegularExpression.test(data.name) === false) {
          toast.error(`အမည် ကိန်းဂဏာန်းမဖြစ်ရပါ`);
          // console.log("regulat expression work");
        } else {
          // console.log(data);
          const response = await axios.post(
            "http://localhost:5000/priceAnalyst/login",
            { data }
          );

          if ("message" in response.data) {
            // console.log(response);
            toast.error(response.data.message);
          } else {
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("username", data.name);
            console.log(response.data.role);
            setRole(response.data.role);
          }
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      validationErrors.current = result.error.formErrors.fieldErrors;
      // console.log(validationErrors.current);

      // console.log("This is validation errors: ", validationErrors.current);
      toast.error(Object.values(validationErrors.current)[0]);
    }
  };
  const handleSignUp = async (e) => {
    e.preventDefault();
    const result = registerSchema.safeParse(data);
    if (result.success) {
      if (data.password === data.confirm_password) {
        console.log("it is the same password");
        try {
          const nameRegularExpression = /^[^\d].*$/i;
          if (nameRegularExpression.test(data.name) === false) {
            toast.error(`အမည် ကိန်းဂဏာန်းမဖြစ်ရပါ`);
            // console.log("regulat expression work");
          } else {
            // console.log(data);
            const response = await axios.post(
              "http://localhost:5000/priceAnalyst/register",
              { data }
            );
            if ("status" in response.data === true) {
              console.log(response);
              toast.success("အောင်မြင်ပါသည်");
              setdata({
                name: null,
              });
            } else {
              toast.error(response.data.message);
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
      address: "",
    }));
  };
  const ClearInputBoxForAge = () => {
    setdata((prevData) => ({
      ...prevData,
      age: "",
    }));
  };
  useEffect(() => {
    if (role === "analyst") {
      navigate("/dashboard/price-analyst/rainfed-paddy");
    }
  }, [role]);
  //   console.log(data);
  return (
    <div className={`${classes.main_wrapper}`}>
      <Toaster toastOptions={{ duration: 3000 }} />
      <div className={classes.main}>
        <input
          type='checkbox'
          id='chk'
          className={classes.checkbox}
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
          aria-hidden='true'
        />

        <div
          className={`${classes.login} ${isChecked ? classes.hideLogin : ""}`}
        >
          <form className={classes.form} onSubmit={handleLongin}>
            <label htmlFor='chk' aria-hidden='true'>
              ဝင်ရောက်ရန်
            </label>
            <div className='position-relative'>
              <input
                className={classes.input}
                type='text'
                name='name'
                placeholder='Username'
                onChange={handleChange}
                value={data.name}
                required=''
              />
              <a
                className='position-absolute clear-btn'
                onClick={ClearInputBoxForName}
              >
                <CircleX className={classes.circleX} />
              </a>
            </div>

            <div className='position-relative'>
              <input
                className={classes.input}
                type={passwordVisible ? "text" : "password"}
                name='password'
                placeholder='Password'
                onChange={handleChange}
                value={data.password}
                required=''
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
            <button type='submit'>ဝင်ရောက်မည်</button>
          </form>
        </div>

        <div
          className={`${isChecked ? classes.showRegister : classes.register}`}
        >
          <form className={classes.form} onSubmit={handleSignUp}>
            <label htmlFor='chk' aria-hidden='true'>
              စာရင်းသွင်းရန်
            </label>
            <div className='position-relative'>
              <input
                className={classes.input}
                type='text'
                name='name'
                placeholder='Username'
                onChange={handleChange}
                value={data.name}
                required=''
              />
              <a
                className='position-absolute clear-btn'
                onClick={ClearInputBoxForName}
              >
                <CircleX className={classes.circleX} />
              </a>
            </div>
            <div className='position-relative'>
              <input
                className={classes.input}
                type='text'
                name='NRC'
                placeholder='NRC'
                onChange={handleChange}
                value={data.NRC}
                required=''
              />
              <a
                className='position-absolute clear-btn'
                onClick={ClearInputBoxForNRC}
              >
                <CircleX className={classes.circleX} />
              </a>
            </div>
            <div className='position-relative'>
              <input
                className={classes.input}
                type={passwordVisible ? "text" : "password"}
                name='password'
                placeholder='Password'
                onChange={handleChange}
                value={data.password}
                required=''
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
            <div className='position-relative'>
              <input
                className={classes.input}
                type={confirmPasswordVisible ? "text" : "password"}
                name='confirm_password'
                placeholder='စကားဝှက်ပြန်လည်ဖြည့်သွင်းပါ'
                onChange={handleChange}
                value={data.confirm_password}
                required=''
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
            <div className='position-relative'>
              <input
                className={classes.input}
                type='text'
                name='age'
                placeholder='Age'
                onChange={handleChange}
                value={data.age}
                required=''
              />
              <a
                className='position-absolute clear-btn'
                onClick={ClearInputBoxForAge}
              >
                <CircleX className={classes.circleX} />
              </a>
            </div>
            <div className='position-relative'>
              <PhoneInput
                className={classes.phone}
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
                <CircleX className={classes.circleX} />
              </a>
            </div>
            <div className='position-relative'>
              <input
                className={classes.input}
                type='text'
                name='address'
                placeholder='Address'
                onChange={handleChange}
                value={data.address}
                required=''
              />
              <a
                className='position-absolute clear-btn'
                onClick={ClearInputBoxForAddress}
              >
                <CircleX className={classes.circleX} />
              </a>
            </div>
            <button type='submit'>စာရင်းသွင်းမည်</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AnalystRegister;
