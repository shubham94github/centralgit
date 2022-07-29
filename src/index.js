import "regenerator-runtime/runtime";
import React from "react";
import { render } from "react-dom";
import App from "./App";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";
import { rootReducer } from "./redux/rootReducer";
import createSagaMiddleware from "redux-saga";
import sagaWatcher from "./redux/rootSaga";
import { Router } from "react-router-dom";
import history from "./history";
import thunk from "redux-thunk";

import "./styles/global.scss";

const sagaMiddleware = createSagaMiddleware();
export const middlewares = [sagaMiddleware, thunk];

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middlewares))
);

sagaMiddleware.run(sagaWatcher);

render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root") || document.createElement("div")
);
