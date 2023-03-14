import { createContext, useReducer } from "react";
//SO this is the page where everything gets initialized once
//Therefore we used the Context to share the lat Long all across the APP

//Here we create the context first
export const StoreContext = createContext();

//Types for reducer, check docs to see how it works
export const ACTION_TYPE = {
  SET_LAT_LONG: "SET_LAT_LONG",
  SET_COFFEE_STORES: "SET_COFFEE_STORES",
};

//Reducer function
const storeReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPE.SET_LAT_LONG: {
      return { ...state, latLong: action.payload.latLong };
    }

    case ACTION_TYPE.SET_COFFEE_STORES: {
      return { ...state, coffeeStores: action.payload.coffeeStores };
    }

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

//Function to wrap the Context using value SET from Reducer
const StoreProvider = ({ children }) => {
  const initialState = {
    latLong: "",
    coffeeStores: [],
  };

  const [state, dispatch] = useReducer(storeReducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
