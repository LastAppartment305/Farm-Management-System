import classes from "./approve-report-image.module.css";
import axios from "axios";
import { useGet } from "../../../custom-hook/axios-post/axios-post";
import { useState, useEffect, useTransition } from "react";
import approve from "../../../assets/icon/success.png";
import croptype from "../cultivation-calculator/sample.json";
import ImageDownloader from "../../../component/image-downloader/image-downloader.component";
const ApproveReports = () => {
  const { response } = useGet(
    "http://localhost:5000/dashboard/getPostListsToApprove",
    false
  );
  const [postList, setPostList] = useState(null);
  const [needToAlertPosts, setNeedToAlertPosts] = useState(null);
  const [isPending, startTransition] = useTransition();
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
        "http://localhost:5000/report/getreportlist",
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
    startTransition(async () => {
      setSelectedPostId(id);
      await getImageListAtFirstVisit(id);
    });
  };

  useEffect(() => {
    if (response) {
      // const approvedPosts = response.data.filter(
      //   (post) => post.ApproveStatus === 1
      // );
      console.log("response: ", response);
      setPostList(response?.data.list);
      setNeedToAlertPosts(response?.data.haveUnapprovedImagePosts);
    }
  }, [response]);
  //
  //
  //
  //--Warrning! groupPosts is designed to use in RED DOT NOTI ALERT.But it isn't used anymore.
  const groupPosts =
    postList &&
    postList.reduce((acc, post) => {
      const { PostId } = post;
      if (!acc[PostId]) {
        acc[PostId] = { posts: [], NeedToAlert: false };
      }

      acc[PostId].posts.push(post);

      const hasNullStatus = acc[PostId].posts.some(
        (p) => p.ConfirmStatus === null
      );
      const hasConfirmedStatus = acc[PostId].posts.some(
        (p) => p.ConfirmStatus === 1 || p.ConfirmStatus === 0
      );
      acc[PostId].NeedToAlert = hasNullStatus;

      return acc;
    }, {});
  // console.log("post list from admin report aprove: ", postList);
  return (
    <div className={`${classes.component_wrapper}`}>
      <div className={`${classes.left_side}`}>
        <div className={`${classes.left_side_header}`}></div>
        {postList !== null &&
        postList?.length > 0 &&
        Object.keys(groupPosts).length > 0 ? (
          Object.values(groupPosts).map((post, index) => (
            <div type='div' key={index} className={`${classes.post_body}`}>
              {/* {console.log("post: ", post)} */}
              {post.posts.map((i, index2) => (
                <div
                  className={`${classes.post_button}`}
                  style={{
                    backgroundColor:
                      selectedPostId === i.PostId ? "#e8d3c0" : "",
                  }}
                  onClick={() => getPostDetail(i.PostId)}
                  key={index2}
                >
                  {needToAlertPosts?.find((id) => id.PostId === i.PostId) && (
                    <div className={`${classes.red_dot}`}></div>
                  )}

                  <div className={`${classes.mini_post_header}`}>
                    <strong>{i.Name}</strong>
                    {i.ApproveStatus === 1 && (
                      <div
                        className={`${classes.success_icon} text-success ms-3`}
                      >
                        approved
                      </div>
                    )}
                  </div>
                  <div className={`${classes.mini_post_body}`}>
                    <div className='me-3'>
                      {
                        croptype.crop.find((crop) => crop.value === i.CropName)
                          .name
                      }
                    </div>
                    <div>{i.Acre} ဧက</div>
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className={`${classes.no_post}`}>no post</div>
        )}
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
            ))
          : fetchedData.imageList !== null && (
              <div className={`${classes.empty_report}`}>ဓာတ်ပုံမရှိပါ</div>
            )}
      </div>
    </div>
  );
};
export default ApproveReports;
