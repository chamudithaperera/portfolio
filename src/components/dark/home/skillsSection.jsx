import React from 'react';
import skills from '../../../data/skillsSection.json';
import './skillsSection.css';

const SkillsSection = () => {
  return (
    <section className="skills-section section-padding bord-thin-bottom" id="skills">
      <div className="sec-head mb-40 text-left">
        <h6 className="sub-title opacity-7 mb-15" style={{ letterSpacing: '2px', textTransform: 'uppercase', left: '50px' }}>My Skills</h6>
        <h2 className="skills-title" style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.15, marginBottom: '0.5rem' }}>
          Technologies I work with &<br />
          <span className="main-color" style={{ color: 'var(--maincolor)' }}>my expertise</span>
        </h2>
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