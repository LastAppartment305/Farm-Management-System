import classes from "./dashboard-content-report.module.css";
import { useGet } from "../../../custom-hook/axios-post/axios-post";
import Form from "react-bootstrap/Form";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ImageDownloader from "../../../component/image-downloader/image-downloader.component.jsx";
import croptype from "./crop.json";
const ReportContent = () => {
  const { response } = useGet("http://localhost:5000/getPosts");
  const [postList, setPostList] = useState(null);
  const [fetchedData, setFetchedData] = useState({
    imageList: null,
    apiInfo: null,
  });
  const [selectedPostId, setSelectedPostId] = useState(null);

  const getImageListAtFirstVisit = async (id) => {
    try {
      // console.log(selectedOption);
      //----------------------------get image list ------------------------------
      const imageList = await axios.post(
        "http://localhost:5000/report/getApproveImageList",
        {
          postid: id,
        }
      );
      //---------------------------get token from server -------------------------
      const getDownloadAuth = await axios.get(
        "http://localhost:5000/report/getDownloadAuth"
      );

      const reverse = imageList.data.reverse();
      setFetchedData({
        imageList: reverse,
        apiInfo: getDownloadAuth.data,
      });
    } catch (error) {
      console.log("mother fucking error happen again");
    }
  };
  const getPostDetail = async (id) => {
    // console.log("post Id", id);
    setSelectedPostId(id);
    await getImageListAtFirstVisit(id);
  };

  useEffect(() => {
    if (response) {
      const approvedPosts = response.data.filter(
        (post) => post.ApproveStatus === 1
      );
      setPostList(approvedPosts);
    }
  }, [response]);

  const groupPosts =
    postList &&
    postList.reduce((acc, post) => {
      const { UserId, ConfirmStatus } = post;
      if (!acc[UserId]) {
        acc[UserId] = { posts: [], NeedToAlert: false };
      }

      acc[UserId].posts.push(post);

      const hasNullStatus = acc[UserId].posts.some(
        (p) => p.ConfirmStatus === null
      );
      const hasConfirmedStatus = acc[UserId].posts.some(
        (p) => p.ConfirmStatus === 1 || p.ConfirmStatus === 0
      );
      acc[UserId].NeedToAlert =
        hasNullStatus || (hasNullStatus && hasConfirmedStatus);

      return acc;
    }, {});
  return (
    // <div>
    //   <div className={`${classes.select_box}`}>
    //     <Form.Select
    //       id='selected'
    //       aria-label={`Default select`}
    //       className={`${classes.select_farm}`}
    //       onChange={fetchPhoto}
    //     >
    //       {farmList?.map((res, index) => (
    //         <option value={index + 1} key={index} farmid={res.FarmId}>
    //           {res.Name}
    //         </option>
    //       ))}
    //     </Form.Select>
    //   </div>
    //   <div className={`${classes.image_group}`}>
    //     {fetchedData.imageList.length > 0 ? (
    //       fetchedData.imageList.map((i, index) => (
    //         <ImageDownloader
    //           downloadUrl={fetchedData.apiInfo.downloadUrl}
    //           downloadToken={
    //             fetchedData.apiInfo.downloadToken.authorizationToken
    //           }
    //           bucketName={"FarmManagement"}
    //           fileName={i.filename}
    //           date={i.date}
    //           description={i.description}
    //         />
    //       ))
    //     ) : (
    //       <div className={`${classes.empty_report}`}>ဓာတ်ပုံမရှိပါ</div>
    //     )}
    //   </div>
    // </div>
    <div className={`${classes.component_wrapper}`}>
      <div className={`${classes.left_side}`}>
        {postList &&
          postList.map((post, index) => (
            <div
              type='div'
              key={index}
              className={`${classes.post_button}`}
              onClick={() => getPostDetail(post.PostId)}
              style={{
                backgroundColor:
                  selectedPostId === post.PostId ? "#93ebf587" : "",
              }}
            >
              {/* {post.CropName} */}
              <div className={`${classes.btn_info_wrapper}`}>
                <div className='me-3'>
                  {
                    croptype.crop.find((crop) => crop.value === post.CropName)
                      .name
                  }
                </div>
                <div>{post.Acre} ဧက</div>
              </div>
              <div>
                {post.ApproveStatus === 1 && (
                  // <img
                  //   src={approve}
                  //   className={`${classes.success_icon} ms-3`}
                  // />
                  <div className={`${classes.success_icon} text-success ms-3`}>
                    approved
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
      <div className={`${classes.image_group}`}>
        {fetchedData.imageList !== null && fetchedData.imageList.length > 0
          ? fetchedData.imageList.map((i, index) => (
              <ImageDownloader
                imageId={i.ImageId}
                downloadUrl={fetchedData.apiInfo.downloadUrl}
                downloadToken={
                  fetchedData.apiInfo.downloadToken.authorizationToken
                }
                bucketName={"FarmManagement"}
                fileName={i.filename}
                date={i.date}
                description={i.description}
                confirmStatus={i.ConfirmStatus}
              />
              // <div></div>
            ))
          : fetchedData.imageList !== null && (
              <div className={`${classes.empty_report}`}>ဓာတ်ပုံမရှိပါ</div>
            )}
      </div>
    </div>
  );
};
export default ReportContent;
