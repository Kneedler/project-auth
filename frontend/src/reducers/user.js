import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    username: null,
    accessToken: null,
    error: null,
    userId: null, 
    mode: "register"
  };

const user = createSlice({
    name: "user",
    initialState, 
    reducers: {
        setUserName: (store, action) => {
            store.username = action.payload;
        },
        setAccessToken: (store, action) => {
            store.accessToken = action.payload;
        },
        setUserId: (store, action) => {
            store.userId = action.payload;
        },
        setError: (store, action) => {
            store.error = action.payload;
        },
        setMode: (store, action) => {
            store.mode = action.payload;
          },
    }
})

export default user