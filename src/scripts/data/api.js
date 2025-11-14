import CONFIG from "../config";

class StoryAPI {
  static async register(name, email, password) {
    const response = await fetch(`${CONFIG.BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    return result;
  }

  static async login(email, password) {
    const response = await fetch(`${CONFIG.BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    return result;
  }

  static async getAllStories(token) {
    const response = await fetch(`${CONFIG.BASE_URL}/stories?location=1`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    return result;
  }

  static async addStory(token, formData) {
    const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    return result;
  }
}

export default StoryAPI;
