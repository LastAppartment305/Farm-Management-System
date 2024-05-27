import "./detail-card.style.css";
import { useGet } from "../../custom-hook/axios-post/axios-post";

const DetailCard = ({ icon: Icon, response, cardTitle }) => {
  //const { response, loading } = useGet("http://localhost:5000/dashboard");
  //console.log(response?.data.length);
  return (
    <div>
      <div class="card mb-2 p-3">
        <div class="d-flex">
          <div class="d-flex align-items-center">
            <div className="icon-wrapper">{Icon && <Icon />}</div>
          </div>
          <div class="d-flex">
            <div class="card-body">
              <h2 class="card-title">{response}</h2>
              <p class="card-text">
                <small class="text-muted">{cardTitle}</small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DetailCard;
