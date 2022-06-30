import { BrowserRouter, Route, Routes } from "react-router-dom";
import { FullSiteRoutingLayout, TopLevelRoutingLayout } from "./routingLayouts"
import LoginWrapper from "./LoginWrapper";
import { lazy, Suspense} from "react";
import { useAppSelector } from "../../app/hooks";
import { selectIsLoggedIn } from "../../features/profile/profileSlice";

// Routes: lazy-loaded for performance
const Home = lazy(() => import("../../features/routes/Home"))
const About = lazy(() => import("../../features/routes/site/About"))
const Glossary = lazy(() => import("../../features/routes/site/Glossary"))
const Yiptionary = lazy(() => import("../../features/routes/site/glossary/Yiptionary"))
const Contact = lazy(() => import("../../features/routes/site/Contact"))
const Pricing = lazy(() => import("../../features/routes/site/Pricing"))
const Testimonials = lazy(() => import("../../features/routes/site/Testimonials"))
const Faq = lazy(() => import("../../features/routes/site/Faq"))
const Privacy = lazy(() => import("../../features/routes/site/Privacy"))
const Legal = lazy(() => import("../../features/routes/site/Legal"))
const Terms = lazy(() => import("../../features/routes/site/Terms"))
const Dashboard = lazy(() => import("../../features/routes/app/Dashboard"));
const Create = lazy(() => import("../../features/routes/app/Create"));

type LoadingWrapperProps = {
};

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({children}) => (
  <Suspense fallback={<h1>Loading...</h1>}>
    {children}
  </Suspense>
)

type MainRouterProps = {
  setIsSigedUp: (_: boolean) => void
  isSignedUp: boolean
}

const MainRouter: React.FC<MainRouterProps> = ({setIsSigedUp, isSignedUp}) => {  
  const isLoggedIn = useAppSelector(selectIsLoggedIn)  
  return (  
      <BrowserRouter>
      <Routes>
        <Route path="/*" element={<TopLevelRoutingLayout/>}>
            <Route index element={<LoadingWrapper><Home isLoggedIn={isLoggedIn} isSignedUp={isSignedUp} setIsSigedUp={setIsSigedUp}/></LoadingWrapper>}/>
            <Route path="site" element={<FullSiteRoutingLayout isLoggedIn={isLoggedIn} isSignedUp={isSignedUp} setIsSigedUp={setIsSigedUp}/>}>
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
            <Route path="app" element={<LoginWrapper isLoggedIn={isLoggedIn}
                      isSignedUp={isSignedUp} setIsSigedUp={setIsSigedUp}/>}>
              <Route index element={<LoadingWrapper><Dashboard/></LoadingWrapper>}/>
              <Route path="create" element={<LoadingWrapper><Create/></LoadingWrapper>}/>
            </Route>
          </Route>          
        </Routes>      
      </BrowserRouter>
  )
}

export default MainRouter