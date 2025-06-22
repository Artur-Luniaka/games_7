// Hero Animations Module - PixelVault Gaming Store
const heroAnimationsModule = {
  isInitialized: false,

  initializeAnimations() {
    if (this.isInitialized) return;

    this.setupHeroButtonActions();
    this.setupScrollAnimations();
    this.setupFloatingCardsAnimation();
    this.isInitialized = true;
  },

  setupHeroButtonActions() {
    const heroButtons = document.querySelectorAll(".hero-btn");

    heroButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        this.handleHeroButtonClick(event);
      });
    });
  },

  handleHeroButtonClick(event) {
    const button = event.currentTarget;
    const action = button.getAttribute("data-action");

    // Add click animation
    button.style.transform = "scale(0.95)";
    setTimeout(() => {
      button.style.transform = "";
    }, 150);

    // Handle different actions
    switch (action) {
      case "explore-games":
        this.scrollToSection("featured-games");
        break;
      case "view-deals":
        this.scrollToSection("gaming-categories");
        break;
      case "join-community":
        this.scrollToSection("community-highlights");
        break;
      default:
        console.log("Unknown action:", action);
    }
  },

  scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      const headerHeight =
        document.querySelector(".site-header")?.offsetHeight || 0;
      const targetPosition = section.offsetTop - headerHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  },

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    // Observe sections for animation
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
      observer.observe(section);
    });
  },

  setupFloatingCardsAnimation() {
    const floatingCards = document.querySelectorAll(".game-card-float");

    floatingCards.forEach((card, index) => {
      // Add staggered animation delay
      card.style.animationDelay = `${index * 0.2}s`;

      // Add mouse interaction
      card.addEventListener("mouseenter", () => {
        this.enhanceCardAnimation(card);
      });

      card.addEventListener("mouseleave", () => {
        this.resetCardAnimation(card);
      });
    });
  },

  enhanceCardAnimation(card) {
    card.style.transform = "scale(1.2) rotate(10deg)";
    card.style.zIndex = "100";
    card.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.3)";
  },

  resetCardAnimation(card) {
    card.style.transform = "";
    card.style.zIndex = "";
    card.style.boxShadow = "";
  },

  // Parallax effect for hero section
  setupParallaxEffect() {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const heroSection = document.querySelector(".hero-section");

      if (heroSection) {
        const rate = scrolled * -0.5;
        heroSection.style.transform = `translateY(${rate}px)`;
      }
    });
  },

  // Add particle effect to hero section
  addParticleEffect() {
    const heroSection = document.querySelector(".hero-section");
    if (!heroSection) return;

    const particleContainer = document.createElement("div");
    particleContainer.className = "particle-container";
    particleContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
        `;

    heroSection.appendChild(particleContainer);

    // Create particles
    for (let i = 0; i < 20; i++) {
      this.createParticle(particleContainer);
    }
  },

  createParticle(container) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(230, 126, 34, 0.3);
            border-radius: 50%;
            animation: particleFloat 6s infinite linear;
        `;

    // Random position and animation delay
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 6 + "s";
    particle.style.animationDuration = Math.random() * 3 + 3 + "s";

    container.appendChild(particle);
  },
};

// Add particle animation CSS
const particleStyles = document.createElement("style");
particleStyles.textContent = `
    @keyframes particleFloat {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    .animate-in {
        animation: sectionFadeIn 0.8s ease-out forwards;
    }
    
    @keyframes sectionFadeIn {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(particleStyles);

// Initialize animations when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  heroAnimationsModule.initializeAnimations();
  heroAnimationsModule.addParticleEffect();
});

// Export for use in other modules
export default heroAnimationsModule;
