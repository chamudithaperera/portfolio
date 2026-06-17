import React from 'react';
import { Helmet } from 'react-helmet';
import ProgressScroll from '../../components/Common/ProgressScroll';
import Cursor from '../../components/Common/cusor';
import LoadingScreen from '../../components/Common/loader';
import ContactUs from '../../components/light/contact/ContactUs';
import Nav from '../../components/light/blogs/nav';
import Project from '../../components/light/blogs/single-blog/project';
import Blogs from '../../components/light/blogs/single-blog/blogs';
import Footer from '../../components/light/home/footer';
import Lines from '../../components/Common/Lines';

function LightSingleBlog() {
  return (
    <div>
      <Helmet>
        <title>Gavi - Light</title>
        <link rel="icon" href={window.__withBase('/light/assets/imgs/favicon.ico')} />
        <link rel="shortcut icon" href={window.__withBase('/light/assets/imgs/favicon.ico')} />
        <link
          rel="stylesheet"
          type="text/css"
          href={window.__withBase('/light/assets/css/plugins.css')}
        />
        <link
          rel="stylesheet"
          type="text/css"
          href={window.__withBase('/light/assets/css/style.css')}
        />
      </Helmet>
      <Cursor />
      <ContactUs />
      <Lines />
      <LoadingScreen />
      <ProgressScroll />
      <Nav />
      <main className="container">
        <Project />
        <Blogs />
      </main>
      <Footer />
      <script
        src={window.__withBase('/assets/js/jquery-3.6.0.min.js')}
        strategy="beforeInteractive"
      />
      <script
        src={window.__withBase('/assets/js/jquery-migrate-3.4.0.min.js')}
        strategy="beforeInteractive"
      />
      <script src={window.__withBase('/assets/js/plugins.js')} strategy="beforeInteractive" />
      <script src={window.__withBase('/assets/js/scripts.js')} strategy="beforeInteractive" />
      <script src={window.__withBase('/assets/js/three.min.js')} strategy="lazyOnload" />
    </div>
  );
}

export default LightSingleBlog;
