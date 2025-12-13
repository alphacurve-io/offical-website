// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Wait for DOM and GSAP to be ready
function initCards() {
  // Seleccionar todas las tarjetas
  const cards = gsap.utils.toArray(".c-card");
  const lastCardIndex = cards.length - 1;

  if (cards.length === 0) {
    console.error('No cards found');
    return;
  }

  // Set initial state for all cards - center them and set initial scale
  cards.forEach((card, index) => {
    gsap.set(card, {
      xPercent: -50,
      yPercent: -50,
      zIndex: cards.length - index,
      scale: 0.5
    });
  });

  // Set last card to scale 1
  gsap.set(cards[lastCardIndex], { scale: 1 });

  // Get the cards container
  const cardsContainer = document.querySelector('.l-cards');
  if (!cardsContainer) {
    console.error('Cards container not found');
    return;
  }

  // Create a master timeline that controls all cards
  const masterTL = gsap.timeline({
    scrollTrigger: {
      trigger: cardsContainer,
      start: "top top",
      end: () => `+=${window.innerHeight * cards.length}`,
      pin: true,
      pinSpacing: true,
      scrub: 0.5,
      invalidateOnRefresh: true
    }
  });

  // Add scale animations for each card at different points in the timeline
  cards.forEach((card, index) => {
    if (index < lastCardIndex) {
      // Each card scales from 0.5 to 1
      // Stagger the animations so each card animates in sequence
      masterTL.to(card, {
        scale: 1,
        ease: "none",
        duration: 1
      }, index);
    }
  });

  // Refresh ScrollTrigger
  ScrollTrigger.refresh();
}

// Initialize when everything is ready
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCards);
  } else {
    initCards();
  }
} else {
  window.addEventListener('load', initCards);
}