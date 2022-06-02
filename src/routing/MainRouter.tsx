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

export default function MainRouter(){    
 return (<BrowserRouter>
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
        <Route path="/*" element={<FullLayout/>}>
            <Route index element={<Home/>}/>
        </Route>
      </Routes>      
    </BrowserRouter>)
}