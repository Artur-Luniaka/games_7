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
                    <div class="footer-brand">
                        <img src="assets/public/logo-icon.png" alt="Logo" class="footer-logo-icon">
                        <span class="footer-brand-text">BeyondProgressivePlay</span>
                    </div>

                    <div class="footer-links-container">
                        <div class="footer-section">
                            <h3 class="footer-heading">Quick Links</h3>
                            <ul class="footer-links">
                                <li><a href="catalog.html" class="footer-link">Games</a></li>
                                <li><a href="about.html" class="footer-link">About Us</a></li>
                                <li><a href="./#trending-section" class="footer-link">Trends</a></li>
                            </ul>
                        </div>
                        
                        <div class="footer-section">
                            <h3 class="footer-heading">Support</h3>
                            <ul class="footer-links">
                                <li><a href="privacy.html" class="footer-link">Privacy Policy</a></li>
                                <li><a href="terms.html" class="footer-link">Terms of Service</a></li>
                                <li><a href="refund.html" class="footer-link">Return & Refund</a></li>
                                <li><a href="shipping.html" class="footer-link">Shipping & Delivery</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="footer-bottom">
                    <p class="copyright">
                        © 2025 BeyondProgressivePlay.com | All rights reserved.
                    </p>
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
