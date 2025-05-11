import React from 'react';
import data from '../../../../data/works.json';

function ProjectView() {
  // For demo, use the first project. In a real app, use params or context to select.
  const project = data[0];

  return (
    <section className="sec-box project section-padding radius-15">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="project-card">
            <div className="project-image-wrap">
              <img
                src={project.photo}
                alt={project.title}
                className="project-image"
              />
            </div>
            <div className="project-content">
              <h3 className="project-title mb-15 fw-500">{project.title}</h3>
              {project.description && <p className="project-desc">{project.description}</p>}
              {project.techStack && Array.isArray(project.techStack) && (
                <div className="project-tech-stack mb-20">
                  {project.techStack.map((tech, i) => (
                    <span className="project-tech-badge" key={i}>{tech}</span>
                  ))}
                </div>
              )}
              <div className="project-actions mt-20">
                {project.link ? (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-btn main-colorbg">
                    Visit Project
                  </a>
                ) : (
                  <span className="project-btn disabled">No Demo</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProjectView;
