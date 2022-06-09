import { ColorModeScript } from "@chakra-ui/react"
import * as React from "react"
import ReactDOM from "react-dom"
import reportWebVitals from "./reportWebVitals"
import MainRouter from "./routing/MainRouter"
import * as serviceWorker from "./serviceWorker"

import { awsconfig } from "./config/awsconfig"
import { Amplify } from "aws-amplify"
import { withAuthenticator } from "@aws-amplify/ui-react"
import "@aws-amplify/ui-react/styles.css"

Amplify.configure(awsconfig)

const Root = () => (
  <React.StrictMode>
    <ColorModeScript />
    <MainRouter/>
  </React.StrictMode>
)

const AuthWrappedRoot = withAuthenticator(Root)

ReactDOM.render(<AuthWrappedRoot/>,
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
