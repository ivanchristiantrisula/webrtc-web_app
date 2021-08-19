import axios from "axios";
import { useEffect } from "react";

export default () => {
  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_BACKEND_URI +
          "/api/user/getFriendsRecommendation",
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return <> </>;
};
