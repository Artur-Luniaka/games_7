// Notification System Module - PixelVault Gaming Store
const notificationSystemModule = {
  notificationContainer: null,

  initializeNotifications() {
    this.createNotificationContainer();
  },

  createNotificationContainer() {
    this.notificationContainer = document.createElement("div");
    this.notificationContainer.id = "notification-container";
    this.notificationContainer.className = "notification-container";
    document.body.appendChild(this.notificationContainer);
  },

  showNotification(message, type = "info", duration = 3000) {
    const notification = this.createNotificationElement(message, type);
    this.notificationContainer.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.add("notification-show");
    }, 10);

    // Auto remove
    setTimeout(() => {
      this.hideNotification(notification);
    }, duration);

    return notification;
  },

  createNotificationElement(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;

    const icon = this.getNotificationIcon(type);

    notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icon}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" aria-label="Close notification">×</button>
            </div>
        `;

    // Add close button functionality
    const closeBtn = notification.querySelector(".notification-close");
    closeBtn.addEventListener("click", () => {
      this.hideNotification(notification);
    });

    return notification;
  },

  getNotificationIcon(type) {
    const icons = {
      success: "✅",
      error: "❌",
      warning: "⚠️",
      info: "ℹ️",
    };
    return icons[type] || icons.info;
  },

  hideNotification(notification) {
    notification.classList.remove("notification-show");
    notification.classList.add("notification-hide");

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  },

  showSuccess(message, duration) {
    return this.showNotification(message, "success", duration);
  },

  showError(message, duration) {
    return this.showNotification(message, "error", duration);
  },

  showWarning(message, duration) {
    return this.showNotification(message, "warning", duration);
  },

  showInfo(message, duration) {
    return this.showNotification(message, "info", duration);
  },

  // Toast notification for quick messages
  showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${this.getNotificationIcon(
                  type
                )}</span>
                <span class="toast-message">${message}</span>
            </div>
        `;

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.classList.add("toast-show");
    }, 10);

    // Auto remove
    setTimeout(() => {
      toast.classList.remove("toast-show");
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 2000);
  },
};

// Add notification styles
const notificationStyles = document.createElement("style");
notificationStyles.textContent = `
    .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 400px;
    }
    
    .notification {
        background: white;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-medium);
        padding: 1rem;
        transform: translateX(100%);
        opacity: 0;
        transition: all var(--transition-medium);
        border-left: 4px solid var(--primary-color);
    }
    
    .notification-show {
        transform: translateX(0);
        opacity: 1;
    }
    
    .notification-hide {
        transform: translateX(100%);
        opacity: 0;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-icon {
        font-size: 1.2rem;
        flex-shrink: 0;
    }
    
    .notification-message {
        flex: 1;
        color: var(--text-primary);
        font-weight: 500;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all var(--transition-medium);
    }
    
    .notification-close:hover {
        background: rgba(0, 0, 0, 0.1);
        color: var(--text-primary);
    }
    
    .notification-success {
        border-left-color: var(--success-color);
    }
    
    .notification-error {
        border-left-color: var(--error-color);
    }
    
    .notification-warning {
        border-left-color: var(--warning-color);
    }
    
    .notification-info {
        border-left-color: var(--primary-color);
    }
    
    .toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-medium);
        padding: 0.75rem 1rem;
        transform: translateY(100%);
        opacity: 0;
        transition: all var(--transition-medium);
        z-index: 10000;
        max-width: 300px;
    }
    
    .toast-show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .toast-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .toast-icon {
        font-size: 1rem;
        flex-shrink: 0;
    }
    
    .toast-message {
        color: var(--text-primary);
        font-size: 0.9rem;
        font-weight: 500;
    }
    
    @media (max-width: 768px) {
        .notification-container {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
        }
        
        .toast {
            bottom: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Initialize notifications when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  notificationSystemModule.initializeNotifications();
});

// Export for use in other modules
export default notificationSystemModule;
