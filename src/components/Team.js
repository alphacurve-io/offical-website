// src/components/Team.js
import React from 'react';
import './Team.css';
import { ReactComponent as BackgroundIcon } from '../assets/team/team-background.svg';
import teamContent from '../content/team-content';

const Team = () => {
  const { title, description, members } = teamContent;

  return (
    <section className="team-section" id="team">
      <div className="team-container">
        <h2 className="services-title">{title}</h2>
        <p className="services-description">{description}</p>
        <div className="team-grid">
          {members.map((member) => (
            <div key={member.id} className="team-card">
              <div className="team-image">
                <BackgroundIcon className="background-icon" />
                {member.picture ? (
                  <member.picture
                    alt={member.name}
                    className="person-icon"
                  />
                ) : (
                  <div className="person-icon-placeholder">No Image</div>
                )}
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