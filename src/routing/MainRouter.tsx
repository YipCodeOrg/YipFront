import Home from "../routes/Home"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "../routes/site/About"
import Glossary from "../routes/site/Glossary"
import Yiptionary from "../routes/site/glossary/Yiptionary"
import FullLayout from "../core/pageLayouts"
import Contact from "../routes/site/Contact"
import Pricing from "../routes/site/Pricing"
import Testimonials from "../routes/site/Testimonials"
import Faq from "../routes/site/Faq"
import Privacy from "../routes/site/Privacy"
import Legal from "../routes/site/Legal"
import Terms from "../routes/site/Terms"
import Dashboard from "../routes/app/Dashboard";
import IsLoggedInWrapper from "./IsLoggedInWrapper";
import { useState } from "react";
import NotLoggedInWrapper from "./NotLoggedInWrapper";
import Login from "../routes/auth/Login";
import Signup from "../routes/auth/Signup";

export default function MainRouter(){

  //TODO: Maybe read this from the store? For persistent login sessions
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [redirect, setRedirect] = useState("/app")

  //TODO: Probably use state
  const isFirstVisit = false

  return (
  <BrowserRouter>
      <Routes>
        <Route path="site" element={<FullLayout/>}>
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
        <Route path="app" element={<IsLoggedInWrapper isLoggedIn={isLoggedIn} isFirstVisit={isFirstVisit} setRedirect={setRedirect}/>}>
          <Route index element={<Dashboard/>}/>
        </Route>
        <Route path="auth" element={<NotLoggedInWrapper isLoggedIn={isLoggedIn} redirect={redirect}/>}>
          <Route path="login" element={<Login setIsLoggedIn={setIsLoggedIn}/>}/>
          <Route path="signup" element={<Signup/>}/>
        </Route>
        <Route path="/*" element={<FullLayout/>}>
            <Route index element={<Home/>}/>
        </Route>
      </Routes>      
    </BrowserRouter>
  )
}