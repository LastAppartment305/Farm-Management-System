import classes from "./main-page.module.css";
import logo from "../../assets/icon/fast-forward_6784625.png";
import farmer1 from "../../assets/icon/vecteezy_hardworking-3d-farmer-great-for-agriculture-or-farming_22484285.png";
import star from "../../assets/icon/star-sparkle-yellow-gradient.png";
import { Smile } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();
  const loginAsOwner = () => {
    console.log("login as owner");
    navigate("/login");
  };
  const loginAsWorker = () => {
    console.log("login as worker");
    navigate("/worker-login");
  };
  const goToSingUp = () => {
    navigate("/signup");
  };
  return (
    <div className={`${classes.page_wrapper}`}>
      <div className='container-fluid'>
        <div className={`${classes.nav}`}>
          <div className={`${classes.main_page_icon_wrapper}`}>
            <img src={logo} />
            <div className={`${classes.text_logo}`}>FieldLog</div>
          </div>
          <div className={`${classes.nav_button_wrapper}`}>
            <button className={`${classes.nav_btn}`} onClick={goToSingUp}>
              စတင်ရန်
            </button>
          </div>
        </div>
        <div className={`${classes.banner}`}>
          <div className={`${classes.farmer_icon_wrapper}`}>
            <img src={farmer1} />
          </div>
          <div className={`${classes.banner_content}`}>
            <img src={logo} />
            <div className={`${classes.banner_text_logo}`}>FieldLog</div>
          </div>
        </div>
        <div className={`${classes.features}`}>
          <div className={`${classes.owner}`}>
            <div className={`${classes.register}`} onClick={goToSingUp}>
              ပိုင်ရှင်အဖြစ်မှတ်ပုံတင်မည်
            </div>
            <div className={`${classes.login}`} onClick={loginAsOwner}>
              ပိုင်ရှင်အဖြစ်ဝင်ရောက်မည်
            </div>
          </div>
          <div className={`${classes.worker}`}>
            <div className={`${classes.register}`} onClick={goToSingUp}>
              အလုပ်သမားအဖြစ်မှတ်ပုံတင်မည်
            </div>
            <div className={`${classes.login}`} onClick={loginAsWorker}>
              အလုပ်သမားအဖြစ်ဝင်ရောက်ပါ
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MainPage;
