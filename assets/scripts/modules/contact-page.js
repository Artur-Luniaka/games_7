// Contact Page Module
class ContactPageManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeFAQ();
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
  }

  initializeFAQ() {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");
      if (question) {
        question.addEventListener("click", () => this.toggleFAQ(item));
      }
    });
  }

  toggleFAQ(item) {
    const isActive = item.classList.contains("active");

    // Close all FAQ items
    document.querySelectorAll(".faq-item").forEach((faqItem) => {
      faqItem.classList.remove("active");
    });

    // Open clicked item if it wasn't active
    if (!isActive) {
      item.classList.add("active");
    }
  }

  async handleContactForm(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formObject = Object.fromEntries(formData);

    // Validate form
    if (!this.validateContactForm(formObject)) {
      return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector(".submit-btn");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
      // Simulate form submission
      await this.simulateFormSubmission(formObject);

      // Show success message
      this.showNotification(
        "Message sent successfully! We'll get back to you soon.",
        "success"
      );

      // Reset form
      e.target.reset();
    } catch (error) {
      this.showNotification(
        "Failed to send message. Please try again.",
        "error"
      );
    } finally {
      // Reset button state
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }

  validateContactForm(data) {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "subject",
      "message",
    ];

    for (const field of requiredFields) {
      if (!data[field] || data[field].trim() === "") {
        this.showNotification(
          `Please fill in the ${field
            .replace(/([A-Z])/g, " $1")
            .toLowerCase()} field.`,
          "error"
        );
        return false;
      }
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      this.showNotification("Please enter a valid email address.", "error");
      return false;
    }

    // Validate message length
    if (data.message.length < 10) {
      this.showNotification(
        "Message must be at least 10 characters long.",
        "error"
      );
      return false;
    }

    return true;
  }

  simulateFormSubmission(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
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

    window.open(mapsUrl, "_blank");
  }

  showNotification(message, type = "info") {
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
