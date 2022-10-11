import App from "./App";
import rootReducers from "./store/reducer/index";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import React from "react";
import { Provider } from "react-redux";
import Amplify from 'aws-amplify';
import * as Config from './config';
import dotenv from 'dotenv'

dotenv.config()

Amplify.configure({
  Auth: {
    region: Config.AMPLIFY_AUTH_REGION,
    userPoolId: Config.AMPLIFY_AUTH_USER_POOL_ID,
    userPoolWebClientId: Config.AMPLIFY_AUTH_USER_POOL_CLIENT_ID,
    userPoolWebClientSecret: Config.AMPLIFY_AUTH_USER_POOL_CLIENT_SECRET,
  }
});


const store = createStore(rootReducers);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
