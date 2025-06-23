// Game Detail Page Module - PixelVault Gaming Store
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
    this.initializeNotifications();
  }

  async loadGameData() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      this.currentGameId =
        urlParams.get("id") || "cyberpunk-2077-phantom-liberty";

      const response = await fetch("assets/data/games-catalog.json");
      const gamesData = await response.json();

      // Ищем игру в featured_games
      this.gameData = gamesData.featured_games.find(
        (game) => game.id === this.currentGameId
      );

      if (!this.gameData) {
        this.gameData = gamesData.featured_games[0]; // Fallback to first game
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
    this.renderReviews();
    this.renderAchievements();
    this.renderRelatedGames();
  }

  updatePageTitle() {
    document.title = `${this.gameData.title} - PixelVault Gaming Store`;

    // Update breadcrumb
    const currentGameTitle = document.getElementById("current-game-title");
    if (currentGameTitle) {
      currentGameTitle.textContent = this.gameData.title;
    }
  }

  renderGameHeader() {
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
    if (gameReleaseDate) {
      const date = new Date(this.gameData.release_date);
      gameReleaseDate.textContent = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    // Update rating
    this.updateGameRating();
  }

  updateGameRating() {
    const starsContainer = document.getElementById("game-stars");
    const ratingText = document.getElementById("rating-text");
    const reviewCount = document.getElementById("review-count");

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
          star.style.color = "#ffd700";
        } else if (i === fullStars && hasHalfStar) {
          star.textContent = "☆";
          star.style.color = "#ffd700";
        } else {
          star.textContent = "☆";
          star.style.color = "#ddd";
        }

        starsContainer.appendChild(star);
      }

      ratingText.textContent = `${rating}/5`;
    }

    if (reviewCount) {
      reviewCount.textContent = `(${this.gameData.review_count.toLocaleString()} reviews)`;
    }
  }

  renderGameMedia() {
    // Update main image
    const mainImage = document.getElementById("game-main-image");
    if (mainImage) {
      mainImage.src = `assets/public/${this.gameData.media.cover_image}`;
      mainImage.alt = this.gameData.title;
    }
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

    // Render tags
    this.renderTags();
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
      const badge = document.createElement("span");
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
      const tag = document.createElement("span");
      tag.className = "genre-tag";
      tag.textContent = genre;
      genresContainer.appendChild(tag);
    });
  }

  renderTags() {
    const tagsContainer = document.querySelector(".tag-cloud");
    if (!tagsContainer || !this.gameData.tags) return;

    tagsContainer.innerHTML = "";

    this.gameData.tags.forEach((tag) => {
      const tagElement = document.createElement("span");
      tagElement.className = "game-tag";
      tagElement.textContent = tag;
      tagsContainer.appendChild(tagElement);
    });
  }

  renderPurchaseSection() {
    // Update price information
    const currentPrice = document.getElementById("current-price");
    const originalPrice = document.getElementById("original-price");
    const discountBadge = document.getElementById("discount-badge");

    if (currentPrice) {
      currentPrice.textContent = `$${this.gameData.price.toFixed(2)}`;
    }

    if (originalPrice && this.gameData.original_price) {
      originalPrice.textContent = `$${this.gameData.original_price.toFixed(2)}`;
      originalPrice.style.display = "block";
    } else if (originalPrice) {
      originalPrice.style.display = "none";
    }

    if (discountBadge && this.gameData.discount_percent > 0) {
      discountBadge.textContent = `-${this.gameData.discount_percent}%`;
      discountBadge.style.display = "block";
    } else if (discountBadge) {
      discountBadge.style.display = "none";
    }

    // Update game stats
    this.updateGameStats();

    // Setup purchase buttons
    this.setupPurchaseButtons();
  }

  updateGameStats() {
    const fileSize = document.getElementById("file-size");
    const languages = document.getElementById("languages");
    const multiplayer = document.getElementById("multiplayer");

    if (fileSize) {
      // Генерируем случайный размер файла
      const sizes = ["25 GB", "50 GB", "75 GB", "100 GB", "125 GB"];
      fileSize.textContent = sizes[Math.floor(Math.random() * sizes.length)];
    }

    if (languages) {
      const languageOptions = [
        "English, Spanish, French",
        "English, German, Italian",
        "English, Japanese, Korean",
        "English, Portuguese, Russian",
      ];
      languages.textContent =
        languageOptions[Math.floor(Math.random() * languageOptions.length)];
    }

    if (multiplayer) {
      const hasMultiplayer = Math.random() > 0.3;
      multiplayer.textContent = hasMultiplayer ? "Yes" : "No";
    }
  }

  setupPurchaseButtons() {
    const addToCartBtn = document.getElementById("add-to-cart-btn");
    const buyNowBtn = document.getElementById("buy-now-btn");

    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => this.addToCart());
    }

    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", () => this.buyNow());
    }
  }

  updateCartStorage() {
    let cart = JSON.parse(localStorage.getItem("pixelvault-cart") || "[]");
    const existingItem = cart.find((item) => item.id === this.gameData.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: this.gameData.id,
        title: this.gameData.title,
        price: this.gameData.price,
        quantity: 1,
        image: this.gameData.media.cover_image,
      });
    }
    localStorage.setItem("pixelvault-cart", JSON.stringify(cart));
    this.updateCartCounter();
  }

  addToCart() {
    const addToCartBtn = document.getElementById("add-to-cart-btn");
    if (
      addToCartBtn.classList.contains("processing") ||
      addToCartBtn.classList.contains("success")
    ) {
      return; // Предотвращаем повторные нажатия
    }

    const originalContent = addToCartBtn.innerHTML;
    addToCartBtn.disabled = true;
    addToCartBtn.classList.add("processing");
    addToCartBtn.innerHTML = `<span class="btn-spinner"></span> Processing...`;

    setTimeout(() => {
      this.updateCartStorage();

      addToCartBtn.classList.remove("processing");
      addToCartBtn.classList.add("success");
      addToCartBtn.innerHTML = `<span class="btn-check-icon">✔</span> Added!`;

      setTimeout(() => {
        addToCartBtn.disabled = false;
        addToCartBtn.classList.remove("success");
        addToCartBtn.innerHTML = originalContent;
      }, 2000); // Возвращаем кнопку в исходное состояние через 2 секунды
    }, 1500); // Имитируем запрос к серверу
  }

  buyNow() {
    const buyNowBtn = document.getElementById("buy-now-btn");
    buyNowBtn.disabled = true;
    buyNowBtn.classList.add("redirecting");
    buyNowBtn.innerHTML = `<span class="btn-spinner"></span> Redirecting...`;

    this.updateCartStorage();

    setTimeout(() => {
      window.location.href = "cart.html";
    }, 1500); // Задержка перед перенаправлением
  }

  updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem("pixelvault-cart") || "[]");
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const cartCounter = document.getElementById("cart-counter");
    if (cartCounter) {
      cartCounter.textContent = totalItems;
    }
  }

  renderSystemRequirements() {
    const minRequirements = document.getElementById("min-requirements");
    const recRequirements = document.getElementById("rec-requirements");

    if (minRequirements && this.gameData.system_requirements?.minimum) {
      this.renderRequirementsList(
        minRequirements,
        this.gameData.system_requirements.minimum
      );
    }

    if (recRequirements && this.gameData.system_requirements?.recommended) {
      this.renderRequirementsList(
        recRequirements,
        this.gameData.system_requirements.recommended
      );
    } else if (recRequirements && this.gameData.system_requirements?.minimum) {
      // Если нет рекомендуемых требований, используем минимальные как рекомендуемые
      this.renderRequirementsList(
        recRequirements,
        this.gameData.system_requirements.minimum
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
    return (
      key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")
    );
  }

  renderReviews() {
    const reviewsList = document.getElementById("reviews-list");
    if (!reviewsList) return;

    // Генерируем примеры отзывов
    const sampleReviews = [
      {
        name: "GamerPro_123",
        rating: 5,
        date: "2 days ago",
        text: "Absolutely amazing game! The graphics are stunning and the gameplay is incredibly smooth. Highly recommend!",
      },
      {
        name: "GameMaster_456",
        rating: 4,
        date: "1 week ago",
        text: "Great game overall. The story is engaging and the mechanics are well thought out. Minor bugs but nothing game-breaking.",
      },
      {
        name: "PixelVault_Fan",
        rating: 5,
        date: "3 days ago",
        text: "This exceeded all my expectations. The developers really outdid themselves with this one. Worth every penny!",
      },
    ];

    reviewsList.innerHTML = "";

    sampleReviews.forEach((review) => {
      const reviewItem = document.createElement("div");
      reviewItem.className = "review-item";

      const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);

      reviewItem.innerHTML = `
        <div class="review-header">
          <span class="reviewer-name">${review.name}</span>
          <span class="review-date">${review.date}</span>
        </div>
        <div class="review-rating">${stars}</div>
        <div class="review-text">${review.text}</div>
      `;

      reviewsList.appendChild(reviewItem);
    });
  }

  renderAchievements() {
    const achievementsGrid = document.getElementById("achievements-grid");
    if (!achievementsGrid) return;

    // Генерируем примеры достижений
    const sampleAchievements = [
      {
        icon: "🏆",
        name: "First Steps",
        desc: "Complete the tutorial",
        points: 10,
      },
      { icon: "⚔️", name: "Warrior", desc: "Defeat 100 enemies", points: 25 },
      { icon: "🌟", name: "Explorer", desc: "Visit all locations", points: 50 },
      {
        icon: "💎",
        name: "Collector",
        desc: "Find all hidden items",
        points: 75,
      },
      {
        icon: "👑",
        name: "Champion",
        desc: "Complete the game on hardest difficulty",
        points: 100,
      },
      {
        icon: "🎯",
        name: "Sharpshooter",
        desc: "Achieve 100% accuracy",
        points: 30,
      },
    ];

    achievementsGrid.innerHTML = "";

    sampleAchievements.forEach((achievement) => {
      const achievementItem = document.createElement("div");
      achievementItem.className = "achievement-item";

      achievementItem.innerHTML = `
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-name">${achievement.name}</div>
        <div class="achievement-desc">${achievement.desc}</div>
        <div class="achievement-points">${achievement.points} points</div>
      `;

      achievementsGrid.appendChild(achievementItem);
    });
  }

  renderRelatedGames() {
    const relatedGamesContainer = document.getElementById("related-games");
    if (!relatedGamesContainer) return;

    // Показываем заглушку для связанных игр
    relatedGamesContainer.innerHTML = `
      <div class="related-game-card">
        <img src="assets/public/game-2.jpg" alt="Related Game" class="related-game-image">
        <div class="related-game-info">
          <div class="related-game-title">Starfield</div>
          <div class="related-game-price">$69.99</div>
        </div>
      </div>
      <div class="related-game-card">
        <img src="assets/public/game-3.jpg" alt="Related Game" class="related-game-image">
        <div class="related-game-info">
          <div class="related-game-title">Baldur's Gate 3</div>
          <div class="related-game-price">$59.99</div>
        </div>
      </div>
      <div class="related-game-card">
        <img src="assets/public/game-4.jpg" alt="Related Game" class="related-game-image">
        <div class="related-game-info">
          <div class="related-game-title">Mortal Kombat 1</div>
          <div class="related-game-price">$69.99</div>
        </div>
      </div>
    `;
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
    // Инициализируем систему уведомлений
    this.initializeNotifications();
  }

  initializeNotifications() {
    // Инициализируем систему уведомлений
    if (typeof notificationSystemModule !== "undefined") {
      notificationSystemModule.initializeNotifications();
    }
  }

  showNotification(message, type = "info") {
    if (typeof notificationSystemModule !== "undefined") {
      notificationSystemModule.showNotification(message, type);
    } else {
      // Fallback notification
      console.log(`${type.toUpperCase()}: ${message}`);
    }
  }

  showErrorMessage() {
    const main = document.querySelector(".game-detail-main");
    if (main) {
      main.innerHTML = `
        <div class="error-container" style="text-align: center; padding: 4rem 2rem;">
          <h2>Error Loading Game</h2>
          <p>Sorry, we couldn't load the game details. Please try again later.</p>
          <a href="catalog.html" class="btn primary-btn">Back to Catalog</a>
        </div>
      `;
    }
  }
}

// Initialize the game detail page
document.addEventListener("DOMContentLoaded", () => {
  new GameDetailManager();
});
