class NotificationService {
  constructor() {
    this.permission = null;
  }

  async requestPermission() {
    if (!("Notification" in window)) {
      console.warn("Browser does not support notifications");
      return false;
    }
    this.permission = await Notification.requestPermission();
    return this.permission === "granted";
  }

  showNotification(title, body) {
    if (this.permission !== "granted") {
      console.warn("No permission to show notifications");
      return;
    }
    const options = {
      body,
    };
    new Notification(title, options);
  }

  scheduleNotification(hour, minute, title, body) {
    const now = new Date();
    let target = new Date();
    target.setHours(hour, minute, 0, 0);
    if (target < now) {
      target.setDate(target.getDate() + 1);
    }
    const delay = target.getTime() - now.getTime();

    setTimeout(() => {
      this.showNotification(title, body);
      // Repeat daily
      setInterval(() => {
        this.showNotification(title, body);
      }, 24 * 60 * 60 * 1000);
    }, delay);
  }

  async init() {
    const granted = await this.requestPermission();
    if (granted) {
      this.scheduleNotification(
        11,
        30,
        "Track your Task",
        "Time to review your tasks!"
      );
      this.scheduleNotification(
        15,
        0,
        "Update your Tasks",
        "Don't forget to update your task progress!"
      );
      this.scheduleNotification(
        19,
        30,
        "Complete your task status",
        "Please mark completed tasks."
      );
    }
  }
}

export const notificationService = new NotificationService();
