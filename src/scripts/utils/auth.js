class AuthHelper {
  static setToken(token) {
    sessionStorage.setItem("token", token);
  }

  static getToken() {
    return sessionStorage.getItem("token");
  }

  static setUser(user) {
    sessionStorage.setItem("user", JSON.stringify(user));
  }

  static getUser() {
    const user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  static isAuthenticated() {
    return !!this.getToken();
  }

  static logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    window.location.hash = "#/login";
  }
}

export default AuthHelper;
