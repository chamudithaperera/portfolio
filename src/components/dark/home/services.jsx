import React from 'react';
import data from '../../../data/services.json';
function Services() {
  return (
    <div
      className="sec-box services section-padding bord-thin-bottom"
      id="services"
    >
      <div className="sec-head mb-80 wow fadeInUp">
        <div className="row justify-content-center">
          <div className="col-lg-6 text-center">
            <h6 className="sub-title opacity-7 mb-15">Our Services</h6>
            <h3>
              Turn Information{' '}
              <span className="main-color">Into Actionable</span> Insights
            </h3>
          </div>
        </div>
      </div>
      <div className="row modern-services-row">
        {data.slice(0, 4).map((item, index) => (
          <div key={index} className="col-lg-3 col-md-6">
            <div className="modern-service-card">
              <div className="modern-service-icon-wrap">
                <img src={item.icon} alt={item.title} className="modern-service-icon" />
              </div>
              <h6 className="modern-service-title">{item.title}</h6>
              <p className="modern-service-desc">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;
