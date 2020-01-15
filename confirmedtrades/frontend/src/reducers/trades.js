import { GET_REDDITORS, GET_TRADES, GET_REDDITOR_TRADES } from "../actions/types";

const initialState = {
  redditors: [],
  trades: [],
  redditorTrades: []
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
      };
    
    case GET_REDDITOR_TRADES:
      return {
        ...state,
        redditorTrades: action.payload
      };

    default:
      return state;
  }
}
