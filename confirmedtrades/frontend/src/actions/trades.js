import axios from "axios";

import { GET_REDDITORS, GET_TRADES } from "./types";

export const getRedditors = (onSuccess=null) => dispatch => {
  axios
    .get("/api/redditors/")
    .then(res => {
      dispatch({
        type: GET_REDDITORS,
        payload: res.data
      });
      onSuccess();
    })
    .catch(err => console.log(err));
};

export const getTrades = () => dispatch => {
  axios
    .get("/api/trades/")
    .then(res => {
      dispatch({
        type: GET_TRADES,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};
