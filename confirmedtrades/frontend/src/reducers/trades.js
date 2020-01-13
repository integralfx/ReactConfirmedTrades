import { GET_REDDITORS } from "../actions/types";

const initialState = {
  redditors: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_REDDITORS:
      return {
        ...state,
        redditors: action.payload
      };

    default:
      return state;
  }
}
