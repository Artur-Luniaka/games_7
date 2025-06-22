# PixelVault - Premium Gaming Store

A modern, responsive gaming store website built with vanilla HTML, CSS, and JavaScript. Features a unique design with modular architecture and smooth animations.

## 🎮 Features

### Core Functionality

- **Responsive Design**: Mobile-first approach with breakpoints at 360px, 768px, and 1280px
- **Modular Architecture**: ES6+ modules with unique naming conventions
- **Dynamic Content**: Games loaded from JSON files with unique card designs
- **Shopping Cart**: LocalStorage-based cart with quantity management
- **Newsletter Signup**: Custom email validation with success/error handling

### Unique Design Elements

- **Hero Section**: Animated floating game cards with particle effects
- **Individual Game Cards**: Each card has unique styling and hover effects
- **Category Cards**: Animated icons with genre-specific animations
- **Platform Showcase**: Interactive device representations
- **Modern Color Scheme**: Orange-based palette (no purple/blue/acid colors)

### Technical Highlights

- **No Frameworks**: Pure HTML, CSS, JavaScript
- **ES6+ Syntax**: Modern JavaScript features throughout
- **Semantic HTML**: Accessible markup with proper ARIA labels
- **CSS Custom Properties**: Consistent design system with CSS variables
- **Smooth Animations**: CSS transitions and keyframe animations
- **LocalStorage Integration**: Persistent cart and newsletter subscriptions

## 🚀 Getting Started

### Prerequisites

- Modern web browser with ES6+ support
- Local web server (for module loading)

### Installation

1. Clone the repository
2. Open in a local web server (e.g., Live Server in VS Code)
3. Navigate to `index.html`

### File Structure

```
games_7/
├── index.html                 # Main page
├── assets/
│   ├── styles/               # CSS files
│   │   ├── core-styles.css
│   │   ├── header-styles.css
│   │   ├── footer-styles.css
│   │   ├── cart-styles.css
│   │   ├── hero-section.css
│   │   ├── featured-games.css
│   │   ├── gaming-categories.css
│   │   ├── platform-showcase.css
│   │   ├── community-highlights.css
│   │   └── newsletter-signup.css
│   ├── scripts/
│   │   └── modules/          # JavaScript modules
│   │       ├── header-module.js
│   │       ├── footer-module.js
│   │       ├── hero-animations.js
│   │       ├── games-catalog.js
│   │       ├── cart-management.js
│   │       ├── notification-system.js
│   │       └── newsletter-handler.js
│   └── data/
│       └── games-catalog.json # Game data
└── README.md
```

## 🎨 Design System

### Color Palette

- **Primary**: `#e67e22` (Orange)
- **Secondary**: `#f39c12` (Light Orange)
- **Accent**: `#d35400` (Dark Orange)
- **Success**: `#27ae60` (Green)
- **Warning**: `#f1c40f` (Yellow)
- **Error**: `#e74c3c` (Red)

### Typography

- **Font Family**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Responsive Sizing**: clamp() functions for fluid typography
- **Font Weights**: 400, 500, 600, 700

### Animations

- **Transitions**: 0.2s, 0.3s, 0.5s ease
- **Keyframes**: fadeInUp, fadeInLeft, fadeInRight, float, pulse
- **Hover Effects**: Scale, translate, rotate transformations

## 🔧 Modules

### Header Module (`header-module.js`)

- Dynamic header generation
- Mobile burger menu with animations
- Cart counter with LocalStorage integration
- Navigation with loading states

### Footer Module (`footer-module.js`)

- Dynamic footer generation
- Social media links
- Contact information
- Legal links

### Games Catalog (`games-catalog.js`)

- JSON data loading
- Unique card generation
- Add to cart functionality
- Search and filter capabilities

### Cart Management (`cart-management.js`)

- Modal cart interface
- Quantity management
- LocalStorage persistence
- Checkout simulation

### Notification System (`notification-system.js`)

- Toast notifications
- Success/error/warning messages
- Auto-dismiss functionality
- Responsive positioning

### Newsletter Handler (`newsletter-handler.js`)

- Custom email validation
- Disposable email detection
- Success/error states
- LocalStorage subscription tracking

## 📱 Responsive Design

### Breakpoints

- **Mobile**: 360px and below
- **Tablet**: 768px and below
- **Desktop**: 1280px and above

### Mobile Features

- Collapsible burger menu
- Touch-friendly buttons
- Optimized card layouts
- Simplified navigation

## 🎯 Accessibility

- **Semantic HTML**: Proper heading hierarchy and landmarks
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Visible focus indicators
- **Reduced Motion**: Respects user preferences

## 🔒 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📝 License

This project is created for educational purposes. All game data is fictional and used for demonstration.

## 🤝 Contributing

This is a demonstration project showcasing modern web development techniques with vanilla technologies.

---

**Built with ❤️ using vanilla HTML, CSS, and JavaScript**
