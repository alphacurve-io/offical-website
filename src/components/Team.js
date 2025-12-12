import React from 'react';
import './Team.css';
import { useLanguage } from '../contexts/LanguageContext';
import { ReactComponent as BackgroundIcon } from '../assets/team/team-background.svg';

const Team = () => {
  const { content } = useLanguage();
  const teamContent = content.team;

  return (
    <section className="team-section" id="team">
      <div className="team-container">
        <h2 className="team-title">{teamContent.title}</h2>
        <p className="team-description">{teamContent.description}</p>
        <div className="team-grid">
          {teamContent.members.map((member) => (
            <div key={member.id} className="team-card">
              <div className="team-image">
                <BackgroundIcon className="background-icon" />
                <member.picture className="person-icon" />
              </div>
              <div className="team-details">
                <a href={member.link} target="_blank" rel="noopener noreferrer">
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-education">{member.education}</p>
                  <p className="team-degree">{member.degree}</p>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;