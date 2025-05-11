import React from 'react';
import experienceData from '../../../data/experience.json';
import academicData from '../../../data/academic.json'; 

function Experience() {
  return (
    <div className="sec-box experience section-padding" id="experience">
      <div className="sec-head mb-30 text-left">
        <h6 className="sub-title opacity-7 mb-15">My Experience & Education</h6>
        <h3>
          My <span className="main-color">Journey</span>
        </h3>
      </div>
      <div className="row justify-content-center modern-timeline-row">
        {/* Education Section */}
        <div className="col-lg-5 text-left">
          <div className="section-title">
            <h4>Education</h4>
          </div>
          <div className="modern-timeline">
            {academicData?.map((item, index) => (
              <div key={index} className="modern-timeline-item">
                <div className="modern-timeline-point">
                  <span className="modern-timeline-circle" />
                </div>
                <div className="modern-timeline-card">
                  <p className="modern-timeline-date">{item.dates}</p>
                  <h6 className="modern-timeline-title">{item.degree}</h6>
                  <p className="modern-timeline-inst">{item.institution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Vertical Line */}
        <div className="col-lg-1 d-flex justify-content-center align-items-center">
          <div className="modern-vertical-line"></div>
        </div>
        {/* Experience Section */}
        <div className="col-lg-5 text-left">
          <div className="section-title">
            <h4>Experience</h4>
          </div>
          <div className="modern-timeline">
            {experienceData?.map((item, index) => (
              <div key={index} className="modern-timeline-item">
                <div className="modern-timeline-point">
                  <span className="modern-timeline-circle" />
                </div>
                <div className="modern-timeline-card">
                  <p className="modern-timeline-date">{item.dates}</p>
                  <h6 className="modern-timeline-title">{item.position}</h6>
                  <p className="modern-timeline-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Experience;
