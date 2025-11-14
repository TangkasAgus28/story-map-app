import CONFIG from "../config";

class PushNotification {
  static async requestPermission() {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  static async subscribeToPush(registration) {
    try {
      // VAPID public key from API documentation
      const vapidPublicKey =
        "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";

      const convertedVapidKey = this.urlBase64ToUint8Array(vapidPublicKey);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      console.log("Push subscription:", subscription);
      return subscription;
    } catch (error) {
      console.error("Failed to subscribe to push:", error);
      throw error;
    }
  }

  static async sendSubscriptionToServer(subscription, token) {
    try {
      const response = await fetch(
        `${CONFIG.BASE_URL}/notifications/subscribe`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint,
            keys: {
              p256dh: this.arrayBufferToBase64(subscription.getKey("p256dh")),
              auth: this.arrayBufferToBase64(subscription.getKey("auth")),
            },
          }),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      console.log("Subscription sent to server:", result);
      return result;
    } catch (error) {
      console.error("Failed to send subscription to server:", error);
      throw error;
    }
  }

  static async unsubscribeFromPush(subscription, token) {
    try {
      // Unsubscribe from browser
      await subscription.unsubscribe();

      // Notify server
      const response = await fetch(
        `${CONFIG.BASE_URL}/notifications/subscribe`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint,
          }),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      console.log("Unsubscribed from push:", result);
      return result;
    } catch (error) {
      console.error("Failed to unsubscribe from push:", error);
      throw error;
    }
  }

  static async getSubscription(registration) {
    return await registration.pushManager.getSubscription();
  }

  static urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  static arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}

export default PushNotification;
