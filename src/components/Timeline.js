import React from 'react';
import './Timeline.css';

const Timeline = () => {
  return (
      <div class="timeline">
        <div class="timeline-item">
          <div class="circle"></div>
          <div class="label">business</div>
        </div>
        <div class="arrow"></div>
        <div class="timeline-item">
          <div class="circle active"></div>
          <div class="label active">solution</div>
        </div>
        <div class="arrow"></div>
        <div class="timeline-item">
          <div class="circle"></div>
          <div class="label">team</div>
        </div>
      </div>
  );
};

export default Timeline;
