import React from 'react';

function Profile() {
  return (
    <section id="home" className="intro-profile md-mb50">
      <div className="row rest">
        <div className="col-lg-4 box-img main-bg">
          <div className="cont valign">
            <div className="full-width">
              <div className="img">
                <img src="/assets/imgs/header/profile.jpg" alt="" />
                <span className="icon">
                  <img src="/assets/imgs/header/icon1.png" alt="" />
                </span>
                <span className="icon">
                  <img src="/assets/imgs/header/icon2.png" alt="" />
                </span>
                <span className="icon">
                  <img src="/assets/imgs/header/icon4.png" alt="" />
                </span>
              </div>
              <div className="info text-center mt-30">
                <h5>Chamuditha Perera</h5>
                <p className="fz-13 text-u">
                  Available for Hire &nbsp; <div className="green-circle"></div> </p> 
              </div>
              <div className="social text-center mt-20">
              <a href="https://www.linkedin.com/in/chamudithaperera">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="https://github.com/chamudithaperera">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://www.facebook.com/chamuditha.kavishan.1">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://www.instagram.com/chamuditha_kavishan/">
                <i className="fab fa-instagram"></i>
              </a>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-8 content main-bg">
          <h1>
          <span className="main-color">Hi there !</span> <br></br>I’m
            {' '}
            <span className="bord">
            Chamuditha Perera <i></i>
            </span>{' '}, <br></br>
            <span className="main-color1">
            UI / UX Designer
            , <br></br>Mobile Application Developer <br></br>&
            Web Developer
            </span>
          </h1>
          <div className="stauts mt-80">
            <div className="d-flex align-items-center">
              <div className="mr-40">
                <div className="d-flex align-items-center">
                  <h2>2</h2>
                  <p>
                    Years <br /> of Experance
                  </p>
                </div>
              </div>
              <div className="mr-40">
                <div className="d-flex align-items-center">
                  <h2>9+</h2>
                  <p>
                    Projects <br /> Worldwide
                  </p>
                </div>
              </div>
              <div>
                <div className="butn-presv">
                  <a href="/ChamudithaPereraCV1.pdf" download="ChamudithaPereraCV1.pdf" className="butn butn-md butn-bord radius-5 skew">
                    <span>Dwonload CV</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;
