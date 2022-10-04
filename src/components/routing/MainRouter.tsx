import { BrowserRouter, Route, Routes } from "react-router-dom";
import { FullSiteRoutingLayout, TopLevelRoutingLayout } from "./routingLayouts"
import LoginWrapper from "./LoginWrapper";
import { lazy, Suspense} from "react";
import { selectIsLoggedIn } from "../../features/profile/profileSelectors";
import { useAppSelector } from "../../app/hooks";
import { submitCreateAddress } from "../../features/routes/app/address/create/submit/createAddressSubmissionSlice";
import { about, address, addresses, app, contact, create, faq, glossary, legal, pricing, privacy, site, terms, testimonials, topLevelAbs, viewAddresses, yiptionary } from "./routeStrings";

// Route Components: lazy-loaded for performance
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
const ViewAddresses = lazy(() => import("../../features/routes/app/addresses/view/ViewAddresses"));
const CreateAddress = lazy(() => import("../../features/routes/app/address/create/CreateAddress"));

type LoadingWrapperProps = {
  children?: React.ReactNode
};

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({children}) => (
  <Suspense fallback={<></>}>
    {children}
  </Suspense>
)

const isSignedUp = !!localStorage.getItem("isSignedUp")

function setIsSigedUp(b: boolean){        
  localStorage.setItem("isSignedUp", String(b))
}

const MainRouter = () => {  
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  
  return (  
    <BrowserRouter>
    <Routes>
      <Route path={topLevelAbs} element={<TopLevelRoutingLayout/>}>
          <Route index element={<LoadingWrapper><Home isLoggedIn={isLoggedIn} isSignedUp={isSignedUp} setIsSigedUp={setIsSigedUp}/></LoadingWrapper>}/>
          <Route path={site} element={<FullSiteRoutingLayout isLoggedIn={isLoggedIn} isSignedUp={isSignedUp} setIsSigedUp={setIsSigedUp}/>}>
            <Route path={about} element={<LoadingWrapper><About/></LoadingWrapper>}/>
            <Route path={contact} element={<LoadingWrapper><Contact/></LoadingWrapper>}/>
            <Route path={faq} element={<LoadingWrapper><Faq/></LoadingWrapper>}/>
            <Route path={glossary}>
              <Route index element={<LoadingWrapper><Glossary/></LoadingWrapper>}/>
              <Route path={yiptionary} element={<LoadingWrapper><Yiptionary/></LoadingWrapper>}/>
            </Route>
            <Route path={legal} element={<LoadingWrapper><Legal/></LoadingWrapper>}/>
            <Route path={pricing} element={<LoadingWrapper><Pricing/></LoadingWrapper>}/>
            <Route path={privacy} element={<LoadingWrapper><Privacy/></LoadingWrapper>}/>
            <Route path={terms} element={<LoadingWrapper><Terms/></LoadingWrapper>}/>
            <Route path={testimonials} element={<LoadingWrapper><Testimonials/></LoadingWrapper>}/>
          </Route>
          <Route path={app} element={<LoginWrapper isSignedUp={isSignedUp} setIsSigedUp={setIsSigedUp}/>}>
            <Route path={addresses}>
              <Route path={viewAddresses} element={<LoadingWrapper><ViewAddresses/></LoadingWrapper>}/>
            </Route> 
            <Route path={address}>
              <Route path={create} element={<LoadingWrapper>
                  <CreateAddress submissionThunk={submitCreateAddress}/>
                </LoadingWrapper>}/>
              </Route>
          </Route>
        </Route>          
      </Routes>      
    </BrowserRouter>
  )
}

export default MainRouter