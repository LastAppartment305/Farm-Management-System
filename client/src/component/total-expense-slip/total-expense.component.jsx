import classes from "./total-expense.module.css";

const TotalExpenseSlip = () => {
  return (
    <div className={`${classes.expense_wrapper}`}>
      <div className={`${classes.owner_info}`}>
        <div className={`${classes.owner_info_wrapper} `}>
          <div>Date : 2.5.2024</div>
          <div>အမည် : Aung Kaung Myat</div>
          <div>မှတ်ပုံတင်အမှတ် : 14/WaKaMa(N)284872</div>
        </div>
      </div>
      <div className={`${classes.farm_info}`}>
        <div className={`${classes.farm_info_wrapper} `}>
          <div>ကွင်းအကျယ်အဝန်း : 1 ဧက</div>
          <div>စိုက်ပျိုးသီးနှံ : မိုးစပါး</div>
          <div>စိုက်ပျိုးကာလ : May-June မှ Sep-Oct ထိ</div>
        </div>
      </div>
      <div className={`${classes.expenses} mt-3`}>
        <div className={`${classes.expense_table_header} mb-3`}>
          အထွေထွေကုန်ကျစရိတ်
        </div>
        <table className={`${classes.expense_table} table table-bordered`}>
          <thead>
            <tr>
              <th scope='col'>အကြောင်းအရာ</th>
              <th scope='col'>ဆေးတန်ဖိုး</th>
              <th scope='col'>လူဉီးရေ</th>
              <th scope='col'>ကြာချိန်</th>
              <th scope='col'>တစ်ယောက်လုပ်အားခ</th>
              <th scope='col'>စုစုပေါင်း</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope='row'>ပေါင်းသတ်ခြင်း</th>
              <td>30000</td>
              <td>2</td>
              <td>1 ရက်</td>
              <td>4800</td>
              <td>39600</td>
            </tr>
            <tr>
              <th scope='row'>ပိုးသတ်ခြင်း</th>
              <td>30000</td>
              <td>2</td>
              <td>1 ရက်</td>
              <td>4800</td>
              <td>39600</td>
            </tr>
            <tr>
              <th scope='row'>ဓါတ်မြေဩဇာ</th>
              <td>40000</td>
              <td>2</td>
              <td>1 ရက်</td>
              <td>4800</td>
              <td>49600</td>
            </tr>
            <tr>
              <th scope='row'>မြေပြင်စရိတ်</th>
              <td>-</td>
              <td>1</td>
              <td>1 ရက်</td>
              <td>30000</td>
              <td>30000</td>
            </tr>
            <tr>
              <th scope='row'>ရိတ်သိမ်းစရိတ်</th>
              <td>-</td>
              <td>5</td>
              <td>1 ရက်</td>
              <td>5000</td>
              <td>25000</td>
            </tr>
            <tr>
              <th scope='row'>ရိတ်သိမ်းစရိတ်</th>
              <th scope='row'>1000000</th>
              <th scope='row'>12 ယောက်</th>
              <th scope='row'>-</th>
              <th scope='row'>-</th>
              <th scope='row'>183800</th>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={`${classes.total_expense_wrapper} mt-3`}>
        <div className={`${classes.total_expense} `}>
          <div> ဆေးတန်ဖိုးစုစုပေါင်း : 1000000 MMK</div>
          <div>လုပ်အားခစုစုပေါင်း : 183800</div>
          <div>အလုပ်သမားစုစုပေါင်း : 12 ယောက်</div>
        </div>
      </div>
    </div>
  );
};
export default TotalExpenseSlip;
