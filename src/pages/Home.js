import React from 'react';
//import Navbar from '../components/home/Navbar';
import Navbar from '../components/dark/home/navbar';
import { Helmet } from 'react-helmet';
//import Landing from '../components/home/Landing';
//import Footer from '../components/dark/home/footer';
import ProgressScroll from '../components/Common/ProgressScroll';
import LoadingScreen from '../components/Common/loader';
import Lines from '../components/Common/Lines';
import Cursor from '../components/Common/cusor';
import Profile from '../components/dark/home/profile';
import Blog from '../components/dark/home/blog';
import ContactUs from '../components/dark/contact/ContactUs';
import Info from '../components/dark/contact/info';
import Footer from '../components/dark/home/footer';
import NavTop from '../components/dark/home/nav-top';
import Portfolio from '../components/dark/home/portfolio';
import Services from '../components/dark/home/services';
import Testimonials from '../components/dark/home/testimonials';
import Experience from '../components/dark/home/experience';
// import AddReview from '../components/dark/home/addReview';

function Home() {
  return (
    <div className="app-container">
      <Helmet>
        <title>ChamXdev | Portfolio</title>
        <link rel="icon" href="/assets/imgs/favicon.ico" />
        <link rel="shortcut icon" href="/assets/imgs/favicon.ico" />
        <link rel="stylesheet" type="text/css" href="/assets/css/plugins.css" />
        <link rel="stylesheet" type="text/css" href="/assets/css/style.css" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>
      
      <Cursor />
      <ContactUs />
      <Lines />
      <LoadingScreen />
      <ProgressScroll />
      
      <div className="main-content">
        <NavTop />
        <main className="container">
          <div className="content-wrapper">
            <Profile />
            <Navbar />
            <section className="in-box fade-in">
              <Services />
              {/* <Skills /> */}
              <Portfolio />
              <Experience />
              <Testimonials />
              {/* <AddReview /> */}
              {/* <Price /> */}
              <Info />
              <Blog />
            </section>
          </div>
        </main>
        <Footer />
      </div>
      
      <script src="/assets/js/jquery-3.6.0.min.js" strategy="beforeInteractive" />
      <script src="/assets/js/jquery-migrate-3.4.0.min.js" strategy="beforeInteractive" />
      <script src="/assets/js/plugins.js" strategy="lazyOnload" />
      <script src="/assets/js/scripts.js" strategy="beforeInteractive" />
      <script src="/assets/js/three.min.js" strategy="lazyOnload" />
    </div>
  );
}

export default Home;
