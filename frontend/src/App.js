import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { combineReducers, configureStore } from "@reduxjs/toolkit";

/* import Register from "Register";
import AuthFeed from "AuthFeed"; */
import LogIn from "components/LogIn";
import Main from 'components/Main';
import NotFound from 'components/NotFound';

import thoughts from 'reducers/thoughts';
import user from 'reducers/user';

const reducer = combineReducers({
  user: user.reducer,
  thoughts: thoughts.reducer
});

const store = configureStore({ reducer });

export const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Welcome />} /> */}
          <Route path="/login" element={<LogIn />} />
          <Route path="/" element={<Main />} />
          {/* <Route path="/logininfo" element={<AuthFeed />} /> */}
          <Route path="/*" element={<NotFound />} />
          {/* <Route path="*" element={<Navigate to="/404" />} /> */}
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};