// Contact Page Module - PixelVault Gaming Store
class ContactPageManager {
  constructor() {
    this.modal = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeFormValidation();
    this.initializeModal();
  }

  setupEventListeners() {
    // Contact form submission
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => this.handleContactForm(e));
    }

    // Map button
    const openMapBtn = document.getElementById("open-map-btn");
    if (openMapBtn) {
      openMapBtn.addEventListener("click", () => this.openGoogleMaps());
    }

    // Real-time form validation
    const formInputs = contactForm?.querySelectorAll("input, select, textarea");
    if (formInputs) {
      formInputs.forEach((input) => {
        input.addEventListener("blur", () => this.validateField(input));
        input.addEventListener("input", () => this.clearFieldError(input));
      });
    }
  }

  initializeModal() {
    this.modal = document.getElementById("contact-modal");
    const modalOverlay = document.getElementById("modal-overlay");
    const modalClose = document.getElementById("modal-close");
    const modalBtn = document.getElementById("modal-btn");

    // Close modal on overlay click
    if (modalOverlay) {
      modalOverlay.addEventListener("click", () => this.closeModal());
    }

    // Close modal on close button click
    if (modalClose) {
      modalClose.addEventListener("click", () => this.closeModal());
    }

    // Close modal on OK button click
    if (modalBtn) {
      modalBtn.addEventListener("click", () => this.closeModal());
    }

    // Close modal on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal?.classList.contains("show")) {
        this.closeModal();
      }
    });
  }

  showModal(type, title, message, icon) {
    if (!this.modal) return;

    const modalTitle = document.getElementById("modal-title");
    const modalMessage = document.getElementById("modal-message");
    const modalIcon = document.getElementById("modal-icon");

    // Set modal content
    if (modalTitle) modalTitle.textContent = title;
    if (modalMessage) modalMessage.textContent = message;
    if (modalIcon) modalIcon.textContent = icon;

    // Set modal type (success, error, info)
    this.modal.className = `contact-modal ${type}`;

    // Show modal
    this.modal.classList.add("show");
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  }

  closeModal() {
    if (!this.modal) return;

    this.modal.classList.remove("show");
    document.body.style.overflow = ""; // Restore scrolling
  }

  initializeFormValidation() {
    // Add visual feedback for required fields
    const requiredFields = document.querySelectorAll("[required]");
    requiredFields.forEach((field) => {
      const label = field.previousElementSibling;
      if (label && label.tagName === "LABEL") {
        label.innerHTML += ' <span class="required-asterisk">*</span>';
      }
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;

    // Remove existing error state
    this.clearFieldError(field);

    // Check if field is required
    if (field.hasAttribute("required") && !value) {
      this.showFieldError(field, `${this.getFieldLabel(field)} is required`);
      return false;
    }

    // Email validation
    if (fieldName === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        this.showFieldError(field, "Please enter a valid email address");
        return false;
      }
    }

    // Message length validation
    if (fieldName === "message" && value && value.length < 10) {
      this.showFieldError(field, "Message must be at least 10 characters long");
      return false;
    }

    return true;
  }

  showFieldError(field, message) {
    field.classList.add("error");

    // Create or update error message
    let errorElement = field.parentNode.querySelector(".field-error");
    if (!errorElement) {
      errorElement = document.createElement("div");
      errorElement.className = "field-error";
      field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }

  clearFieldError(field) {
    field.classList.remove("error");
    const errorElement = field.parentNode.querySelector(".field-error");
    if (errorElement) {
      errorElement.style.display = "none";
    }
  }

  getFieldLabel(field) {
    const label = field.parentNode.querySelector("label");
    return label ? label.textContent.replace("*", "").trim() : field.name;
  }

  async handleContactForm(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData);

    // Validate all fields
    const fields = form.querySelectorAll("input, select, textarea");
    let isValid = true;

    fields.forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      this.showModal(
        "error",
        "Form Validation Error",
        "Please fix the errors in the form before submitting.",
        "⚠️"
      );
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector(".submit-btn");
    const spinner = form.querySelector("#contact-spinner");

    // Store original button state
    const originalText = submitBtn.textContent.trim();
    const originalDisabled = submitBtn.disabled;

    // Set loading state
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;
    if (spinner) spinner.style.display = "inline";

    try {
      // Simulate form submission
      await this.simulateFormSubmission(formObject);

      // Show success modal
      this.showModal(
        "success",
        "Message Sent Successfully!",
        "Thank you for contacting us! We'll get back to you within 2 hours.",
        "✅"
      );

      // Reset form
      form.reset();

      // Clear any error states
      fields.forEach((field) => this.clearFieldError(field));
    } catch (error) {
      // Show error modal
      this.showModal(
        "error",
        "Sending Failed",
        "Failed to send message. Please try again or contact us directly.",
        "❌"
      );
    } finally {
      // Reset button state to original
      submitBtn.textContent = originalText || "Send Message";
      submitBtn.disabled = originalDisabled;
      if (spinner) spinner.style.display = "none";

      // Additional safety check to ensure button is properly reset
      setTimeout(() => {
        if (submitBtn.textContent.trim() !== "Send Message") {
          submitBtn.textContent = "Send Message";
        }
        submitBtn.disabled = false;
      }, 100);
    }
  }

  simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate network delay and potential failure
        const shouldFail = Math.random() < 0.1; // 10% chance of failure for demo

        if (shouldFail) {
          reject(new Error("Network error"));
          return;
        }

        // In a real application, this would send the data to a server
        console.log("Contact form data:", data);

        // Save to localStorage for demo purposes
        const contacts = JSON.parse(
          localStorage.getItem("pixelVaultContacts") || "[]"
        );
        contacts.push({
          ...data,
          id: Date.now(),
          date: new Date().toISOString(),
          status: "new",
        });
        localStorage.setItem("pixelVaultContacts", JSON.stringify(contacts));

        resolve();
      }, 2000);
    });
  }

  openGoogleMaps() {
    const address = "123 Gaming Street, Tech City, TC 12345, United States";
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

    // Show info modal before opening
    this.showModal(
      "info",
      "Opening Google Maps",
      "Redirecting you to Google Maps to show our office location...",
      "🗺️"
    );

    setTimeout(() => {
      window.open(mapsUrl, "_blank");
      this.closeModal();
    }, 1500);
  }

  showNotification(message, type = "info") {
    // Fallback to old notification system if needed
    const event = new CustomEvent("showNotification", {
      detail: { message, type },
    });
    window.dispatchEvent(event);
  }
}

// Initialize contact page manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ContactPageManager();
});
