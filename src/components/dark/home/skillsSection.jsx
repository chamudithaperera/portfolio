import React from 'react';
import skills from '../../../data/skillsSection.json';
import './skillsSection.css';

const SkillsSection = () => {
  return (
    <section className="skills-section section-padding bord-thin-bottom" id="skills">
      <div className="sec-head mb-40 text-center">
        <h2 className="skills-title">My Skills</h2>
        <div className="skills-underline"></div>
        <p className="skills-subtitle">Technologies I work with</p>
      </div>
      <div className="skills-grid">
        {skills.map((skill, idx) => (
          <div className="skill-card" key={idx}>
            <div className="skill-icon-wrap">
              <img src={skill.icon} alt={skill.name} className="skill-icon" />
            </div>
            <div className="skill-name">{skill.name}</div>
            <div className="skill-progress-bar">
              <div
                className="skill-progress-fill"
                style={{ width: `${skill.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection; 