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

      {/* Timeline Row */}
      <div className="row justify-content-center">
        {/* Education Section */}
        <div className="col-lg-5 text-left">
          <div className="section-title">
            <h4>Education</h4>
          </div>
          <div className="timeline">
            {academicData?.map((item, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-content">
                  <p className="dates">{item.dates}</p>
                  <h6 className="title">{item.degree}</h6>
                  <p className="institution">{item.institution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vertical Line */}
        <div className="col-lg-1 d-flex justify-content-center align-items-center">
          <div className="vertical-line"></div>
        </div>

        {/* Experience Section */}
        <div className="col-lg-5 text-left">
          <div className="section-title">
            <h4>Experience</h4>
          </div>
          <div className="timeline">
            {experienceData?.map((item, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-content">
                  <p>{item.dates}</p>
                  <h6 className="title">{item.position}</h6>
                  <p>{item.description}</p>
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
