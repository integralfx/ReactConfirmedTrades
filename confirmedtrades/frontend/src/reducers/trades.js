import { GET_REDDITORS, GET_TRADES } from "../actions/types";

const initialState = {
  redditors: [],
  trades: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_REDDITORS:
      return {
        ...state,
        redditors: action.payload
      };

    case GET_TRADES:
      return {
        ...state,
        trades: action.payload
      }
    
    default:
      return state;
  }
}
