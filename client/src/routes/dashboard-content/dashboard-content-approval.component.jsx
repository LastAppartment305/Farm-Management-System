// import classes from "./dashboard-content-approval.module.css";
import { useGet } from "../../custom-hook/axios-post/axios-post";
import axios from "axios";
import TotalExpenseSlip from "../../component/total-expense-slip/total-expense.component";

const AdminApproval = () => {
  const { response } = useGet("http://localhost:5000");
  return (
    <div>
      <TotalExpenseSlip />
    </div>
  );
};
export default AdminApproval;
