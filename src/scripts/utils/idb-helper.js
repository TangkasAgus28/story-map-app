import { openDB } from "idb";

const DB_NAME = "story-map-db";
const DB_VERSION = 1;
const STORE_NAME = "favorites";

class IDBHelper {
  static async openDatabase() {
    return openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, {
            keyPath: "id",
          });
          store.createIndex("name", "name", { unique: false });
          store.createIndex("createdAt", "createdAt", { unique: false });
        }
      },
    });
  }

  // CREATE - Add story to favorites
  static async addFavorite(story) {
    try {
      const db = await this.openDatabase();
      await db.add(STORE_NAME, story);
      console.log("Story added to favorites:", story);
      return true;
    } catch (error) {
      console.error("Failed to add favorite:", error);
      throw error;
    }
  }

  // READ - Get all favorites
  static async getAllFavorites() {
    try {
      const db = await this.openDatabase();
      return await db.getAll(STORE_NAME);
    } catch (error) {
      console.error("Failed to get favorites:", error);
      return [];
    }
  }

  // READ - Get single favorite by ID
  static async getFavoriteById(id) {
    try {
      const db = await this.openDatabase();
      return await db.get(STORE_NAME, id);
    } catch (error) {
      console.error("Failed to get favorite:", error);
      return null;
    }
  }

  // DELETE - Remove from favorites
  static async deleteFavorite(id) {
    try {
      const db = await this.openDatabase();
      await db.delete(STORE_NAME, id);
      console.log("Story removed from favorites:", id);
      return true;
    } catch (error) {
      console.error("Failed to delete favorite:", error);
      throw error;
    }
  }

  // CHECK - Is story favorited?
  static async isFavorited(id) {
    try {
      const db = await this.openDatabase();
      const story = await db.get(STORE_NAME, id);
      return story !== undefined;
    } catch (error) {
      console.error("Failed to check favorite:", error);
      return false;
    }
  }

  // SEARCH - Search favorites by name (Skilled: +3pts)
  static async searchFavorites(query) {
    try {
      const favorites = await this.getAllFavorites();
      return favorites.filter(
        (story) =>
          story.name.toLowerCase().includes(query.toLowerCase()) ||
          story.description.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error("Failed to search favorites:", error);
      return [];
    }
  }

  // SORT - Sort favorites (Skilled: +3pts)
  static async sortFavorites(sortBy = "createdAt", order = "desc") {
    try {
      const favorites = await this.getAllFavorites();

      return favorites.sort((a, b) => {
        let comparison = 0;

        if (sortBy === "name") {
          comparison = a.name.localeCompare(b.name);
        } else if (sortBy === "createdAt") {
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
        }

        return order === "asc" ? comparison : -comparison;
      });
    } catch (error) {
      console.error("Failed to sort favorites:", error);
      return [];
    }
  }

  // CLEAR - Delete all favorites
  static async clearAllFavorites() {
    try {
      const db = await this.openDatabase();
      await db.clear(STORE_NAME);
      console.log("All favorites cleared");
      return true;
    } catch (error) {
      console.error("Failed to clear favorites:", error);
      throw error;
    }
  }
}

export default IDBHelper;
