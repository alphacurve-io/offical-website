// src/components/Team.js
import React from 'react';
import './Team.css';
import { ReactComponent as BackgroundIcon } from '../assets/team/team-background.svg';
import { ReactComponent as JamesIcon } from '../assets/team/james.svg';
import { ReactComponent as PeterIcon } from '../assets/team/peter.svg';
import { ReactComponent as AngelaIcon } from '../assets/team/angela.svg';
import { ReactComponent as AaronIcon } from '../assets/team/aaron.svg';
const Team = () => {
  const teamMembers = [
    {
      name: 'James',
      role: 'CEO & Founder',
      education: '國立成功大學 製造資訊與系統所 碩士',
      degree: "Master's of Science, National Cheng Kung University",
      picture: JamesIcon
    },
    {
      name: 'Peter',
      role: 'Chief Designer',
      education: '波士頓大學 工業設計 學士',
      degree: "Bachelor's degree, Boston University",
      picture: PeterIcon
    },
    {
      name: 'Angela',
      role: 'Business Development',
      education: '國立台灣大學 企業管理 碩士',
      degree: "Master's degree in National Taiwan University",
      picture: AngelaIcon
    },
    {
      name: 'Aaron',
      role: 'Business Development',
      education: '國立清大大學 工業工程 碩士',
      degree: "Master's degree in National Tsinghua University",
      picture: AaronIcon
    },
  ];

  return (
    <section className="team-section" id="team">
      <div className="team-container">
        <h2 className="services-title">Who We Are</h2>
        <p className="services-description">關於我們</p>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-card">
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
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-education">{member.education}</p>
                <p className="team-degree">{member.degree}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;