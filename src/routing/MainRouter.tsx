import { BrowserRouter, Route, Routes } from "react-router-dom";
import FullRoutingLayout, { TopLevelRoutingLayout } from "./routingLayouts"
import IsLoggedInWrapper from "./IsLoggedInWrapper";
import { lazy, Suspense, useState } from "react";
import NotLoggedInWrapper from "./NotLoggedInWrapper";

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

  type LoadingWrapperProps = {
  };

  const LoadingWrapper: React.FC<LoadingWrapperProps> = ({children}) => (
    <Suspense fallback={<h1>Loading...</h1>}>
      {children}
    </Suspense>
  )

  return (  
    <BrowserRouter>
    <Routes>
      <Route path="/*" element={<TopLevelRoutingLayout/>}>
          <Route index element={<LoadingWrapper><Home/></LoadingWrapper>}/>
          <Route path="site" element={<FullRoutingLayout/>}>
            <Route path="about" element={<LoadingWrapper><About/></LoadingWrapper>}/>
            <Route path="contact" element={<LoadingWrapper><Contact/></LoadingWrapper>}/>
            <Route path="faq" element={<LoadingWrapper><Faq/></LoadingWrapper>}/>
            <Route path="glossary">
              <Route index element={<LoadingWrapper><Glossary/></LoadingWrapper>}/>
              <Route path="yiptionary" element={<LoadingWrapper><Yiptionary/></LoadingWrapper>}/>
            </Route>
            <Route path="legal" element={<LoadingWrapper><Legal/></LoadingWrapper>}/>
            <Route path="pricing" element={<LoadingWrapper><Pricing/></LoadingWrapper>}/>
            <Route path="privacy" element={<LoadingWrapper><Privacy/></LoadingWrapper>}/>
            <Route path="terms" element={<LoadingWrapper><Terms/></LoadingWrapper>}/>
            <Route path="testimonials" element={<LoadingWrapper><Testimonials/></LoadingWrapper>}/>
          </Route>
          <Route path="app" element={<IsLoggedInWrapper isLoggedIn={isLoggedIn}
                    isFirstVisit={isFirstVisit} setRedirect={setRedirect}/>}>
            <Route index element={<LoadingWrapper><Dashboard/></LoadingWrapper>}/>
            <Route path="create" element={<LoadingWrapper><Create/></LoadingWrapper>}/>
          </Route>
          <Route path="auth" element={<NotLoggedInWrapper isLoggedIn={isLoggedIn} redirect={redirect}/>}>
            <Route path="login" element={<LoadingWrapper><Login setIsLoggedIn={setIsLoggedIn}/></LoadingWrapper>}/>
            <Route path="signup" element={<LoadingWrapper><Signup/></LoadingWrapper>}/>
          </Route>
        </Route>          
      </Routes>      
    </BrowserRouter>
  )
}