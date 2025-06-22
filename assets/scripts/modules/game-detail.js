// Game Detail Page Module
class GameDetailManager {
  constructor() {
    this.gameData = null;
    this.currentGameId = null;
    this.init();
  }

  async init() {
    await this.loadGameData();
    this.setupEventListeners();
    this.initializeTabs();
  }

  async loadGameData() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      this.currentGameId = urlParams.get("id") || "1";

      const response = await fetch("assets/data/games-catalog.json");
      const gamesData = await response.json();

      this.gameData = gamesData.games.find(
        (game) => game.id === this.currentGameId
      );

      if (!this.gameData) {
        this.gameData = gamesData.games[0]; // Fallback to first game
      }

      this.renderGameDetails();
    } catch (error) {
      console.error("Error loading game data:", error);
      this.showErrorMessage();
    }
  }

  renderGameDetails() {
    this.updatePageTitle();
    this.renderGameHeader();
    this.renderGameMedia();
    this.renderGameInfo();
    this.renderPurchaseSection();
    this.renderSystemRequirements();
    this.renderRelatedGames();
  }

  updatePageTitle() {
    document.title = `${this.gameData.title} - PixelVault Gaming Store`;
  }

  renderGameHeader() {
    // Update breadcrumb
    const categoryLink = document.querySelector(".category-link");
    if (categoryLink) {
      categoryLink.textContent = this.gameData.genres[0];
      categoryLink.href = `index.html?category=${this.gameData.genres[0].toLowerCase()}`;
    }

    const currentGame = document.querySelector(".current-game");
    if (currentGame) {
      currentGame.textContent = this.gameData.title;
    }

    // Update main game title
    const gameTitle = document.getElementById("game-title");
    if (gameTitle) {
      gameTitle.textContent = this.gameData.title;
    }

    // Update meta information
    const gameDeveloper = document.getElementById("game-developer");
    const gamePublisher = document.getElementById("game-publisher");
    const gameReleaseDate = document.getElementById("game-release-date");

    if (gameDeveloper) gameDeveloper.textContent = this.gameData.developer;
    if (gamePublisher) gamePublisher.textContent = this.gameData.publisher;
    if (gameReleaseDate)
      gameReleaseDate.textContent = this.gameData.releaseDate;

    // Update rating
    this.updateGameRating();
  }

  updateGameRating() {
    const starsContainer = document.getElementById("game-stars");
    const ratingText = document.getElementById("rating-text");

    if (starsContainer && ratingText) {
      const rating = this.gameData.rating;
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 !== 0;

      starsContainer.innerHTML = "";

      for (let i = 0; i < 5; i++) {
        const star = document.createElement("span");
        star.className = "star";

        if (i < fullStars) {
          star.textContent = "★";
          star.style.color = "#f1c40f";
        } else if (i === fullStars && hasHalfStar) {
          star.textContent = "☆";
          star.style.color = "#f1c40f";
        } else {
          star.textContent = "☆";
          star.style.color = "#ddd";
        }

        starsContainer.appendChild(star);
      }

      ratingText.textContent = `${rating}/5`;
    }
  }

  renderGameMedia() {
    // Update main image
    const mainImage = document.getElementById("game-main-image");
    if (mainImage) {
      mainImage.src = this.gameData.media.coverImage;
      mainImage.alt = this.gameData.title;
    }

    // Render screenshots
    this.renderScreenshots();
  }

  renderScreenshots() {
    const screenshotsContainer = document.getElementById("game-screenshots");
    if (!screenshotsContainer || !this.gameData.media.screenshots) return;

    screenshotsContainer.innerHTML = "";

    this.gameData.media.screenshots.forEach((screenshot, index) => {
      const screenshotItem = document.createElement("div");
      screenshotItem.className = "screenshot-item";

      const img = document.createElement("img");
      img.src = screenshot;
      img.alt = `${this.gameData.title} screenshot ${index + 1}`;
      img.addEventListener("click", () => this.openScreenshotModal(screenshot));

      screenshotItem.appendChild(img);
      screenshotsContainer.appendChild(screenshotItem);
    });
  }

  openScreenshotModal(screenshotUrl) {
    // Create modal for screenshot viewing
    const modal = document.createElement("div");
    modal.className = "screenshot-modal";
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <img src="${screenshotUrl}" alt="Screenshot" />
      </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.classList.contains("modal-close")) {
        document.body.removeChild(modal);
      }
    });
  }

  renderGameInfo() {
    // Update description
    const description = document.getElementById("game-description");
    if (description) {
      description.innerHTML = `<p>${this.gameData.description}</p>`;
    }

    // Render features
    this.renderFeatures();

    // Render platforms
    this.renderPlatforms();

    // Render genres
    this.renderGenres();
  }

  renderFeatures() {
    const featuresContainer = document.querySelector(".features-list");
    if (!featuresContainer || !this.gameData.features) return;

    featuresContainer.innerHTML = "";

    this.gameData.features.forEach((feature) => {
      const li = document.createElement("li");
      li.textContent = feature;
      featuresContainer.appendChild(li);
    });
  }

  renderPlatforms() {
    const platformsContainer = document.querySelector(".platform-badges");
    if (!platformsContainer || !this.gameData.platforms) return;

    platformsContainer.innerHTML = "";

    this.gameData.platforms.forEach((platform) => {
      const badge = document.createElement("div");
      badge.className = "platform-badge";
      badge.textContent = platform;
      platformsContainer.appendChild(badge);
    });
  }

  renderGenres() {
    const genresContainer = document.querySelector(".genre-tags");
    if (!genresContainer || !this.gameData.genres) return;

    genresContainer.innerHTML = "";

    this.gameData.genres.forEach((genre) => {
      const tag = document.createElement("div");
      tag.className = "genre-tag";
      tag.textContent = genre;
      tag.addEventListener("click", () => {
        window.location.href = `index.html?category=${genre.toLowerCase()}`;
      });
      genresContainer.appendChild(tag);
    });
  }

  renderPurchaseSection() {
    // Update pricing
    const currentPrice = document.getElementById("current-price");
    const originalPrice = document.getElementById("original-price");
    const discountBadge = document.getElementById("discount-badge");

    if (currentPrice) {
      currentPrice.textContent = `$${this.gameData.price.toFixed(2)}`;
    }

    if (this.gameData.discount > 0) {
      const originalPriceValue =
        this.gameData.price / (1 - this.gameData.discount / 100);

      if (originalPrice) {
        originalPrice.textContent = `$${originalPriceValue.toFixed(2)}`;
        originalPrice.style.display = "block";
      }

      if (discountBadge) {
        discountBadge.textContent = `-${this.gameData.discount}%`;
        discountBadge.style.display = "block";
      }
    } else {
      if (originalPrice) originalPrice.style.display = "none";
      if (discountBadge) discountBadge.style.display = "none";
    }

    // Setup purchase buttons
    this.setupPurchaseButtons();
  }

  setupPurchaseButtons() {
    const addToCartBtn = document.getElementById("add-to-cart-btn");
    const wishlistBtn = document.getElementById("wishlist-btn");

    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => this.addToCart());
    }

    if (wishlistBtn) {
      wishlistBtn.addEventListener("click", () => this.addToWishlist());
    }
  }

  addToCart() {
    const cartItem = {
      id: this.gameData.id,
      title: this.gameData.title,
      price: this.gameData.price,
      image: this.gameData.media.coverImage,
      quantity: 1,
    };

    // Dispatch custom event for cart management
    const event = new CustomEvent("addToCart", { detail: cartItem });
    window.dispatchEvent(event);

    // Show success notification
    this.showNotification("Game added to cart!", "success");
  }

  addToWishlist() {
    // Add to wishlist functionality
    this.showNotification("Game added to wishlist!", "success");
  }

  renderSystemRequirements() {
    const minRequirements = document.getElementById("min-requirements");
    const recRequirements = document.getElementById("rec-requirements");

    if (minRequirements && this.gameData.systemRequirements.minimum) {
      this.renderRequirementsList(
        minRequirements,
        this.gameData.systemRequirements.minimum
      );
    }

    if (recRequirements && this.gameData.systemRequirements.recommended) {
      this.renderRequirementsList(
        recRequirements,
        this.gameData.systemRequirements.recommended
      );
    }
  }

  renderRequirementsList(container, requirements) {
    container.innerHTML = "";

    Object.entries(requirements).forEach(([key, value]) => {
      const item = document.createElement("div");
      item.className = "requirement-item";

      const label = document.createElement("span");
      label.className = "requirement-label";
      label.textContent = this.formatRequirementLabel(key);

      const valueSpan = document.createElement("span");
      valueSpan.className = "requirement-value";
      valueSpan.textContent = value;

      item.appendChild(label);
      item.appendChild(valueSpan);
      container.appendChild(item);
    });
  }

  formatRequirementLabel(key) {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  }

  renderRelatedGames() {
    const relatedContainer = document.getElementById("related-games");
    if (!relatedContainer) return;

    // Get games from same genre
    this.loadRelatedGames().then((relatedGames) => {
      relatedContainer.innerHTML = "";

      relatedGames.slice(0, 4).forEach((game) => {
        const gameCard = this.createRelatedGameCard(game);
        relatedContainer.appendChild(gameCard);
      });
    });
  }

  async loadRelatedGames() {
    try {
      const response = await fetch("assets/data/games-catalog.json");
      const gamesData = await response.json();

      return gamesData.games.filter(
        (game) =>
          game.id !== this.currentGameId &&
          game.genres.some((genre) => this.gameData.genres.includes(genre))
      );
    } catch (error) {
      console.error("Error loading related games:", error);
      return [];
    }
  }

  createRelatedGameCard(game) {
    const card = document.createElement("div");
    card.className = "related-game-card";
    card.addEventListener("click", () => {
      window.location.href = `game-detail.html?id=${game.id}`;
    });

    card.innerHTML = `
      <img src="${game.media.coverImage}" alt="${
      game.title
    }" class="related-game-image" />
      <div class="related-game-info">
        <h4 class="related-game-title">${game.title}</h4>
        <div class="related-game-price">$${game.price.toFixed(2)}</div>
      </div>
    `;

    return card;
  }

  initializeTabs() {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabPanels = document.querySelectorAll(".tab-panel");

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetTab = button.getAttribute("data-tab");

        // Remove active class from all buttons and panels
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        tabPanels.forEach((panel) => panel.classList.remove("active"));

        // Add active class to clicked button and corresponding panel
        button.classList.add("active");
        const targetPanel = document.getElementById(`${targetTab}-panel`);
        if (targetPanel) {
          targetPanel.classList.add("active");
        }
      });
    });
  }

  setupEventListeners() {
    // Trailer button
    const playTrailerBtn = document.getElementById("play-trailer-btn");
    if (playTrailerBtn) {
      playTrailerBtn.addEventListener("click", () => this.openTrailerModal());
    }

    // Video modal close
    const modalClose = document.getElementById("modal-close");
    if (modalClose) {
      modalClose.addEventListener("click", () => this.closeVideoModal());
    }

    // Close modal on outside click
    const videoModal = document.getElementById("video-modal");
    if (videoModal) {
      videoModal.addEventListener("click", (e) => {
        if (e.target === videoModal) {
          this.closeVideoModal();
        }
      });
    }
  }

  openTrailerModal() {
    const videoModal = document.getElementById("video-modal");
    const trailerVideo = document.getElementById("trailer-video");

    if (videoModal && trailerVideo && this.gameData.media.trailerUrl) {
      trailerVideo.src = this.gameData.media.trailerUrl;
      videoModal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  closeVideoModal() {
    const videoModal = document.getElementById("video-modal");
    const trailerVideo = document.getElementById("trailer-video");

    if (videoModal && trailerVideo) {
      videoModal.classList.remove("active");
      trailerVideo.src = "";
      document.body.style.overflow = "auto";
    }
  }

  showNotification(message, type = "info") {
    const event = new CustomEvent("showNotification", {
      detail: { message, type },
    });
    window.dispatchEvent(event);
  }

  showErrorMessage() {
    const mainContent = document.querySelector(".game-detail-content");
    if (mainContent) {
      mainContent.innerHTML = `
        <div class="error-message">
          <h2>Oops! Something went wrong</h2>
          <p>We couldn't load the game details. Please try again later.</p>
          <a href="index.html" class="primary-btn">Back to Home</a>
        </div>
      `;
    }
  }
}

// Initialize game detail manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new GameDetailManager();
});
