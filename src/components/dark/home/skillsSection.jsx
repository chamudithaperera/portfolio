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
      <div className="skills-grid simple-skills-grid">
        {skills.map((skill, idx) => (
          <div className="simple-skill-card" key={idx}>
            <img
              src={skill.icon}
              alt={skill.name + ' icon'}
              style={{
                width: 32,
                height: 32,
                verticalAlign: 'middle',
                marginRight: 8,
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.10))'
              }}
            />
            {skill.name}
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection; 