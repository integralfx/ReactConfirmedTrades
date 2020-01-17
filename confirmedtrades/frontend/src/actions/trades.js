import axios from "axios";

import { GET_REDDITORS, GET_TRADES, GET_REDDITOR_TRADES } from "./types";

function encodeQueryData(data) {
  if (data === null) return '';

  const ret = [];
  for (let d in data) {
    if (data[d] === null) continue;
    ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
  }
  return ret.join('&');
}

export const getRedditors = (queryData = null, onSuccess = null) => dispatch => {
  const url = '/api/redditors?' + encodeQueryData(queryData);

  axios
    .get(url)
    .then(res => {
      dispatch({
        type: GET_REDDITORS,
        payload: res.data
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