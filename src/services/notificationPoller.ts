/**
 * Notification Poller
 * Periodically checks for new messages, support replies, and completed deposits
 */

import { apiService } from './api';
import { notificationService } from './notificationService';

interface PollerState {
  lastInboxCount: number;
  lastSupportCount: number;
  lastDepositCheck: string;
  isPolling: boolean;
  intervalId: number | null;
}

class NotificationPoller {
  private state: PollerState = {
    lastInboxCount: 0,
    lastSupportCount: 0,
    lastDepositCheck: new Date().toISOString(),
    isPolling: false,
    intervalId: null
  };

  private readonly POLL_INTERVAL = 30000; // 30 seconds

  /**
   * Start polling for notifications
   */
  start() {
    if (this.state.isPolling) {
      console.log('Notification poller already running');
      return;
    }

    console.log('Starting notification poller...');
    this.state.isPolling = true;

    // Initial check
    this.checkNotifications();

    // Poll every 30 seconds
    this.state.intervalId = window.setInterval(() => {
      this.checkNotifications();
    }, this.POLL_INTERVAL);
  }

  /**
   * Stop polling
   */
  stop() {
    if (this.state.intervalId) {
      clearInterval(this.state.intervalId);
      this.state.intervalId = null;
    }
    this.state.isPolling = false;
    console.log('Notification poller stopped');
  }

  /**
   * Check for all types of notifications
   */
  private async checkNotifications() {
    try {
      // Check in parallel for better performance
      await Promise.all([
        this.checkInbox(),
        this.checkSupport(),
        this.checkDeposits()
      ]);
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  }

  /**
   * Check for new inbox messages
   */
  private async checkInbox() {
    try {
      const response = await apiService.getInboxUnreadCount();
      
      if (response.success && response.data) {
        const currentCount = response.data.unread_count || 0;
        
        // If count increased, we have new messages
        if (currentCount > this.state.lastInboxCount && this.state.lastInboxCount > 0) {
          const newMessages = currentCount - this.state.lastInboxCount;
          notificationService.notifyNewMessage(newMessages);
        }
        
        this.state.lastInboxCount = currentCount;
      }
    } catch (error) {
      console.error('Error checking inbox:', error);
    }
  }

  /**
   * Check for new support ticket replies
   */
  private async checkSupport() {
    try {
      const response = await apiService.getSupportUnreadCount();
      
      if (response.success && response.data) {
        const currentCount = response.data.unread_count || 0;
        
        // If count increased, we have new support replies
        if (currentCount > this.state.lastSupportCount && this.state.lastSupportCount > 0) {
          const newReplies = currentCount - this.state.lastSupportCount;
          notificationService.notifyNewSupport(newReplies);
        }
        
        this.state.lastSupportCount = currentCount;
      }
    } catch (error) {
      console.error('Error checking support:', error);
    }
  }

  /**
   * Check for new completed deposits
   */
  private async checkDeposits() {
    try {
      const response: any = await apiService.getRecentDeposits();
      if (response && response.status === 'success' && Array.isArray(response.data)) {
        const deposits = response.data as Array<{ status: string; amount: number; created_at: string }>;
        // Check for deposits completed after our last check
        const newDeposits = deposits.filter((deposit) => {
          return deposit.status === 'completed' && (deposit.created_at || '') > this.state.lastDepositCheck;
        });
        // Notify for each new completed deposit
        newDeposits.forEach((deposit) => {
          notificationService.notifyDepositCompleted(deposit.amount);
        });
        // Update last check time using latest created_at
        if (deposits.length > 0) {
          const latest = deposits.reduce((a, b) => (a.created_at > b.created_at ? a : b));
          if (latest.created_at) this.state.lastDepositCheck = latest.created_at;
        }
      }
    } catch (error) {
      console.error('Error checking deposits:', error);
    }
  }

  /**
   * Reset the poller state
   */
  reset() {
    this.state.lastInboxCount = 0;
    this.state.lastSupportCount = 0;
    this.state.lastDepositCheck = new Date().toISOString();
  }

  /**
   * Get current state (for debugging)
   */
  getState() {
    return { ...this.state };
  }
}

export const notificationPoller = new NotificationPoller();

