// Footer Module - PixelVault Gaming Store
const footerModule = {
  footerContainer: null,

  initializeFooter() {
    const footerContainer = document.getElementById("footer-container");
    if (!footerContainer) return;

    footerContainer.innerHTML = this.createFooterHTML();
    this.footerContainer = footerContainer;
    this.attachEventListeners();
  },

  createFooterHTML() {
    return `
            <footer class="site-footer">
                <div class="footer-content">
                    <div class="footer-section">
                        <div class="footer-logo">
                            <img src="assets/images/pixelvault-logo.png" alt="PixelVault" class="footer-logo-image">
                            <span class="footer-logo-text">PixelVault</span>
                        </div>
                        <p class="footer-description">
                            Your premier destination for PC and Xbox gaming. Discover the latest titles, exclusive deals, and join our vibrant gaming community.
                        </p>
                        <div class="social-links">
                            <a href="#" class="social-link" aria-label="Facebook">
                                <span class="social-icon">📘</span>
                            </a>
                            <a href="#" class="social-link" aria-label="Twitter">
                                <span class="social-icon">🐦</span>
                            </a>
                            <a href="#" class="social-link" aria-label="Instagram">
                                <span class="social-icon">📷</span>
                            </a>
                            <a href="#" class="social-link" aria-label="Discord">
                                <span class="social-icon">🎮</span>
                            </a>
                        </div>
                    </div>
                    
                    <div class="footer-section">
                        <h3 class="footer-heading">Quick Links</h3>
                        <ul class="footer-links">
                            <li><a href="index.html" class="footer-link">Home</a></li>
                            <li><a href="catalog.html" class="footer-link">Games</a></li>
                            <li><a href="about.html" class="footer-link">About Us</a></li>
                            <li><a href="contact.html" class="footer-link">Contact</a></li>
                            <li><a href="cart.html" class="footer-link">Cart</a></li>
                        </ul>
                    </div>
                    
                    <div class="footer-section">
                        <h3 class="footer-heading">Support</h3>
                        <ul class="footer-links">
                            <li><a href="privacy.html" class="footer-link">Privacy Policy</a></li>
                            <li><a href="terms.html" class="footer-link">Terms of Service</a></li>
                            <li><a href="refund.html" class="footer-link">Return & Refund</a></li>
                            <li><a href="shipping.html" class="footer-link">Shipping & Delivery</a></li>
                            <li><a href="contact.html" class="footer-link">Contact Support</a></li>
                        </ul>
                    </div>
                    
                    <div class="footer-section">
                        <h3 class="footer-heading">Contact Info</h3>
                        <div class="contact-info">
                            <div class="contact-item">
                                <span class="contact-icon">📧</span>
                                <span class="contact-text">support@pixelvault.com</span>
                            </div>
                            <div class="contact-item">
                                <span class="contact-icon">📞</span>
                                <span class="contact-text">+1 (555) 123-4567</span>
                            </div>
                            <div class="contact-item">
                                <span class="contact-icon">📍</span>
                                <span class="contact-text">123 Gaming Street, Tech City, TC 12345</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="footer-bottom">
                    <div class="footer-bottom-content">
                        <p class="copyright">
                            © 2024 PixelVault Gaming Store. All rights reserved.
                        </p>
                        <div class="footer-bottom-links">
                            <a href="privacy.html" class="footer-bottom-link">Privacy</a>
                            <a href="terms.html" class="footer-bottom-link">Terms</a>
                            <a href="refund.html" class="footer-bottom-link">Returns</a>
                        </div>
                    </div>
                </div>
            </footer>
        `;
  },

  attachEventListeners() {
    const footerLinks = document.querySelectorAll(".footer-link, .social-link");

    footerLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        this.handleFooterLinkClick(event);
      });
    });
  },

  handleFooterLinkClick(event) {
    const link = event.currentTarget;
    const href = link.getAttribute("href");

    // Add loading state
    link.classList.add("footer-link-loading");

    // Simulate navigation delay
    setTimeout(() => {
      link.classList.remove("footer-link-loading");
      // In a real app, this would navigate to the page
      console.log(`Navigating to: ${href}`);
    }, 300);
  },
};

// Initialize footer when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  footerModule.initializeFooter();
});

// Export for use in other modules
export default footerModule;
