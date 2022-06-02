import { BrowserRouter, Route, Routes } from "react-router-dom";
import FullRoutingLayout from "./routingLayouts"
import IsLoggedInWrapper from "./IsLoggedInWrapper";
import { lazy, Suspense, useState } from "react";
import NotLoggedInWrapper from "./NotLoggedInWrapper";
import { BareLayout } from "../core/pageLayouts";

// Routes: lazy-loaded for performance
const Home = lazy(() => import("../routes/Home"))
const About = lazy(() => import("../routes/site/About"))
const Glossary = lazy(() => import("../routes/site/Glossary"))
const Yiptionary = lazy(() => import("../routes/site/glossary/Yiptionary"))
const Contact = lazy(() => import("../routes/site/Contact"))
const Pricing = lazy(() => import("../routes/site/Pricing"))
const Testimonials = lazy(() => import("../routes/site/Testimonials"))
const Faq = lazy(() => import("../routes/site/Faq"))
const Privacy = lazy(() => import("../routes/site/Privacy"))
const Legal = lazy(() => import("../routes/site/Legal"))
const Terms = lazy(() => import("../routes/site/Terms"))
const Dashboard = lazy(() => import("../routes/app/Dashboard"));
const Login = lazy(() => import("../routes/auth/Login"));
const Signup = lazy(() => import("../routes/auth/Signup"));
const Create = lazy(() => import("../routes/app/Create"));


export default function MainRouter(){

  //TODO: Maybe read this from the store? For persistent login sessions
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [redirect, setRedirect] = useState("/app")

  //TODO: Probably use state
  const isFirstVisit = false

  return (
  <Suspense fallback={<BareLayout>Loading...</BareLayout>}>
    <BrowserRouter>
        <Routes>
          <Route path="site" element={<FullRoutingLayout/>}>
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
            <Route path="app" element={<IsLoggedInWrapper isLoggedIn={isLoggedIn}
                    isFirstVisit={isFirstVisit} setRedirect={setRedirect}/>}>
            <Route index element={<Dashboard/>}/>
            <Route path="create" element={<Create/>}/>
          </Route>
          <Route path="auth" element={<NotLoggedInWrapper isLoggedIn={isLoggedIn} redirect={redirect}/>}>
            <Route path="login" element={<Login setIsLoggedIn={setIsLoggedIn}/>}/>
            <Route path="signup" element={<Signup/>}/>
          </Route>
          <Route path="/*" element={<FullRoutingLayout/>}>
              <Route index element={<Home/>}/>
          </Route>          
        </Routes>      
      </BrowserRouter>
    </Suspense>
  )
}