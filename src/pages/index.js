


import About from "./About";
import AdvisorsBackers from "./AdvisorsBackers";
import Blog from "./Blog";
import BlogDetails from "./BlogDetails";
import Contact from "./Contact";
import HelpCenter from "./HelpCenter";
import Home01 from "./Home01";
import Home02 from "./Home02";
import Home03 from "./Home03";
import Nfts from "./Nfts";
import ParticipantAssets from "./ParticipantAssets";
import Partners from "./Partners";
import RoadMap from "./RoadMap";
import Team from "./Team";
import VisionsMission from "./VisionsMission";





const routes = [
  { path: '/', component: <Home01 />},
  { path: '/home-v2', component: <Home02 />},
  { path: '/home-v3', component: <Home03 />},

  { path: '/nfts', component: <Nfts />},
  { path: '/blog', component: <Blog />},
  { path: '/blog-details', component: <BlogDetails />},
  { path: '/visions-mission', component: <VisionsMission />},
  { path: '/help-center', component: <HelpCenter />},
  { path: '/participants-assets', component: <ParticipantAssets />},
  { path: '/advisors-backers', component: <AdvisorsBackers />},
  { path: '/partners', component: <Partners />},
  { path: '/about', component: <About />},
  { path: '/road-map', component: <RoadMap />},
  { path: '/team', component: <Team />},
  { path: '/contact', component: <Contact />},



]

export default routes;