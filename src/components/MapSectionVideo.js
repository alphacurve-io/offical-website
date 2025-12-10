
//wait document ready
document.addEventListener('DOMContentLoaded', () => {
  const video = document.querySelector('.team-section-video');
  video.play().catch(err => console.log(err));
});
