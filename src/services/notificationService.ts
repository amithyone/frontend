/**
 * Notification Service
 * Handles browser notifications and sound alerts for new messages, support tickets, and deposits
 */

export class NotificationService {
  private notificationSound: HTMLAudioElement | null = null;
  private hasPermission: boolean = false;
  private isEnabled: boolean = true;

  constructor() {
    this.initializeSound();
    this.checkPermission();
  }

  /**
   * Initialize notification sound
   */
  private initializeSound() {
    try {
      this.notificationSound = new Audio('/sounds/notification.mp3');
      this.notificationSound.volume = 0.7;
    } catch (error) {
      console.warn('Could not initialize notification sound:', error);
    }
  }

  /**
   * Check if browser notifications are supported and get permission
   */
  private checkPermission() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.hasPermission = true;
      return true;
    }

    return false;
  }

  /**
   * Request permission for browser notifications
   */
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      this.hasPermission = true;
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.hasPermission = permission === 'granted';
      return this.hasPermission;
    }

    return false;
  }

  /**
   * Play notification sound
   */
  playSound() {
    if (!this.isEnabled) return;

    try {
      if (this.notificationSound) {
        this.notificationSound.currentTime = 0;
        this.notificationSound.play().catch(error => {
          console.warn('Could not play notification sound:', error);
        });
      }
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  }

  /**
   * Show browser notification
   */
  showNotification(title: string, options?: NotificationOptions) {
    if (!this.hasPermission || !this.isEnabled) {
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });

      // Auto-close after 5 seconds
      setTimeout(() => notification.close(), 5000);

      return notification;
    } catch (error) {
      console.warn('Could not show notification:', error);
    }
  }

  /**
   * Notify about new inbox message
   */
  notifyNewMessage(count: number = 1) {
    this.playSound();
    this.showNotification('New Message', {
      body: `You have ${count} new ${count === 1 ? 'message' : 'messages'} in your inbox`,
      tag: 'inbox-message',
      requireInteraction: false
    });
  }

  /**
   * Notify about new support ticket reply
   */
  notifyNewSupport(count: number = 1) {
    this.playSound();
    this.showNotification('Support Reply', {
      body: `You have ${count} new support ${count === 1 ? 'reply' : 'replies'}`,
      tag: 'support-message',
      requireInteraction: false
    });
  }

  /**
   * Notify about completed deposit
   */
  notifyDepositCompleted(amount: number) {
    this.playSound();
    this.showNotification('Deposit Completed! 💰', {
      body: `Your deposit of ₦${amount.toLocaleString()} has been credited to your account`,
      tag: 'deposit-completed',
      requireInteraction: false
    });
  }

  /**
   * Enable/disable notifications
   */
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    localStorage.setItem('notifications_enabled', enabled.toString());
  }

  /**
   * Check if notifications are enabled
   */
  isNotificationsEnabled(): boolean {
    const saved = localStorage.getItem('notifications_enabled');
    if (saved !== null) {
      this.isEnabled = saved === 'true';
    }
    return this.isEnabled;
  }
}

export const notificationService = new NotificationService();

