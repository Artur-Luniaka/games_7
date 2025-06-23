// Homepage Module - PixelVault Gaming Store
// This module handles ONLY the homepage sections, separate from catalog logic

const homepageModule = {
  gamesData: [],

  async initialize() {
    try {
      await this.loadGamesData();
      this.renderArmoryGames();
      this.attachEventListeners();
    } catch (error) {
      console.error("Failed to initialize homepage:", error);
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

  renderArmoryGames() {
    const armoryGrid = document.getElementById("armory-carousel-grid");
    if (!armoryGrid) return;

    armoryGrid.innerHTML = "";

    // Show first 8 games in the armory
    const armoryGames = this.gamesData.slice(0, 8);

    armoryGames.forEach((game) => {
      const gameCard = this.createArmoryGameCard(game);
      armoryGrid.appendChild(gameCard);
    });
  },

  createArmoryGameCard(gameData) {
    const card = document.createElement("div");
    card.className = "game-card";
    card.setAttribute("data-game-id", gameData.id);

    // Use the cover_image from JSON data (now standardized as game-1.jpg, game-2.jpg, etc.)
    const imageUrl = `assets/public/${gameData.media.cover_image}`;

    card.innerHTML = `
      <img src="${imageUrl}" alt="${gameData.title}" class="game-card-img" onerror="this.style.display='none'">
      <div class="game-card-body">
          <h3 class="game-card-title">${gameData.title}</h3>
          <p class="game-card-price">$${gameData.price}</p>
      </div>
    `;

    // Add click handler for navigation
    card.addEventListener("click", () => {
      window.location.href = `game-detail.html?id=${gameData.id}`;
    });

    return card;
  },

  attachEventListeners() {
    // Handle trending card clicks
    document.addEventListener("click", (event) => {
      const trendingCard = event.target.closest(".trending-card");
      if (trendingCard) {
        // Navigate to catalog page when trending cards are clicked
        window.location.href = "catalog.html";
      }
    });

    // Handle community gallery clicks
    document.addEventListener("click", (event) => {
      const galleryCard = event.target.closest(".gallery-card");
      if (galleryCard) {
        // Could open a modal or navigate to community page
        console.log("Gallery card clicked");
      }
    });
  },
};

// Initialize homepage when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  homepageModule.initialize();
});

export default homepageModule;
