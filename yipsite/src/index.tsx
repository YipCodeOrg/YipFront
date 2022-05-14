import { ColorModeScript } from "@chakra-ui/react"
import * as React from "react"
import ReactDOM from "react-dom"
import Home from "./routes/home"
import reportWebVitals from "./reportWebVitals"
import * as serviceWorker from "./serviceWorker"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Blog from "./routes/blog"
import About from "./routes/about"

const Root = () => (
  <React.StrictMode>
    <ColorModeScript />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="blog" element={<Blog/>}/>
        <Route path="about" element={<About/>}/>
      </Routes>      
    </BrowserRouter>
  </React.StrictMode>
)

ReactDOM.render(<Root/>,
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
