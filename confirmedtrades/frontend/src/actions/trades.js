import axios from "axios";

import { GET_REDDITORS } from "./types";

export const getRedditors = () => dispatch => {
  axios
    .get("/api/redditors/")
    .then(res => {
      dispatch({
        type: GET_REDDITORS,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};
