// Catalog Page Module - PixelVault Gaming Store
// This module handles ONLY the catalog page, separate from homepage logic

const catalogPageModule = {
  gamesData: [],
  currentFilter: "all",
  currentSort: "featured",

  async initialize() {
    try {
      await this.loadGamesData();
      this.renderFilteredGames();
      this.attachEventListeners();
    } catch (error) {
      console.error("Failed to initialize catalog page:", error);
    }
  },

  async loadGamesData() {
    try {
      const response = await fetch("assets/data/games-catalog.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.gamesData = data.featured_games;
    } catch (error) {
      console.error("Failed to load games data:", error);
      this.gamesData = [];
    }
  },

  renderFilteredGames() {
    let filteredGames = [...this.gamesData];

    // Apply filters
    if (this.currentFilter !== "all") {
      filteredGames = filteredGames.filter(
        (game) =>
          game.genres.includes(this.currentFilter) ||
          game.platforms.includes(this.currentFilter)
      );
    }

    // Apply sorting
    switch (this.currentSort) {
      case "price-low":
        filteredGames.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filteredGames.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filteredGames.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filteredGames.sort(
          (a, b) => new Date(b.release_date) - new Date(a.release_date)
        );
        break;
      case "oldest":
        filteredGames.sort(
          (a, b) => new Date(a.release_date) - new Date(b.release_date)
        );
        break;
      case "name-asc":
        filteredGames.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        filteredGames.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        // Keep original order for 'featured' and 'relevance'
        break;
    }

    this.renderGames(filteredGames);
  },

  renderGames(games) {
    const gamesGrid = document.getElementById("catalog-grid");
    const resultsCount = document.getElementById("results-count");

    if (!gamesGrid || !resultsCount) return;

    gamesGrid.innerHTML = "";
    resultsCount.textContent = games.length;

    if (games.length === 0) {
      gamesGrid.innerHTML = `
        <div class="no-games-found">
          <div class="no-games-icon">🎮</div>
          <h3>No games found</h3>
          <p>Try adjusting your filters or search criteria</p>
        </div>
      `;
      return;
    }

    games.forEach((game, index) => {
      const gameCard = this.createCatalogGameCard(game, index);
      gamesGrid.appendChild(gameCard);
    });
  },

  createCatalogGameCard(gameData, index) {
    const card = document.createElement("div");
    card.className = `game-card game-card-${index + 1}`;
    card.setAttribute("data-game-id", gameData.id);

    // Remove unique styling - all cards should be straight
    // const cardStyles = this.getUniqueCardStyles(index);
    // card.style.cssText = cardStyles;

    card.innerHTML = `
      <div class="game-card-image">
        <div class="game-cover" style="background-image: ${this.getGameCoverGradient(
          gameData
        )}">
          <div class="game-overlay">
            <div class="game-platforms">
              ${gameData.platforms
                .map(
                  (platform) =>
                    `<span class="platform-badge">${platform}</span>`
                )
                .join("")}
            </div>
            <div class="game-rating">
              <span class="rating-stars">${this.generateStars(
                gameData.rating
              )}</span>
              <span class="rating-score">${gameData.rating}</span>
            </div>
          </div>
          ${
            gameData.discount_percent > 0
              ? `<div class="discount-badge">-${gameData.discount_percent}%</div>`
              : ""
          }
        </div>
      </div>
      
      <div class="game-card-content">
        <div class="game-header">
          <h3 class="game-title">${gameData.title}</h3>
          <div class="game-developer">${gameData.developer}</div>
        </div>
        
        <div class="game-description">
          ${this.truncateText(gameData.description, 120)}
        </div>
        
        <div class="game-tags">
          ${gameData.tags
            .slice(0, 3)
            .map((tag) => `<span class="game-tag">${tag}</span>`)
            .join("")}
        </div>
        
        <div class="game-footer">
          <div class="game-price">
            ${
              gameData.discount_percent > 0
                ? `<span class="original-price">$${gameData.original_price}</span>`
                : ""
            }
            <span class="current-price">$${gameData.price}</span>
          </div>
          
          <button class="add-to-cart-btn" data-game-id="${gameData.id}">
            <span class="btn-icon">🛒</span>
            <span class="btn-text">Add to Cart</span>
          </button>
        </div>
      </div>
    `;

    // Remove unique hover effects - all cards should behave the same
    // this.addUniqueHoverEffects(card, index);

    return card;
  },

  getUniqueCardStyles(index) {
    const styles = [
      "transform: rotate(-1deg);",
      "transform: rotate(1deg);",
      "transform: scale(1.02);",
      "transform: translateY(-5px);",
      "transform: rotate(0.5deg) scale(1.01);",
      "transform: translateX(-3px);",
      "transform: rotate(-0.5deg) translateY(-3px);",
      "transform: scale(1.03);",
      "transform: rotate(1.5deg);",
      "transform: translateY(-8px) rotate(-1deg);",
      "transform: scale(1.01) translateX(2px);",
      "transform: rotate(0.8deg) scale(1.02);",
    ];

    return styles[index % styles.length];
  },

  getGameCoverGradient(gameData) {
    // Return the actual image URL from the JSON data instead of gradients
    return `url(assets/public/${gameData.media.cover_image})`;
  },

  generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      "★".repeat(fullStars) + (hasHalfStar ? "☆" : "") + "☆".repeat(emptyStars)
    );
  },

  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  },

  addUniqueHoverEffects(card, index) {
    const effects = [
      () => (card.style.transform = "rotate(-2deg) scale(1.05)"),
      () => (card.style.transform = "rotate(2deg) scale(1.05)"),
      () => (card.style.transform = "scale(1.08) translateY(-10px)"),
      () => (card.style.transform = "translateY(-15px) rotate(1deg)"),
      () => (card.style.transform = "rotate(-1deg) scale(1.06)"),
      () => (card.style.transform = "translateX(-5px) scale(1.05)"),
      () => (card.style.transform = "rotate(1.5deg) translateY(-8px)"),
      () => (card.style.transform = "scale(1.07)"),
      () => (card.style.transform = "rotate(2.5deg) scale(1.04)"),
      () => (card.style.transform = "translateY(-12px) rotate(-1.5deg)"),
      () => (card.style.transform = "scale(1.06) translateX(3px)"),
      () => (card.style.transform = "rotate(1deg) scale(1.05)"),
    ];

    const resetEffects = [
      () => (card.style.transform = "rotate(-1deg)"),
      () => (card.style.transform = "rotate(1deg)"),
      () => (card.style.transform = "scale(1.02)"),
      () => (card.style.transform = "translateY(-5px)"),
      () => (card.style.transform = "rotate(0.5deg) scale(1.01)"),
      () => (card.style.transform = "translateX(-3px)"),
      () => (card.style.transform = "rotate(-0.5deg) translateY(-3px)"),
      () => (card.style.transform = "scale(1.03)"),
      () => (card.style.transform = "rotate(1.5deg)"),
      () => (card.style.transform = "translateY(-8px) rotate(-1deg)"),
      () => (card.style.transform = "scale(1.01) translateX(2px)"),
      () => (card.style.transform = "rotate(0.8deg) scale(1.02)"),
    ];

    card.addEventListener("mouseenter", effects[index % effects.length]);
    card.addEventListener(
      "mouseleave",
      resetEffects[index % resetEffects.length]
    );
  },

  attachEventListeners() {
    document.addEventListener("click", (event) => {
      if (event.target.closest(".add-to-cart-btn")) {
        const button = event.target.closest(".add-to-cart-btn");
        const gameId = button.getAttribute("data-game-id");
        this.handleAddToCart(gameId, button);
      }

      if (event.target.closest(".game-card")) {
        const card = event.target.closest(".game-card");
        const gameId = card.getAttribute("data-game-id");
        if (!event.target.closest(".add-to-cart-btn")) {
          this.handleGameCardClick(gameId);
        }
      }
    });

    // Sort functionality
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (event) => {
        const sortValue = event.target.value;
        // Map catalog.html sort values to our sort values
        const sortMap = {
          "price-low": "price-low",
          "price-high": "price-high",
          rating: "rating",
          "release-date": "newest",
          "name-asc": "name-asc",
          "name-desc": "name-desc",
          relevance: "featured",
        };
        this.sortGames(sortMap[sortValue] || "featured");
      });
    }

    // Search functionality
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");

    if (searchInput) {
      searchInput.addEventListener("input", (event) => {
        this.searchGames(event.target.value);
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener("click", () => {
        const query = searchInput ? searchInput.value : "";
        this.searchGames(query);
      });
    }
  },

  handleAddToCart(gameId, button) {
    const gameData = this.gamesData.find((game) => game.id === gameId);
    if (!gameData) return;

    // Add loading state
    button.innerHTML =
      '<span class="btn-icon">⏳</span><span class="btn-text">Adding...</span>';
    button.disabled = true;

    // Simulate API call
    setTimeout(() => {
      // Import header module to add to cart
      import("./header-module.js").then((module) => {
        const headerModule = module.default;
        headerModule.addToCart(gameData);

        // Reset button
        button.innerHTML =
          '<span class="btn-icon">✅</span><span class="btn-text">Added!</span>';

        setTimeout(() => {
          button.innerHTML =
            '<span class="btn-icon">🛒</span><span class="btn-text">Add to Cart</span>';
          button.disabled = false;
        }, 1500);
      });
    }, 500);
  },

  handleGameCardClick(gameId) {
    // Navigate to game detail page
    window.location.href = `game-detail.html?id=${gameId}`;
  },

  filterGames(filter) {
    this.currentFilter = filter;
    this.renderFilteredGames();
  },

  sortGames(sortBy) {
    this.currentSort = sortBy;
    this.renderFilteredGames();
  },

  searchGames(query) {
    if (!query.trim()) {
      this.renderFilteredGames();
      return;
    }

    const searchResults = this.gamesData.filter(
      (game) =>
        game.title.toLowerCase().includes(query.toLowerCase()) ||
        game.developer.toLowerCase().includes(query.toLowerCase()) ||
        game.genres.some((genre) =>
          genre.toLowerCase().includes(query.toLowerCase())
        ) ||
        game.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
    );

    this.renderGames(searchResults);
  },
};

// Initialize catalog page when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  catalogPageModule.initialize();
});

export default catalogPageModule;
