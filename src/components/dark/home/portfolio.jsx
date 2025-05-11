import React from 'react';
import data from '../../../data/works.json';
import './portfolio.css';

function Portfolio() {
  return (
    <div className="sec-box portfolio section-padding" id="portfolio">
      <div className="sec-head mb-30">
        <div className="row">
          <div className="col-lg-6">
            <h6 className="sub-title opacity-7 mb-15">Our Projects</h6>
            <h3>
              Look at my work & <br /> give us{' '}
              <span className="main-color">your feedback</span>
            </h3>
          </div>
          <div className="col-lg-6 valign">
            <div className="go-more full-width d-flex justify-content-end">
              <a href="/works" className="d-flex">
                <span>
                  View All Works{' '}
                  <svg
                    className="arrow-right"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    viewBox="0 0 34.2 32.3"
                    xmlSpace="preserve"
                    style={{ strokeWidth: 2 }}
                  />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="gallery">
        <div className="row">
          {data?.slice(0, 4).map((item, index) => (
            <div key={index} className="col-lg-6 items">
              <div className="project-card">
                <div className="project-image-wrap">
                  <img src={item.photo} alt={item.title} className="project-image" />
                  {item.category && (
                    <span className="project-category-badge">{item.category}</span>
                  )}
                </div>
                <div className="project-content">
                  <h4 className="project-title">{item.title}</h4>
                  {item.description && (
                    <p className="project-desc">{item.description}</p>
                  )}
                  {item.techStack && Array.isArray(item.techStack) && (
                    <div className="project-tech-stack">
                      {item.techStack.map((tech, i) => (
                        <span className="project-tech-badge" key={i}>{tech}</span>
                      ))}
                    </div>
                  )}
                  <div className="project-actions">
                    {item.link ? (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="project-btn main-colorbg">
                        Visit Project
                      </a>
                    ) : (
                      <span className="project-btn disabled">No Demo</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Portfolio;
