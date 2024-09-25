import React from 'react';

function Footer() {
  return (
    <footer className="pb-30 pt-30">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="text-center">
              <p className="fz-13">
              © 2024{' '}
                <span className="underline main-color">
                  <a href="https://chamxdev.vercel.app/" target="_self">
                  ChamXdev 
                  </a>
                </span> All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
