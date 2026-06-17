import React from 'react';
import data from '../../../data/works.json';
import './portfolio.css';

function Portfolio() {
  return (
    <div className="sec-box portfolio main-bg section-padding radius-15">
      <div className="sec-head mb-30 text-center">
        <h6 className="sub-title opacity-7 mb-15">Our Projects</h6>
        <h3>
          Look at my <span className="main-color">Projects</span>
        </h3>
      </div>
      <div className="gallery">
        <div className="row">
          {data.map((item, index) => (
            <div key={index} className="col-lg-4 col-md-6 items">
              <div className="project-card">
                <div className="project-image-wrap">
                  <img src={window.__withBase(item.photo)} alt={item.title} className="project-image" />
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
                      <a href={window.__withBase(item.link)} target="_blank" rel="noopener noreferrer" className="project-btn main-colorbg">
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
