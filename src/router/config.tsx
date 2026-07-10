import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import Blog from "../pages/blog/page";
import BlogPost from "../pages/blog-post/page";
import CaseStudy from "../pages/case-study/page";
import CaseStudiesPage from "../pages/case-studies/page";
import ProcessPage from "../pages/process/page";
import CareersPage from "../pages/careers/page";
import ServiceDetailPage from "../pages/services/page";
import PricingPage from "../pages/pricing/page";
import IndustriesPage from "../pages/industries/page";
import IndustryDetailPage from "../pages/industry-detail/page";
import ContactPage from "../pages/contact/page";
import WorkCaseStudyPage from "../pages/work-case-study/page";
import BallangkMallPage from "../pages/ballangk-mall/page";
import PinexProPage from "../pages/pinex-pro/page";
import PageTransition from "../components/feature/PageTransition";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <PageTransition><Home /></PageTransition>,
  },
  {
    path: "/blog",
    element: <PageTransition><Blog /></PageTransition>,
  },
  {
    path: "/blog/:slug",
    element: <PageTransition><BlogPost /></PageTransition>,
  },
  {
    path: "/case-study/:slug",
    element: <PageTransition><CaseStudy /></PageTransition>,
  },
  {
    path: "/case-studies",
    element: <PageTransition><CaseStudiesPage /></PageTransition>,
  },
  {
    path: "/work/ballangk-mall",
    element: <PageTransition><BallangkMallPage /></PageTransition>,
  },
  {
    path: "/work/pinex-pro",
    element: <PageTransition><PinexProPage /></PageTransition>,
  },
  {
    path: "/work/:slug",
    element: <PageTransition><WorkCaseStudyPage /></PageTransition>,
  },
  {
    path: "/process",
    element: <PageTransition><ProcessPage /></PageTransition>,
  },
  {
    path: "/careers",
    element: <PageTransition><CareersPage /></PageTransition>,
  },
  {
    path: "/services/:slug",
    element: <PageTransition><ServiceDetailPage /></PageTransition>,
  },
  {
    path: "/pricing",
    element: <PageTransition><PricingPage /></PageTransition>,
  },
  {
    path: "/industries",
    element: <PageTransition><IndustriesPage /></PageTransition>,
  },
  {
    path: "/industries/:slug",
    element: <PageTransition><IndustryDetailPage /></PageTransition>,
  },
  {
    path: "/contact",
    element: <PageTransition><ContactPage /></PageTransition>,
  },
  {
    path: "*",
    element: <PageTransition><NotFound /></PageTransition>,
  },
];

export default routes;