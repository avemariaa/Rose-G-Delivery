import { configureStore } from "@reduxjs/toolkit";
import bagSlice from "../store/MyBag/bagSlice";
import bagUiSlice from "../store/MyBag/bagUiSlice";

const store = configureStore({
  reducer: {
    bag: bagSlice.reducer,
    bagUi: bagUiSlice.reducer,
  },
});

export default store;
