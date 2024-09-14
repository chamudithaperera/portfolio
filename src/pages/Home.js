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

function Home() {
  return (
    <div>
      <Helmet>
        <title>ChamXdev</title>
        <link rel="icon" href="/assets/imgs/favicon.ico" />
        <link rel="shortcut icon" href="/assets/imgs/favicon.ico" />
        <link rel="stylesheet" type="text/css" href="/assets/css/plugins.css" />
        <link rel="stylesheet" type="text/css" href="/assets/css/style.css" />
      </Helmet>
      <Cursor />
      <ContactUs />
      <Lines />
      <LoadingScreen />
      <ProgressScroll />
      <div>
        <NavTop />
        <main className="container">
          <Profile />
          <Navbar />
          <section className="in-box">
            <Services />
            {/* <Skills /> */}
            <Portfolio />
            <Experience />
            <Testimonials />
            {/* <Price /> */}
            <Info />
            <Blog />
          </section>
        </main>
        <Footer />
      </div>
      <script
        src="/assets/js/jquery-3.6.0.min.js"
        strategy="beforeInteractive"
      />
      <script
        src="/assets/js/jquery-migrate-3.4.0.min.js"
        strategy="beforeInteractive"
      />
      <script src="/assets/js/plugins.js" strategy="lazyOnload" />
      <script src="/assets/js/scripts.js" strategy="beforeInteractive" />
      <script src="/assets/js/three.min.js" strategy="lazyOnload" />
    </div>
  );
}

export default Home;
