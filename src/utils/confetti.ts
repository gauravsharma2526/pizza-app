import confetti from 'canvas-confetti';

/**
 * Trigger confetti animation for celebrations
 * Used when user confirms an order
 */
export const triggerConfetti = () => {
  // First burst
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6'],
  });

  // Second burst with delay
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#ef4444', '#f59e0b', '#22c55e'],
    });
  }, 150);

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#3b82f6', '#8b5cf6', '#ec4899'],
    });
  }, 300);
};

/**
 * Trigger a more subtle confetti for smaller celebrations
 */
export const triggerSmallConfetti = () => {
  confetti({
    particleCount: 30,
    spread: 50,
    origin: { y: 0.7 },
    colors: ['#ef4444', '#f59e0b', '#22c55e'],
    gravity: 1.2,
    scalar: 0.8,
  });
};

/**
 * Trigger pizza-themed celebration
 */
export const triggerPizzaConfetti = () => {
  const defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0.8,
    decay: 0.94,
    startVelocity: 30,
    shapes: ['circle', 'square'] as confetti.Shape[],
    colors: ['#ef4444', '#f59e0b', '#fbbf24', '#84cc16', '#f97316'],
  };

  confetti({
    ...defaults,
    particleCount: 40,
    scalar: 1.2,
    origin: { x: 0.5, y: 0.5 },
  });

  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 25,
      scalar: 0.75,
      origin: { x: 0.3, y: 0.6 },
    });
  }, 100);

  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 25,
      scalar: 0.75,
      origin: { x: 0.7, y: 0.6 },
    });
  }, 200);
};
