// GSAP Animation utilities for Mohit Corporation's futuristic gaming theme
// Requires GSAP to be loaded globally via CDN

declare global {
  interface Window {
    gsap: any;
  }
}

// Check if GSAP is available
const isGSAPAvailable = () => typeof window !== 'undefined' && window.gsap;

// System boot animation for loading screen
export const systemBootAnimation = (
  container: HTMLElement,
  lines: NodeListOf<HTMLElement>,
  onComplete?: () => void
) => {
  if (!isGSAPAvailable()) return;

  const tl = window.gsap.timeline();
  
  // Animate each boot line sequentially
  lines.forEach((line, index) => {
    tl.to(line, {
      opacity: 1,
      color: "#00FFFF",
      duration: 0.3,
      ease: "power2.out"
    }, index * 0.5);
  });

  // Add final glow effect and complete
  tl.to(container, {
    scale: 1.05,
    duration: 0.5,
    ease: "power2.inOut",
    yoyo: true,
    repeat: 1
  }).call(() => {
    if (onComplete) onComplete();
  });

  return tl;
};

// Hero section entrance animation
export const heroEntranceAnimation = (heroElement: HTMLElement) => {
  if (!isGSAPAvailable()) return;

  const tl = window.gsap.timeline();
  
  // Animate hero image
  const heroImage = heroElement.querySelector('img');
  if (heroImage) {
    tl.fromTo(heroImage, {
      opacity: 0,
      scale: 0.8,
      rotationY: 45
    }, {
      opacity: 1,
      scale: 1,
      rotationY: 0,
      duration: 1.2,
      ease: "back.out(1.7)"
    });
  }

  // Animate title with glitch effect
  const title = heroElement.querySelector('h1');
  if (title) {
    tl.fromTo(title, {
      opacity: 0,
      y: 50,
      skewX: 10
    }, {
      opacity: 1,
      y: 0,
      skewX: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=0.8");

    // Add glitch effect
    tl.to(title, {
      x: 2,
      duration: 0.1,
      repeat: 3,
      yoyo: true,
      ease: "power2.inOut"
    }, "-=0.3");
  }

  // Animate subtitle
  const subtitle = heroElement.querySelector('p');
  if (subtitle) {
    tl.fromTo(subtitle, {
      opacity: 0,
      y: 30
    }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.5");
  }

  // Animate buttons with stagger
  const buttons = heroElement.querySelectorAll('button, .cyber-button');
  if (buttons.length > 0) {
    tl.fromTo(buttons, {
      opacity: 0,
      y: 20,
      scale: 0.9
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.2,
      ease: "back.out(1.7)"
    }, "-=0.3");
  }

  return tl;
};

// Product card hover animations
export const productCardHover = (card: HTMLElement, isEntering: boolean) => {
  if (!isGSAPAvailable()) return;

  if (isEntering) {
    window.gsap.to(card, {
      y: -10,
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0, 255, 255, 0.3)",
      duration: 0.3,
      ease: "power2.out"
    });

    // Animate the glow effect
    window.gsap.to(card, {
      borderColor: "rgba(0, 255, 255, 0.8)",
      duration: 0.3
    });

    // Animate internal elements
    const title = card.querySelector('h3, h4');
    if (title) {
      window.gsap.to(title, {
        color: "#00FFFF",
        textShadow: "0 0 10px rgba(0, 255, 255, 0.5)",
        duration: 0.3
      });
    }
  } else {
    window.gsap.to(card, {
      y: 0,
      scale: 1,
      boxShadow: "0 0 10px rgba(0, 255, 255, 0.3)",
      duration: 0.3,
      ease: "power2.out"
    });

    window.gsap.to(card, {
      borderColor: "rgba(0, 255, 255, 0.3)",
      duration: 0.3
    });

    const title = card.querySelector('h3, h4');
    if (title) {
      window.gsap.to(title, {
        color: "#ffffff",
        textShadow: "none",
        duration: 0.3
      });
    }
  }
};

// Page transition animation
export const pageTransition = (fromPage: HTMLElement, toPage: HTMLElement, onComplete?: () => void) => {
  if (!isGSAPAvailable()) return;

  const tl = window.gsap.timeline();
  
  // Slide out current page
  tl.to(fromPage, {
    x: -100,
    opacity: 0,
    duration: 0.5,
    ease: "power2.in"
  });

  // Slide in new page
  tl.fromTo(toPage, {
    x: 100,
    opacity: 0
  }, {
    x: 0,
    opacity: 1,
    duration: 0.5,
    ease: "power2.out",
    onComplete
  });

  return tl;
};

// Cyber button click effect
export const cyberButtonClick = (button: HTMLElement) => {
  if (!isGSAPAvailable()) return;

  const tl = window.gsap.timeline();

  // Create ripple effect
  const ripple = document.createElement('div');
  ripple.style.position = 'absolute';
  ripple.style.borderRadius = '50%';
  ripple.style.background = 'rgba(255, 255, 255, 0.6)';
  ripple.style.transform = 'scale(0)';
  ripple.style.pointerEvents = 'none';
  ripple.style.width = '20px';
  ripple.style.height = '20px';
  ripple.style.left = '50%';
  ripple.style.top = '50%';
  ripple.style.marginLeft = '-10px';
  ripple.style.marginTop = '-10px';

  button.style.position = 'relative';
  button.style.overflow = 'hidden';
  button.appendChild(ripple);

  // Animate button press
  tl.to(button, {
    scale: 0.95,
    duration: 0.1,
    ease: "power2.out"
  })
  .to(ripple, {
    scale: 4,
    opacity: 0,
    duration: 0.6,
    ease: "power2.out"
  }, 0)
  .to(button, {
    scale: 1,
    duration: 0.2,
    ease: "back.out(1.7)"
  }, 0.1)
  .call(() => {
    button.removeChild(ripple);
  });

  return tl;
};

// Glowing text effect animation
export const glowingTextAnimation = (element: HTMLElement, color: string = "#00FFFF") => {
  if (!isGSAPAvailable()) return;

  window.gsap.to(element, {
    textShadow: `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}`,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: "power2.inOut"
  });
};

// Navigation menu slide animation
export const navMenuSlide = (menu: HTMLElement, isOpen: boolean) => {
  if (!isGSAPAvailable()) return;

  if (isOpen) {
    window.gsap.fromTo(menu, {
      height: 0,
      opacity: 0
    }, {
      height: "auto",
      opacity: 1,
      duration: 0.3,
      ease: "power2.out"
    });

    // Stagger animate menu items
    const menuItems = menu.querySelectorAll('a');
    window.gsap.fromTo(menuItems, {
      x: -20,
      opacity: 0
    }, {
      x: 0,
      opacity: 1,
      duration: 0.3,
      stagger: 0.1,
      ease: "power2.out"
    });
  } else {
    window.gsap.to(menu, {
      height: 0,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in"
    });
  }
};

// Scroll-triggered animations
export const initScrollAnimations = () => {
  if (!isGSAPAvailable()) return;

  // Animate elements as they come into view
  const animateOnScroll = (elements: NodeListOf<Element>) => {
    elements.forEach((element) => {
      window.gsap.fromTo(element, {
        opacity: 0,
        y: 50
      }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });
    });
  };

  // Apply to common elements
  const sections = document.querySelectorAll('section');
  const cards = document.querySelectorAll('.product-card');
  const headings = document.querySelectorAll('h1, h2, h3');

  animateOnScroll(sections);
  animateOnScroll(cards);
  animateOnScroll(headings);
};

// YouTube video modal animation
export const youtubeModalAnimation = (modal: HTMLElement, isOpening: boolean) => {
  if (!isGSAPAvailable()) return;

  if (isOpening) {
    window.gsap.fromTo(modal, {
      scale: 0.8,
      opacity: 0,
      rotationY: 45
    }, {
      scale: 1,
      opacity: 1,
      rotationY: 0,
      duration: 0.5,
      ease: "back.out(1.7)"
    });
  } else {
    window.gsap.to(modal, {
      scale: 0.8,
      opacity: 0,
      rotationY: -45,
      duration: 0.3,
      ease: "power2.in"
    });
  }
};

// Contact form success animation
export const contactFormSuccess = (form: HTMLElement) => {
  if (!isGSAPAvailable()) return;

  const tl = window.gsap.timeline();

  // Create success overlay
  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <div style="text-align: center; color: #10B981;">
      <i class="fas fa-check-circle" style="font-size: 4rem; margin-bottom: 1rem;"></i>
      <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Message Sent!</h3>
      <p>We'll get back to you within 24 hours.</p>
    </div>
  `;
  overlay.style.position = 'absolute';
  overlay.style.inset = '0';
  overlay.style.background = 'rgba(10, 10, 10, 0.95)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.borderRadius = '12px';
  overlay.style.opacity = '0';

  form.style.position = 'relative';
  form.appendChild(overlay);

  // Animate success state
  tl.to(overlay, {
    opacity: 1,
    duration: 0.5,
    ease: "power2.out"
  })
  .to(overlay.querySelector('i'), {
    scale: 1.2,
    duration: 0.3,
    ease: "back.out(1.7)"
  }, "-=0.3")
  .to(overlay, {
    opacity: 0,
    duration: 0.5,
    delay: 2,
    ease: "power2.in",
    onComplete: () => {
      form.removeChild(overlay);
    }
  });

  return tl;
};

// WhatsApp popup animation
export const whatsappPopupAnimation = (popup: HTMLElement, isOpening: boolean) => {
  if (!isGSAPAvailable()) return;

  if (isOpening) {
    window.gsap.fromTo(popup, {
      scale: 0,
      opacity: 0,
      transformOrigin: "bottom right"
    }, {
      scale: 1,
      opacity: 1,
      duration: 0.4,
      ease: "back.out(1.7)"
    });
  } else {
    window.gsap.to(popup, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      transformOrigin: "bottom right"
    });
  }
};

// Admin panel data loading animation
export const adminDataLoadAnimation = (container: HTMLElement) => {
  if (!isGSAPAvailable()) return;

  const items = container.querySelectorAll('.product-card, .admin-item');
  
  window.gsap.fromTo(items, {
    opacity: 0,
    y: 20,
    scale: 0.95
  }, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.5,
    stagger: 0.1,
    ease: "power2.out"
  });
};

// Particle interaction enhancement
export const enhanceParticleInteraction = () => {
  if (!isGSAPAvailable()) return;

  document.addEventListener('mousemove', (e) => {
    const particles = document.querySelectorAll('#particles-js canvas');
    if (particles.length > 0) {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      
      window.gsap.to(particles, {
        filter: `hue-rotate(${mouseX * 60}deg) brightness(${1 + mouseY * 0.3})`,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  });
};

// Initialize all animations
export const initializeAnimations = () => {
  if (!isGSAPAvailable()) {
    console.warn('GSAP not available. Animations will be skipped.');
    return;
  }

  // Initialize scroll animations
  initScrollAnimations();
  
  // Enhance particle interactions
  enhanceParticleInteraction();

  // Add global click effects
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('cyber-button') || target.closest('.cyber-button')) {
      const button = target.classList.contains('cyber-button') ? target : target.closest('.cyber-button') as HTMLElement;
      cyberButtonClick(button);
    }
  });

  // Add hover effects to product cards
  document.addEventListener('mouseenter', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('product-card')) {
      productCardHover(target, true);
    }
  }, true);

  document.addEventListener('mouseleave', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('product-card')) {
      productCardHover(target, false);
    }
  }, true);

  console.log('🎮 Mohit Corporation animations initialized');
};

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnimations);
  } else {
    initializeAnimations();
  }
}
