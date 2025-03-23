import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

// ✅ Load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("reduxState");
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (err) {
    return undefined;
  }
};

// ✅ Save state to localStorage on updates
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("reduxState", serializedState);
  } catch (err) {
    console.error("Error saving Redux state:", err);
  }
};

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: loadState(), // 🔥 Load Redux state on refresh
});

// ✅ Subscribe to store changes
store.subscribe(() => {
  saveState(store.getState()); // 🔥 Persist state on update
});

export default store;
