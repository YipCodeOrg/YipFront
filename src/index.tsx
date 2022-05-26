import { ColorModeScript } from "@chakra-ui/react"
import * as React from "react"
import ReactDOM from "react-dom"
import Home from "./routes/home"
import reportWebVitals from "./reportWebVitals"
import * as serviceWorker from "./serviceWorker"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "./routes/about"
import Glossary from "./routes/glossary"
import Yiptionary from "./routes/glossary/yiptionary"
import FullLayout from "./pageLayouts"
import Contact from "./routes/contact"
import Pricing from "./routes/pricing"
import Testimonials from "./routes/testimonials"
import Faq from "./routes/faq"
import Privacy from "./routes/privacy"
import Legal from "./routes/legal"
import Terms from "./routes/terms"

const Root = () => (
  <React.StrictMode>
    <ColorModeScript />
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<FullLayout/>}>
          <Route index element={<Home/>}/>
          <Route path="about" element={<About/>}/>
          <Route path="contact" element={<Contact/>}/>
          <Route path="faq" element={<Faq/>}/>
          <Route path="glossary">
            <Route index element={<Glossary/>}/>
            <Route path="yiptionary" element={<Yiptionary/>}/>
          </Route>
          <Route path="legal" element={<Legal/>}/>
          <Route path="pricing" element={<Pricing/>}/>
          <Route path="privacy" element={<Privacy/>}/>
          <Route path="terms" element={<Terms/>}/>
          <Route path="testimonials" element={<Testimonials/>}/>
        </Route>
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
