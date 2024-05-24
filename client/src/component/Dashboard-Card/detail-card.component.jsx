import "./detail-card.style.css";
import { useGet } from "../../custom-hook/axios-post/axios-post";

const DetailCard = ({ icon: Icon, response }) => {
  //const { response, loading } = useGet("http://localhost:5000/dashboard");

  return (
    <div>
      <div class="card mb-2 p-3">
        <div class="d-flex">
          <div class="d-flex align-items-center">
            <div className="icon-wrapper">{Icon && <Icon />}</div>
          </div>
          <div class="d-flex">
            <div class="card-body">
              <h5 class="card-title">Total Users</h5>
              <p class="card-text">{response?.data.length}</p>
              <p class="card-text">
                <small class="text-muted">Last updated 3 mins ago</small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DetailCard;
