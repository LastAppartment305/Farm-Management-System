import DetailCard from "../../component/Dashboard-Card/detail-card.component";
import { Users, UserRoundPlus, X, CircleX, Eye, EyeOff } from "lucide-react";
import { useGet, usePost } from "../../custom-hook/axios-post/axios-post";
import "./dashboard-content.style.css";
import { useEffect, useRef, useState } from "react";
import InputBox from "../../component/InputBox/InputBox.component";
import SelectBox from "../../component/select-box/selectbox.component";
import Accordion from "react-bootstrap/Accordion";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import z from "zod";
import { toast, Toaster } from "react-hot-toast";
const DashboardContent = () => {
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

  const { response, loading } = useGet("http://localhost:5000/dashboard");
  //const userdata = response?.data.user;
  const [userlist, setuserlist] = useState([]);
  //const [isDelete, setisDelete] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const validationErrors = useRef("");
  const workerdata = response?.data.worker;
  const farmdata = response?.data.farm;
  const { postData } = usePost("http://localhost:5000/dashboard");

  const [data, setData] = useState({
    name: "",
    phone: "",
    password: "",
    confirm_password: "",
    userRole: "Owner",
  });

  //put to input data to useState "data"
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  //Delete user at onClick Delete
  const handleDelete = async (e) => {
    const x = await postData({ id: e });
    if (x) {
      const resAfterDelete = await axios.get("http://localhost:5000/dashboard");
      if (resAfterDelete) {
        setuserlist(resAfterDelete.data.user);
        console.log(
          "dashboard-content:handle delete function: ",
          resAfterDelete.data.user
        );
      }
    }
  };
  const [addUser, setAddUser] = useState(false);
  //sign up form pop up at onclick Add User at admin dashboard
  const handleClick = () => {
    setAddUser(!addUser);
  };
  //close pop up signin form admin dashboard
  const cancelAdd = () => {
    setAddUser(!addUser);
  };
  useEffect(() => {
    if (response) {
      setuserlist(response.data.user);
    }
  }, [response]);

  //Post user data to Server
  const handleAdd = async (e) => {
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
            const response = await axios.post(
              "http://localhost:5000/signup",
              data
            );
            console.log("Response from Server", response.data);
            setRegistered(true);
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

  const ClearInputBoxForPhone = () => {
    setData((prevData) => ({
      ...prevData,
      phone: "",
    }));
  };
  return (
    <div className='m-5 dashboard-body h-100'>
      <Toaster toastOptions={{ duration: 3000 }} />
      <div className='user-detail-card'>
        <div className='row g-2'>
          <div className='col-lg-4 col-md-6'>
            <DetailCard
              icon={Users}
              response={userlist?.length}
              cardTitle={"အလုပ်ရှင် စုစုပေါင်း"}
            />
          </div>
          <div className='col-lg-4 col-md-6'>
            <DetailCard
              icon={Users}
              response={workerdata?.length}
              cardTitle={"အလုပ်သမား စုစုပေါင်း"}
            />
          </div>
          <div className='col-lg-4 col-md-6'>
            <DetailCard
              icon={Users}
              response={farmdata?.length}
              cardTitle={"လယ် စုစုပေါင်း"}
            />
          </div>
        </div>
      </div>
      <Accordion>
        {userlist?.map((res, index) => (
          <Accordion.Item eventKey={`${index}`}>
            <Accordion.Header>
              <div className='d-flex'>
                <div className='me-5'>{index + 1}</div>
                <div className=''>{res.Name}</div>
              </div>
            </Accordion.Header>
            <Accordion.Body className='accordion-content'>
              <div className='fw-bold d-flex w-100 justify-content-between mb-2'>
                <div>အလုပ်ရှင် အချက်အလက်</div>
                <div>
                  <button
                    className='btn btn-danger me-3'
                    onClick={() => handleDelete(res.UserId)}
                  >
                    ဖျက်ရန်
                  </button>
                </div>
              </div>
              <table className='table table-striped w-100'>
                <tbody>
                  <tr>
                    <td>အမည်</td>
                    <td>{res.Name}</td>
                  </tr>
                  <tr>
                    <td>ဖုန်းနံပါတ်</td>
                    <td>{res.Phone_no}</td>
                  </tr>

                  <tr>
                    <td>လိပ်စာ</td>
                    <td>{res.User_role}</td>
                  </tr>
                </tbody>
              </table>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      <div className='add-worker-btn-wrapper d-flex align-items-center justify-content-end'>
        <a
          type='button'
          className='add-worker-btn d-flex align-items-center'
          onClick={handleClick}
        >
          <UserRoundPlus className='icon' />
          <div className='add-worker-btn-text'>လူအသစ်ထည့်ရန်</div>
        </a>
      </div>
      {addUser && (
        <div className='adduser-form-wrapper'>
          <form
            className='assign-worker-form position-relative'
            onSubmit={handleAdd}
          >
            <div className='cancel-btn'>
              <X onClick={cancelAdd} />
            </div>
            <div className='position-relative'>
              <div className='mt-3 w-100'>
                <input
                  type='text'
                  name='name'
                  placeholder={"အမည် ထည့်ရန်"}
                  onChange={handleChange}
                />
              </div>
              <div className='mt-3 w-100'>
                <div className='position-relative'>
                  <PhoneInput
                    name='phone'
                    country={"mm"}
                    value={data.phone}
                    onChange={(e) =>
                      setData((prev) => ({
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
              <div className='position-relative mt-3 w-100'>
                <input
                  type={passwordVisible ? "text" : "password"}
                  name='password'
                  placeholder={"လျှို့ဝှက်နံပါတ် ထည့်ရန်"}
                  onChange={handleChange}
                />
                <a className='position-absolute show-password'>
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
              <div className='position-relative mt-3 w-100'>
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  name='confirm_password'
                  placeholder={"လျှို့ဝှက်နံပါတ် ပြန်ထည့်ရန်"}
                  onChange={handleChange}
                />
                <a className='position-absolute show-password'>
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
              <div className='mt-3 w-100'>
                <SelectBox InputValue={handleChange} name={"userRole"} />
              </div>
            </div>
            <div className='d-flex mt-3 justify-content-end'>
              <button className='btn btn-primary' type='submit'>
                စာရင်းသွင်းရန်
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default DashboardContent;
