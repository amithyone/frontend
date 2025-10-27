import React, { useState, useEffect } from 'react';
import { Bell, X, Volume2 } from 'lucide-react';
import { notificationService } from '../services/notificationService';

const NotificationPermissionPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has already made a decision
    const dismissed = localStorage.getItem('notification_prompt_dismissed');
    const hasPermission = 'Notification' in window && Notification.permission === 'granted';
    const isDenied = 'Notification' in window && Notification.permission === 'denied';

    // Show prompt if not dismissed, no permission, and not denied
    if (!dismissed && !hasPermission && !isDenied && 'Notification' in window) {
      // Show prompt after 5 seconds to not overwhelm user
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    }
  }, []);

  const handleAllow = async () => {
    const granted = await notificationService.requestPermission();
    
    if (granted) {
      // Test the notification
      notificationService.playSound();
      notificationService.showNotification('Notifications Enabled! 🔔', {
        body: 'You will now receive sound alerts for new messages, support replies, and deposits',
        icon: '/favicon.ico'
      });
    }
    
    setShowPrompt(false);
    setIsDismissed(true);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setIsDismissed(true);
    localStorage.setItem('notification_prompt_dismissed', 'true');
  };

  const handleLater = () => {
    setShowPrompt(false);
    // Don't set dismissed, so it shows again next session
  };

  if (!showPrompt || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 max-w-sm animate-slide-up">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Enable Notifications?
            </h3>
          </div>
          <button 
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
          <p className="mb-3">Get instant alerts with sound for:</p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-blue-500">💬</span>
              <span>New inbox messages</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">🎫</span>
              <span>Support ticket replies</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-purple-500">💰</span>
              <span>Completed deposits</span>
            </li>
          </ul>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleAllow}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Volume2 className="w-4 h-4" />
            Allow
          </button>
          <button
            onClick={handleLater}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Later
          </button>
        </div>

        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
          You can change this anytime in settings
        </p>
      </div>
    </div>
  );
};

export default NotificationPermissionPrompt;

