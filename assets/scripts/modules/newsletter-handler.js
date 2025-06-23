// Newsletter Handler Module - PixelVault Gaming Store
const newsletterHandlerModule = {
  isInitialized: false,

  initializeNewsletter() {
    if (this.isInitialized) return;

    this.setupNewsletterForm();
    this.isInitialized = true;
  },

  setupNewsletterForm() {
    const newsletterForm = document.getElementById("newsletter-form");
    if (!newsletterForm) return;

    newsletterForm.addEventListener("submit", (event) => {
      event.preventDefault();
      this.handleNewsletterSubmission(event);
    });
  },

  handleNewsletterSubmission(event) {
    const form = event.currentTarget;
    const emailInput = form.querySelector('input[type="email"]');
    const submitButton = form.querySelector('button[type="submit"]');

    if (!emailInput || !submitButton) return;

    const email = emailInput.value.trim();

    // Validate email
    if (!this.validateEmail(email)) {
      this.showEmailError(emailInput, "Please enter a valid email address");
      return;
    }

    // Show loading state
    this.setFormLoadingState(form, true);

    // Simulate API call
    setTimeout(() => {
      this.processNewsletterSignup(email, form);
    }, 1000);
  },

  validateEmail(email) {
    // Custom email validation logic
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email || email.length < 5) {
      return false;
    }

    if (!emailRegex.test(email)) {
      return false;
    }

    // Check for common disposable email domains
    const disposableDomains = [
      "tempmail.org",
      "10minutemail.com",
      "guerrillamail.com",
      "mailinator.com",
      "yopmail.com",
      "temp-mail.org",
    ];

    const domain = email.split("@")[1];
    if (disposableDomains.includes(domain)) {
      return false;
    }

    return true;
  },

  showEmailError(input, message) {
    // Remove existing error
    this.removeEmailError(input);

    // Add error styling
    input.classList.add("input-error");

    // Create error message
    const errorElement = document.createElement("div");
    errorElement.className = "input-error-message";
    errorElement.textContent = message;
    errorElement.style.cssText = `
            color: var(--error-color);
            font-size: 0.8rem;
            margin-top: 0.25rem;
            animation: errorShake 0.5s ease-in-out;
        `;

    input.parentNode.appendChild(errorElement);

    // Focus on input
    input.focus();

    // Remove error after 5 seconds
    setTimeout(() => {
      this.removeEmailError(input);
    }, 5000);
  },

  removeEmailError(input) {
    input.classList.remove("input-error");
    const errorElement = input.parentNode.querySelector(".input-error-message");
    if (errorElement) {
      errorElement.remove();
    }
  },

  setFormLoadingState(form, isLoading) {
    const submitButton = form.querySelector('button[type="submit"]');
    const emailInput = form.querySelector('input[type="email"]');

    if (isLoading) {
      submitButton.disabled = true;
      submitButton.innerHTML =
        '<span class="loading-spinner"></span> Subscribing...';
      emailInput.disabled = true;
    } else {
      submitButton.disabled = false;
      submitButton.innerHTML = "Subscribe";
      emailInput.disabled = false;
    }
  },

  processNewsletterSignup(email, form) {
    // Simulate success/failure
    const isSuccess = Math.random() > 0.1; // 90% success rate

    if (isSuccess) {
      this.handleNewsletterSuccess(email, form);
    } else {
      this.handleNewsletterError(form);
    }
  },

  handleNewsletterSuccess(email, form) {
    // Reset form
    form.reset();
    this.setFormLoadingState(form, false);

    // Show success message
    this.showSuccessMessage(form, email);

    // Store subscription in localStorage
    this.saveNewsletterSubscription(email);

    // Отключено: глобальное всплывающее уведомление
    // import("./notification-system.js").then((module) => {
    //   const notificationSystem = module.default;
    //   notificationSystem.showSuccess(
    //     "Successfully subscribed to newsletter!",
    //     5000
    //   );
    // });
  },

  handleNewsletterError(form) {
    this.setFormLoadingState(form, false);

    // Show error message
    this.showErrorMessage(form);

    // Отключено: глобальное всплывающее уведомление
    // import("./notification-system.js").then((module) => {
    //   const notificationSystem = module.default;
    //   notificationSystem.showError(
    //     "Failed to subscribe. Please try again.",
    //     5000
    //   );
    // });
  },

  showSuccessMessage(form, email) {
    const successContainer = form.parentNode;
    const successMessage = document.createElement("div");
    successMessage.className = "newsletter-success";
    successMessage.innerHTML = `
      <div class="success-icon" style="margin: 0 auto 0.7rem auto;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="6" fill="url(#success-gradient)"/>
          <path d="M16.25 8.25L10.5 14L7.75 11.25" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <defs>
            <linearGradient id="success-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop stop-color="#00b894"/>
              <stop offset="1" stop-color="#00b4d8"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <h4 style="color:#fff; font-size:1rem; font-weight:700; margin:0 0 0.3rem 0;">Thank you for subscribing!</h4>
      <p style="color:#eaf6ff; font-size:0.9rem; margin:0;">You'll get the latest gaming news and deals by email.</p>
    `;
    form.style.display = "none";
    successContainer.appendChild(successMessage);
    setTimeout(() => {
      successMessage.classList.add("success-show");
    }, 10);
  },

  showErrorMessage(form) {
    const errorMessage = document.createElement("div");
    errorMessage.className = "newsletter-error";
    errorMessage.innerHTML = `
            <div class="error-content">
                <span class="error-icon">❌</span>
                <div class="error-text">
                    <h4>Subscription Failed</h4>
                    <p>Sorry, we couldn't process your subscription. Please try again later.</p>
                    <button class="btn primary-btn retry-btn">Try Again</button>
                </div>
            </div>
        `;

    // Add retry functionality
    const retryBtn = errorMessage.querySelector(".retry-btn");
    retryBtn.addEventListener("click", () => {
      errorMessage.remove();
      form.style.display = "flex";
    });

    form.parentNode.appendChild(errorMessage);

    // Animate in
    setTimeout(() => {
      errorMessage.classList.add("error-show");
    }, 10);
  },

  saveNewsletterSubscription(email) {
    try {
      const subscriptions = JSON.parse(
        localStorage.getItem("pixelvault-newsletter") || "[]"
      );
      if (!subscriptions.includes(email)) {
        subscriptions.push(email);
        localStorage.setItem(
          "pixelvault-newsletter",
          JSON.stringify(subscriptions)
        );
      }
    } catch (error) {
      console.error("Failed to save newsletter subscription:", error);
    }
  },

  isEmailSubscribed(email) {
    try {
      const subscriptions = JSON.parse(
        localStorage.getItem("pixelvault-newsletter") || "[]"
      );
      return subscriptions.includes(email);
    } catch (error) {
      console.error("Failed to check newsletter subscription:", error);
      return false;
    }
  },
};

// Add newsletter styles
const newsletterStyles = document.createElement("style");
newsletterStyles.textContent = `
    .input-error {
        border-color: var(--error-color) !important;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1) !important;
    }
    
    .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: 0.5rem;
    }
    
    .newsletter-success,
    .newsletter-error {
        opacity: 0;
        transform: translateY(20px);
        transition: all var(--transition-medium);
    }
    
    .success-show,
    .error-show {
        opacity: 1;
        transform: translateY(0);
    }
    
    .success-content,
    .error-content {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding: 1.5rem;
        border-radius: var(--border-radius);
    }
    
    .success-content {
        background: rgba(39, 174, 96, 0.1);
        border: 1px solid rgba(39, 174, 96, 0.2);
    }
    
    .error-content {
        background: rgba(231, 76, 60, 0.1);
        border: 1px solid rgba(231, 76, 60, 0.2);
    }
    
    .success-icon,
    .error-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
        margin-top: 0.25rem;
    }
    
    .success-text h4,
    .error-text h4 {
        margin: 0 0 0.5rem 0;
        color: var(--text-primary);
    }
    
    .success-text p,
    .error-text p {
        margin: 0 0 1rem 0;
        color: var(--text-secondary);
        line-height: 1.5;
    }
    
    .retry-btn {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
    }
    
    @keyframes errorShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @media (max-width: 768px) {
        .success-content,
        .error-content {
            flex-direction: column;
            text-align: center;
            gap: 0.75rem;
        }
        
        .success-icon,
        .error-icon {
            margin-top: 0;
        }
    }
`;
document.head.appendChild(newsletterStyles);

// Initialize newsletter when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  newsletterHandlerModule.initializeNewsletter();
});

// Export for use in other modules
export default newsletterHandlerModule;
