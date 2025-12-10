
//wait document ready
document.addEventListener('DOMContentLoaded', () => {
  const video = document.querySelector('.hero-section-video');
  video.play().catch(err => console.log(err));
});
