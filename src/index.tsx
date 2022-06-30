import ReactDOM from "react-dom"
import App from "./app/App"
import reportWebVitals from "./util/reportWebVitals"
import * as serviceWorker from "./util/serviceWorker"
import { Provider } from "react-redux"
import store from "./app/store";
import React from "react"

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App/>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root"),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
