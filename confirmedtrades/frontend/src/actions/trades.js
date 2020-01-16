import axios from "axios";

import { GET_REDDITORS, GET_TRADES, GET_REDDITOR_TRADES } from "./types";

export const getRedditors = (onSuccess = null) => dispatch => {
  axios
    .get("/api/redditors/")
    .then(res => {
      dispatch({
        type: GET_REDDITORS,
        payload: res.data.sort((a, b) => {
          if (a.username < b.username) return -1;
          if (a.username > b.username) return 1;
          return 0;
        })
      });
      if (onSuccess) onSuccess();
    })
    .catch(err => console.log(err));
};

export const getTrades = (onSuccess = null) => dispatch => {
  axios
    .get("/api/trades/")
    .then(res => {
      dispatch({
        type: GET_TRADES,
        payload: res.data
      });
      if (onSuccess) onSuccess();
    })
    .catch(err => console.log(err));
};

export const getRedditorTrades = (username, onSuccess = null) => dispatch => {
  axios
    .get(`/api/redditors/${username}/trades`)
    .then(res => {
      dispatch({
        type: GET_REDDITOR_TRADES,
        payload: res.data
      });
      if (onSuccess) onSuccess();
    })
    .catch(err => console.log(err));
}