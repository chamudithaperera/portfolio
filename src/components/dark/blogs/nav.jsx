import React from 'react';

function Nav() {
  return (
    <div className="nav-top pt-30 pb-30">
      <div className="container">
        <div className="row">
          <div className="col-md-4 valign">
            <a href={window.__withBase('/dark')} className="logo icon-img-60">
              <img src={window.__withBase('/assets/imgs/logo-light.png')} alt="" />
            </a>
          </div>
          <div className="col-md-8">
            <div className="navbar">
              <div className="row justify-content-end rest">
                <div className="col-lg-8 rest">
                  <ul className="navbar-nav main-bg d-flex justify-content-end">
                    <li className="nav-item">
                      <a href={window.__withBase('/dark')}>
                        <span>Home</span>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a href={window.__withBase('/dark')}>
                        <span>Services</span>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a href={window.__withBase('/dark')}>
                        <span>About</span>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a href={window.__withBase('/dark')}>
                        <span>Projects</span>
                      </a>
                    </li>
                    <li className="nav-item">
                    <a href={window.__withBase('/dark')}>
                <span>Journey</span>
              </a>
            </li>
                    <li className="nav-item">
                      <a href={window.__withBase('/dark')}>
                        <span>Contact</span>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a href={window.__withBase('/dark')}>
                        <span>Blog</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="nav-butn">
          <span className="pe-7s-menu"></span>
        </div>
      </div>
    </div>
  );
}

export default Nav;
