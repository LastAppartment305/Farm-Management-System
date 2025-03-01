import "./login-in.style.css";
import { useState, useContext, useEffect, useRef } from "react";
import { CircleX, Eye, EyeOff } from "lucide-react";
import { usePost } from "../../custom-hook/axios-post/axios-post";
import { useNavigate, Link } from "react-router-dom";
import { authContext } from "../../context/context";
import { toast, Toaster } from "react-hot-toast";
import { z } from "zod";

const Login = () => {
  const loginSchema = z.object({
    name: z.string().min(1, { message: "နာမည်ထည့်ရန်လိုအပ်ပါသည်" }),
    password: z.string().min(1, { message: "စကားဝှက်ထည့်ရန်လိုအပ်ပါသည်" }),
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  //const [loginrole, setloginRole] = useState(null);
  const [data, setdata] = useState({
    name: "",
    password: "",
  });
  const { setRole, role } = useContext(authContext); //manipulate data from context
  const validationErrors = useRef("");
  const navigate = useNavigate();
  const { postData } = usePost("http://localhost:5000/login");
  //console.log(response);
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

  const handleClick = async (e) => {
    e.preventDefault();
    const result = loginSchema.safeParse(data);
    if (result.success) {
      const nameRegularExpression = /^[^\d].*$/i;
      if (nameRegularExpression.test(data.name) === false) {
        toast.error(`အမည် ကိန်းဂဏာန်းမဖြစ်ရပါ`);
        // console.log("regulat expression work");
      } else {
        const res = await postData(data);
        if (res !== "") {
          localStorage.setItem("role", res);
          localStorage.setItem("username", data.name);
          setRole(res);
        } else {
          toast.error("မှန်ကန်မှုမရှိပါ");
        }
      }
    } else {
      validationErrors.current = result.error.formErrors.fieldErrors;
      console.log(validationErrors.current);

      // console.log("This is validation errors: ", validationErrors.current);
      toast.error(Object.values(validationErrors.current)[0]);
    }
    //console.log("login component:response data", res);
  };

  useEffect(() => {
    //console.log("login component", role);
    if (role === "admin") {
      console.log("true");
      navigate("/dashboard/admin");
    }
    if (role === "owner") {
      navigate("/dashboard/owner/assign-worker");
    }
  });
  return (
    <div>
      <div className='screen-wrapper m-0'>
        <Toaster toastOptions={{ duration: 4000 }} />
        <form className='form-wrapper' onSubmit={handleClick}>
          <p className='form-header'>အကောင့်ဝင်ရောက်ရန်</p>
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
              <input
                type={passwordVisible ? "text" : "password"}
                name='password'
                // ref={checkPassword}
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
              className='btn btn-primary w-100 mt-5 submit-btn'
            >
              ဝင်ရောက်ရန်
            </button>
          </div>
          <div className='sign-in-as-worker'>
            <Link to='/worker-login'>အလုပ်သမားအဖြစ် ဝင်ရောက်ရန်</Link>
          </div>
          <div className='create-new-account'>
            <Link to='/signup'>အကောင့်သစ်ပြုလုပ်ရန်</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
