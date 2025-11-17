var M=o=>{throw TypeError(o)};var P=(o,e,t)=>e.has(o)||M("Cannot "+t);var l=(o,e,t)=>(P(o,e,"read from private field"),t?t.call(o):e.get(o)),w=(o,e,t)=>e.has(o)?M("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(o):e.set(o,t),S=(o,e,t,r)=>(P(o,e,"write to private field"),r?r.call(o,t):e.set(o,t),t),F=(o,e,t)=>(P(o,e,"access private method"),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function t(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(s){if(s.ep)return;s.ep=!0;const a=t(s);fetch(s.href,a)}})();const v={BASE_URL:"https://story-api.dicoding.dev/v1",CACHE_NAME:"story-app-v1"};class C{static async register(e,t,r){const s=await fetch(`${v.BASE_URL}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e,email:t,password:r})}),a=await s.json();if(!s.ok)throw new Error(a.message);return a}static async login(e,t){const r=await fetch(`${v.BASE_URL}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:t})}),s=await r.json();if(!r.ok)throw new Error(s.message);return s}static async getAllStories(e){const t=await fetch(`${v.BASE_URL}/stories?location=1`,{headers:{Authorization:`Bearer ${e}`}}),r=await t.json();if(!t.ok)throw new Error(r.message);return r}static async addStory(e,t){const r=await fetch(`${v.BASE_URL}/stories`,{method:"POST",headers:{Authorization:`Bearer ${e}`},body:t}),s=await r.json();if(!r.ok)throw new Error(s.message);return s}}class u{static setToken(e){sessionStorage.setItem("token",e)}static getToken(){return sessionStorage.getItem("token")}static setUser(e){sessionStorage.setItem("user",JSON.stringify(e))}static getUser(){const e=sessionStorage.getItem("user");return e?JSON.parse(e):null}static isAuthenticated(){return!!this.getToken()}static logout(){sessionStorage.removeItem("token"),sessionStorage.removeItem("user"),window.location.hash="#/login"}}const B=(o,e)=>e.some(t=>o instanceof t);let N,R;function H(){return N||(N=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function z(){return R||(R=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const D=new WeakMap,E=new WeakMap,A=new WeakMap;function K(o){const e=new Promise((t,r)=>{const s=()=>{o.removeEventListener("success",a),o.removeEventListener("error",i)},a=()=>{t(g(o.result)),s()},i=()=>{r(o.error),s()};o.addEventListener("success",a),o.addEventListener("error",i)});return A.set(e,o),e}function J(o){if(D.has(o))return;const e=new Promise((t,r)=>{const s=()=>{o.removeEventListener("complete",a),o.removeEventListener("error",i),o.removeEventListener("abort",i)},a=()=>{t(),s()},i=()=>{r(o.error||new DOMException("AbortError","AbortError")),s()};o.addEventListener("complete",a),o.addEventListener("error",i),o.addEventListener("abort",i)});D.set(o,e)}let T={get(o,e,t){if(o instanceof IDBTransaction){if(e==="done")return D.get(o);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return g(o[e])},set(o,e,t){return o[e]=t,!0},has(o,e){return o instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in o}};function W(o){T=o(T)}function G(o){return z().includes(o)?function(...e){return o.apply(q(this),e),g(this.request)}:function(...e){return g(o.apply(q(this),e))}}function Y(o){return typeof o=="function"?G(o):(o instanceof IDBTransaction&&J(o),B(o,H())?new Proxy(o,T):o)}function g(o){if(o instanceof IDBRequest)return K(o);if(E.has(o))return E.get(o);const e=Y(o);return e!==o&&(E.set(o,e),A.set(e,o)),e}const q=o=>A.get(o);function Z(o,e,{blocked:t,upgrade:r,blocking:s,terminated:a}={}){const i=indexedDB.open(o,e),c=g(i);return r&&i.addEventListener("upgradeneeded",n=>{r(g(i.result),n.oldVersion,n.newVersion,g(i.transaction),n)}),t&&i.addEventListener("blocked",n=>t(n.oldVersion,n.newVersion,n)),c.then(n=>{a&&n.addEventListener("close",()=>a()),s&&n.addEventListener("versionchange",p=>s(p.oldVersion,p.newVersion,p))}).catch(()=>{}),c}const Q=["get","getKey","getAll","getAllKeys","count"],X=["put","add","delete","clear"],k=new Map;function $(o,e){if(!(o instanceof IDBDatabase&&!(e in o)&&typeof e=="string"))return;if(k.get(e))return k.get(e);const t=e.replace(/FromIndex$/,""),r=e!==t,s=X.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(s||Q.includes(t)))return;const a=async function(i,...c){const n=this.transaction(i,s?"readwrite":"readonly");let p=n.store;return r&&(p=p.index(c.shift())),(await Promise.all([p[t](...c),s&&n.done]))[0]};return k.set(e,a),a}W(o=>({...o,get:(e,t,r)=>$(e,t)||o.get(e,t,r),has:(e,t)=>!!$(e,t)||o.has(e,t)}));const ee=["continue","continuePrimaryKey","advance"],O={},I=new WeakMap,j=new WeakMap,te={get(o,e){if(!ee.includes(e))return o[e];let t=O[e];return t||(t=O[e]=function(...r){I.set(this,j.get(this)[e](...r))}),t}};async function*re(...o){let e=this;if(e instanceof IDBCursor||(e=await e.openCursor(...o)),!e)return;e=e;const t=new Proxy(e,te);for(j.set(t,e),A.set(t,q(e));e;)yield t,e=await(I.get(t)||e.continue()),I.delete(t)}function U(o,e){return e===Symbol.asyncIterator&&B(o,[IDBIndex,IDBObjectStore,IDBCursor])||e==="iterate"&&B(o,[IDBIndex,IDBObjectStore])}W(o=>({...o,get(e,t,r){return U(e,t)?re:o.get(e,t,r)},has(e,t){return U(e,t)||o.has(e,t)}}));const oe="story-map-db",se=1,m="favorites";class f{static async openDatabase(){return Z(oe,se,{upgrade(e){if(!e.objectStoreNames.contains(m)){const t=e.createObjectStore(m,{keyPath:"id"});t.createIndex("name","name",{unique:!1}),t.createIndex("createdAt","createdAt",{unique:!1})}}})}static async addFavorite(e){try{return await(await this.openDatabase()).add(m,e),console.log("Story added to favorites:",e),!0}catch(t){throw console.error("Failed to add favorite:",t),t}}static async getAllFavorites(){try{return await(await this.openDatabase()).getAll(m)}catch(e){return console.error("Failed to get favorites:",e),[]}}static async getFavoriteById(e){try{return await(await this.openDatabase()).get(m,e)}catch(t){return console.error("Failed to get favorite:",t),null}}static async deleteFavorite(e){try{return await(await this.openDatabase()).delete(m,e),console.log("Story removed from favorites:",e),!0}catch(t){throw console.error("Failed to delete favorite:",t),t}}static async isFavorited(e){try{return await(await this.openDatabase()).get(m,e)!==void 0}catch(t){return console.error("Failed to check favorite:",t),!1}}static async searchFavorites(e){try{return(await this.getAllFavorites()).filter(r=>r.name.toLowerCase().includes(e.toLowerCase())||r.description.toLowerCase().includes(e.toLowerCase()))}catch(t){return console.error("Failed to search favorites:",t),[]}}static async sortFavorites(e="createdAt",t="desc"){try{return(await this.getAllFavorites()).sort((s,a)=>{let i=0;return e==="name"?i=s.name.localeCompare(a.name):e==="createdAt"&&(i=new Date(s.createdAt)-new Date(a.createdAt)),t==="asc"?i:-i})}catch(r){return console.error("Failed to sort favorites:",r),[]}}static async clearAllFavorites(){try{return await(await this.openDatabase()).clear(m),console.log("All favorites cleared"),!0}catch(e){throw console.error("Failed to clear favorites:",e),e}}}class x{static async requestPermission(){return"Notification"in window?await Notification.requestPermission()==="granted":(console.log("This browser does not support notifications"),!1)}static async subscribeToPush(e){try{const r=this.urlBase64ToUint8Array("BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk"),s=await e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:r});return console.log("Push subscription:",s),s}catch(t){throw console.error("Failed to subscribe to push:",t),t}}static async sendSubscriptionToServer(e,t){try{const r=await fetch(`${v.BASE_URL}/notifications/subscribe`,{method:"POST",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify({endpoint:e.endpoint,keys:{p256dh:this.arrayBufferToBase64(e.getKey("p256dh")),auth:this.arrayBufferToBase64(e.getKey("auth"))}})}),s=await r.json();if(!r.ok)throw new Error(s.message);return console.log("Subscription sent to server:",s),s}catch(r){throw console.error("Failed to send subscription to server:",r),r}}static async unsubscribeFromPush(e,t){try{await e.unsubscribe();const r=await fetch(`${v.BASE_URL}/notifications/subscribe`,{method:"DELETE",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify({endpoint:e.endpoint})}),s=await r.json();if(!r.ok)throw new Error(s.message);return console.log("Unsubscribed from push:",s),s}catch(r){throw console.error("Failed to unsubscribe from push:",r),r}}static async getSubscription(e){return await e.pushManager.getSubscription()}static urlBase64ToUint8Array(e){const t="=".repeat((4-e.length%4)%4),r=(e+t).replace(/\-/g,"+").replace(/_/g,"/"),s=window.atob(r),a=new Uint8Array(s.length);for(let i=0;i<s.length;++i)a[i]=s.charCodeAt(i);return a}static arrayBufferToBase64(e){const t=new Uint8Array(e);let r="";for(let s=0;s<t.byteLength;s++)r+=String.fromCharCode(t[s]);return window.btoa(r)}}class ae{constructor(){this.map=null,this.markers=[],this.stories=[]}async render(){return`
      <section class="home-container">
        <div class="container">
          <div class="home-header">
            <h1>Story Map</h1>
            <div class="user-info">
              <span>Welcome, <strong id="user-name"></strong></span>
              
              <!-- Push Notification Toggle (Advanced: +4pts) -->
              <button id="notification-toggle" class="btn-notification" aria-label="Toggle push notifications">
                <span id="notification-icon">🔕</span>
                <span id="notification-text">Enable Notifications</span>
              </button>
              
              <button id="logout-btn" class="btn-secondary">Logout</button>
            </div>
          </div>
          
          <div class="action-buttons">
            <a href="#/add-story" class="btn-primary">+ Add New Story</a>
            <a href="#/favorites" class="btn-secondary">⭐ My Favorites</a>
          </div>

          <div class="content-grid">
            <!-- Map Section -->
            <div class="map-section">
              <h2>Map View</h2>
              <div id="map" class="map-container"></div>
            </div>

            <!-- Story List Section -->
            <div class="story-section">
              <h2>Stories</h2>
              <div id="loading" class="loading">Loading stories...</div>
              <div id="story-list" class="story-list"></div>
            </div>
          </div>
        </div>
      </section>
    `}async afterRender(){if(!u.isAuthenticated()){window.location.hash="#/login";return}const e=u.getUser();document.querySelector("#user-name").textContent=(e==null?void 0:e.name)||"User",document.querySelector("#logout-btn").addEventListener("click",()=>{u.logout()}),await this.setupPushNotification(),this.initMap(),await this.loadStories()}async setupPushNotification(){const e=document.querySelector("#notification-toggle"),t=document.querySelector("#notification-icon"),r=document.querySelector("#notification-text");try{if(!("serviceWorker"in navigator)){e.style.display="none";return}const s=await navigator.serviceWorker.ready;await s.pushManager.getSubscription()&&(t.textContent="🔔",r.textContent="Disable Notifications",e.classList.add("active")),e.addEventListener("click",async()=>{try{e.disabled=!0,r.textContent="Processing...";const i=await s.pushManager.getSubscription();if(i){const c=u.getToken();await x.unsubscribeFromPush(i,c),t.textContent="🔕",r.textContent="Enable Notifications",e.classList.remove("active"),alert("✅ Push notifications disabled")}else{if(!await x.requestPermission()){alert("❌ Notification permission denied. Please enable it in your browser settings."),t.textContent="🔕",r.textContent="Enable Notifications";return}const n=await x.subscribeToPush(s),p=u.getToken();await x.sendSubscriptionToServer(n,p),t.textContent="🔔",r.textContent="Disable Notifications",e.classList.add("active"),alert("✅ Push notifications enabled! You will receive notifications when you add new stories.")}}catch(i){console.error("Push notification error:",i),alert("❌ Failed to toggle notifications: "+i.message),t.textContent="🔕",r.textContent="Enable Notifications",e.classList.remove("active")}finally{e.disabled=!1}})}catch(s){console.error("Setup push notification error:",s),e.style.display="none"}}initMap(){this.map=L.map("map").setView([-2.5489,118.0149],5);const e=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19}).addTo(this.map),t=L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:"Tiles &copy; Esri",maxZoom:19}),r={"Street Map":e,Satellite:t};L.control.layers(r).addTo(this.map)}async loadStories(){const e=document.querySelector("#loading"),t=document.querySelector("#story-list");try{const r=u.getToken(),s=await C.getAllStories(r);if(this.stories=s.listStory,e.style.display="none",this.stories.length===0){t.innerHTML='<p class="no-stories">No stories yet. Be the first to add one!</p>';return}this.renderStoryList(),this.addMarkersToMap()}catch(r){e.textContent="Failed to load stories: "+r.message}}renderStoryList(){const e=document.querySelector("#story-list");e.innerHTML=this.stories.map((t,r)=>`
      <article class="story-card" data-index="${r}">
        <img 
          src="${t.photoUrl}" 
          alt="${t.description||"Story photo"}" 
          class="story-image"
          loading="lazy"
        />
        <div class="story-content">
          <h3>${t.name}</h3>
          <p>${t.description}</p>
          <small>📍 ${t.lat?`${t.lat.toFixed(4)}, ${t.lon.toFixed(4)}`:"No location"}</small>
        </div>
        <button 
          class="btn-favorite" 
          data-story-id="${t.id}"
          aria-label="Add ${t.name} to favorites"
        >
          ⭐ Add to Favorites
        </button>
      </article>
    `).join(""),document.querySelectorAll(".story-card").forEach(t=>{t.addEventListener("click",r=>{if(!r.target.classList.contains("btn-favorite")){const s=parseInt(r.currentTarget.dataset.index);this.highlightStory(s)}})}),this.setupFavoriteButtons()}setupFavoriteButtons(){document.querySelectorAll(".btn-favorite").forEach(e=>{e.addEventListener("click",async t=>{t.stopPropagation();const r=t.currentTarget;if(!r||!document.body.contains(r)){console.warn("Button no longer in DOM");return}try{const s=r.dataset.storyId,a=this.stories.find(n=>n.id===s);if(!a){alert("❌ Story not found");return}if(await f.isFavorited(a.id)){alert("ℹ️ This story is already in your favorites!");return}await f.addFavorite(a),r&&document.body.contains(r)&&(r.textContent="✅ Added to Favorites",r.disabled=!0,r.style.backgroundColor="#27ae60",setTimeout(()=>{r&&document.body.contains(r)&&(r.textContent="⭐ Add to Favorites",r.disabled=!1,r.style.backgroundColor="")},2e3));const c=document.createElement("div");c.textContent="✅ Added to favorites!",c.style.cssText=`
          position: fixed;
          top: 80px;
          right: 20px;
          background: #27ae60;
          color: white;
          padding: 15px 25px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 10000;
          font-weight: 600;
        `,document.body.appendChild(c),setTimeout(()=>{c&&document.body.contains(c)&&c.remove()},3e3)}catch(s){console.error("Add favorite error:",s);const a="Failed to add to favorites. Please try again.";try{alert("❌ "+a)}catch(i){console.error("Could not show alert:",i)}}})})}addMarkersToMap(){this.markers.forEach(e=>e.remove()),this.markers=[],this.stories.forEach((e,t)=>{if(e.lat&&e.lon){const r=L.marker([e.lat,e.lon]).addTo(this.map).bindPopup(`
            <div class="popup-content">
              <img src="${e.photoUrl}" alt="${e.description}" style="width: 100%; max-width: 200px; border-radius: 8px;"/>
              <h4>${e.name}</h4>
              <p>${e.description}</p>
            </div>
          `);r.storyIndex=t,this.markers.push(r),r.on("click",()=>{this.highlightStory(t)})}})}highlightStory(e){const t=this.stories[e];this.markers.forEach((r,s)=>{s===e&&(r.openPopup(),this.map.setView([t.lat,t.lon],13))}),document.querySelectorAll(".story-card").forEach((r,s)=>{s===e?(r.classList.add("active"),r.scrollIntoView({behavior:"smooth",block:"nearest"})):r.classList.remove("active")})}}class ie{async render(){return`
      <section class="about-container">
        <div class="container">
          <article class="about-content">
            <h1>About Story Map</h1>
            
            <section class="about-section">
              <h2>What is Story Map?</h2>
              <p>
                Story Map is an interactive web application that allows users to share their stories 
                with the world by pinning them on a map. Each story includes a photo, description, 
                and location, making it easy to explore stories from different places.
              </p>
            </section>

            <section class="about-section">
              <h2>Features</h2>
              <ul class="feature-list">
                <li>📍 <strong>Interactive Map:</strong> View all stories on an interactive map with multiple tile layers</li>
                <li>📸 <strong>Photo Sharing:</strong> Upload photos directly or capture them using your camera</li>
                <li>🗺️ <strong>Location Tagging:</strong> Tag your stories with precise locations</li>
                <li>🔐 <strong>Secure Authentication:</strong> Register and login to manage your stories</li>
                <li>📱 <strong>Responsive Design:</strong> Works seamlessly on mobile, tablet, and desktop</li>
                <li>♿ <strong>Accessible:</strong> Built with accessibility standards in mind</li>
              </ul>
            </section>

            <section class="about-section">
              <h2>Technology Stack</h2>
              <ul class="tech-list">
                <li>HTML5, CSS3, JavaScript (ES6+)</li>
                <li>Vite - Build tool</li>
                <li>Leaflet.js - Interactive maps</li>
                <li>Story API by Dicoding</li>
                <li>Web APIs: MediaDevices, Geolocation, View Transitions</li>
              </ul>
            </section>

            <section class="about-section">
              <h2>Developer</h2>
              <p>
                This project is developed as part of the Dicoding submission for 
                "Menjadi Front-End Web Developer Expert" course.
              </p>
            </section>

            <div class="about-actions">
              <a href="#/" class="btn-primary">Start Exploring Stories</a>
              <a href="#/add-story" class="btn-secondary">Share Your Story</a>
            </div>
          </article>
        </div>
      </section>
    `}async afterRender(){}}class ne{async render(){return`
      <section class="auth-container">
        <div class="auth-card">
          <h1>Login</h1>
          <form id="login-form" class="auth-form">
            <div class="form-group">
              <label for="login-email">Email</label>
              <input 
                type="email" 
                id="login-email" 
                name="email" 
                required 
                aria-label="Email address"
                aria-describedby="email-help"
                placeholder="your@email.com"
              />
              <small id="email-help" class="help-text">Enter your registered email</small>
            </div>
            
            <div class="form-group">
              <label for="login-password">Password</label>
              <input 
                type="password" 
                id="login-password" 
                name="password" 
                required 
                minlength="8"
                aria-label="Password"
                aria-describedby="password-help"
                placeholder="Min. 8 characters"
              />
              <small id="password-help" class="help-text">Minimum 8 characters</small>
            </div>
            
            <button type="submit" class="btn-primary" aria-label="Login to your account">
              Login
            </button>
            <p class="auth-link">
              Don't have an account? <a href="#/register">Register here</a>
            </p>
          </form>
          <div id="error-message" class="error-message" role="alert" aria-live="polite"></div>
        </div>
      </section>
    `}async afterRender(){const e=document.querySelector("#login-form"),t=document.querySelector("#error-message");e.addEventListener("submit",async r=>{r.preventDefault();const s=document.querySelector("#login-email").value,a=document.querySelector("#login-password").value;try{t.textContent="Loading...";const i=await C.login(s,a);u.setToken(i.loginResult.token),u.setUser({userId:i.loginResult.userId,name:i.loginResult.name}),t.textContent="Login successful! Redirecting...",setTimeout(()=>{window.location.hash="#/"},1e3)}catch(i){t.textContent=i.message||"Login failed. Please check your credentials."}})}}class ce{async render(){return`
      <section class="auth-container">
        <div class="auth-card">
          <h1>Register</h1>
          <form id="register-form" class="auth-form">
            <div class="form-group">
              <label for="register-name">Full Name</label>
              <input 
                type="text" 
                id="register-name" 
                name="name" 
                required 
                aria-label="Full name"
                aria-describedby="name-help"
                placeholder="Your full name"
              />
              <small id="name-help" class="help-text">Enter your full name</small>
            </div>
            
            <div class="form-group">
              <label for="register-email">Email</label>
              <input 
                type="email" 
                id="register-email" 
                name="email" 
                required 
                aria-label="Email address"
                aria-describedby="email-help"
                placeholder="your@email.com"
              />
              <small id="email-help" class="help-text">Must be a valid and unique email</small>
            </div>
            
            <div class="form-group">
              <label for="register-password">Password</label>
              <input 
                type="password" 
                id="register-password" 
                name="password" 
                required 
                minlength="8"
                aria-label="Password"
                aria-describedby="password-help"
                placeholder="Min. 8 characters"
              />
              <small id="password-help" class="help-text">Minimum 8 characters required</small>
            </div>
            
            <button type="submit" class="btn-primary" aria-label="Create new account">
              Register
            </button>
            <p class="auth-link">
              Already have an account? <a href="#/login">Login here</a>
            </p>
          </form>
          <div id="error-message" class="error-message" role="alert" aria-live="polite"></div>
          <div id="success-message" class="success-message" role="status" aria-live="polite"></div>
        </div>
      </section>
    `}async afterRender(){const e=document.querySelector("#register-form"),t=document.querySelector("#error-message"),r=document.querySelector("#success-message");e.addEventListener("submit",async s=>{s.preventDefault();const a=document.querySelector("#register-name").value,i=document.querySelector("#register-email").value,c=document.querySelector("#register-password").value;try{t.textContent="",r.textContent="Creating account...",await C.register(a,i,c),r.textContent="Account created successfully! Redirecting to login...",setTimeout(()=>{window.location.hash="#/login"},2e3)}catch(n){r.textContent="",t.textContent=n.message||"Registration failed. Please try again."}})}}class le{constructor(){this.selectedLocation=null,this.map=null,this.marker=null,this.mediaStream=null,this.cameraMode=!1}async render(){return`
      <section class="add-story-container">
        <div class="container">
          <h1>Add New Story</h1>
          
          <form id="add-story-form" class="story-form" novalidate>
            <div class="form-group">
              <label for="story-description">Story Description *</label>
              <textarea 
                id="story-description" 
                name="description" 
                required 
                rows="4"
                aria-label="Story description"
                aria-describedby="description-help"
                aria-required="true"
                placeholder="Tell your story..."
              ></textarea>
              <small id="description-help" class="help-text">Describe your story (minimum 10 characters)</small>
              <span class="error-text" id="description-error" role="alert"></span>
            </div>

            <div class="form-group">
              <label for="story-photo">Photo *</label>
              <div class="photo-options">
                <button 
                  type="button" 
                  id="toggle-camera-btn" 
                  class="btn-secondary"
                  aria-label="Toggle camera to capture photo"
                >
                  📷 Use Camera
                </button>
                <label for="story-photo" class="file-input-label">
                  📁 Choose File
                </label>
                <input 
                  type="file" 
                  id="story-photo" 
                  name="photo" 
                  accept="image/*"
                  aria-label="Upload photo file"
                  aria-describedby="photo-help"
                  aria-required="true"
                  style="display: none;"
                />
                <span id="file-name" class="file-name">No file chosen</span>
              </div>
              <small id="photo-help" class="help-text">Upload an image or use camera (max 1MB)</small>
              <span class="error-text" id="photo-error" role="alert"></span>
            </div>

            <!-- Camera Stream -->
            <div id="camera-container" class="camera-container" style="display: none;">
              <video 
                id="camera-stream" 
                autoplay 
                playsinline
                aria-label="Camera live stream"
              ></video>
              <canvas id="camera-canvas" style="display: none;"></canvas>
              <div class="camera-controls">
                <button 
                  type="button" 
                  id="capture-btn" 
                  class="btn-primary"
                  aria-label="Capture photo from camera"
                >
                  📸 Capture Photo
                </button>
                <button 
                  type="button" 
                  id="close-camera-btn" 
                  class="btn-secondary"
                  aria-label="Close camera"
                >
                  ✕ Close Camera
                </button>
              </div>
            </div>

            <!-- Preview -->
            <div id="preview-container" class="preview-container" style="display: none;" role="region" aria-label="Photo preview">
              <img id="preview-image" src="" alt="Photo preview" />
            </div>

            <div class="form-group">
              <label for="add-map">Location * (Click on map to select)</label>
              <div 
                id="add-map" 
                class="map-container"
                role="application"
                aria-label="Interactive map for selecting location"
                tabindex="0"
              ></div>
              <small class="help-text">Click anywhere on the map to set your story location</small>
              <div id="location-display" role="status" aria-live="polite"></div>
              <span class="error-text" id="location-error" role="alert"></span>
            </div>

            <div class="form-actions">
              <button 
                type="submit" 
                class="btn-primary" 
                id="submit-btn"
                aria-label="Submit your story"
              >
                📤 Submit Story
              </button>
              <a href="#/" class="btn-secondary" role="button">Cancel</a>
            </div>
          </form>

          <div id="form-message" class="form-message" role="alert" aria-live="polite"></div>
        </div>
      </section>
    `}async afterRender(){if(!u.isAuthenticated()){window.location.hash="#/login";return}this.initMap(),this.setupCamera(),this.setupForm(),this.setupFileInput()}setupFileInput(){const e=document.querySelector("#story-photo"),t=document.querySelector("#file-name");e.addEventListener("change",r=>{r.target.files.length>0?(t.textContent=r.target.files[0].name,this.previewFile(r.target.files[0]),document.querySelector("#photo-error").textContent=""):t.textContent="No file chosen"})}initMap(){this.map=L.map("add-map").setView([-2.5489,118.0149],5),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(this.map),this.map.on("click",e=>{this.setLocation(e.latlng)})}setLocation(e){this.selectedLocation=e,this.marker&&this.marker.remove(),this.marker=L.marker([e.lat,e.lng]).addTo(this.map).bindPopup("Selected Location").openPopup(),document.querySelector("#location-display").innerHTML=`
      <p class="selected-location">
        📍 Selected location: Latitude ${e.lat.toFixed(6)}, Longitude ${e.lng.toFixed(6)}
      </p>
    `,document.querySelector("#location-error").textContent=""}setupCamera(){const e=document.querySelector("#toggle-camera-btn");document.querySelector("#camera-container");const t=document.querySelector("#close-camera-btn"),r=document.querySelector("#capture-btn");e.addEventListener("click",async()=>{this.cameraMode||await this.startCamera()}),t.addEventListener("click",()=>{this.stopCamera()}),r.addEventListener("click",()=>{this.capturePhoto()})}async startCamera(){try{this.mediaStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});const e=document.querySelector("#camera-stream");e.srcObject=this.mediaStream,document.querySelector("#camera-container").style.display="block",document.querySelector("#toggle-camera-btn").textContent="🎥 Camera Active",this.cameraMode=!0}catch(e){alert("Failed to access camera: "+e.message)}}stopCamera(){this.mediaStream&&(this.mediaStream.getTracks().forEach(e=>e.stop()),this.mediaStream=null),document.querySelector("#camera-container").style.display="none",document.querySelector("#toggle-camera-btn").textContent="📷 Use Camera",this.cameraMode=!1}capturePhoto(){const e=document.querySelector("#camera-stream"),t=document.querySelector("#camera-canvas"),r=t.getContext("2d");t.width=e.videoWidth,t.height=e.videoHeight,r.drawImage(e,0,0),t.toBlob(s=>{const a=new File([s],"camera-photo.jpg",{type:"image/jpeg"}),i=new DataTransfer;i.items.add(a),document.querySelector("#story-photo").files=i.files,document.querySelector("#file-name").textContent=a.name,this.previewFile(a),this.stopCamera()},"image/jpeg")}previewFile(e){const t=new FileReader;t.onload=r=>{const s=document.querySelector("#preview-image");s.src=r.target.result,document.querySelector("#preview-container").style.display="block"},t.readAsDataURL(e)}setupForm(){const e=document.querySelector("#add-story-form"),t=document.querySelector("#form-message");e.addEventListener("submit",async r=>{if(r.preventDefault(),!this.validateForm()){t.className="form-message error",t.textContent="❌ Please fill all required fields correctly";return}const s=document.querySelector("#submit-btn");s.disabled=!0,s.textContent="⏳ Uploading...";try{const a=new FormData;a.append("description",document.querySelector("#story-description").value),a.append("photo",document.querySelector("#story-photo").files[0]),this.selectedLocation&&(a.append("lat",this.selectedLocation.lat),a.append("lon",this.selectedLocation.lng));const i=u.getToken();await C.addStory(i,a),t.className="form-message success",t.textContent="✅ Story added successfully! Redirecting...",setTimeout(()=>{window.location.hash="#/"},1500)}catch(a){t.className="form-message error",t.textContent="❌ Failed to add story: "+a.message,s.disabled=!1,s.textContent="📤 Submit Story"}})}validateForm(){let e=!0;const t=document.querySelector("#story-description").value.trim(),r=document.querySelector("#description-error");t.length<10?(r.textContent="⚠️ Description must be at least 10 characters",e=!1):r.textContent="";const s=document.querySelector("#story-photo").files[0],a=document.querySelector("#photo-error");s?s.size>1048576?(a.textContent="⚠️ Photo size must be less than 1MB",e=!1):a.textContent="":(a.textContent="⚠️ Please select a photo",e=!1);const i=document.querySelector("#location-error");return this.selectedLocation?i.textContent="":(i.textContent="⚠️ Please select a location on the map",e=!1),e}}class de{constructor(){this.favorites=[],this.filteredFavorites=[],this.sortBy="createdAt",this.sortOrder="desc"}async render(){return`
      <section class="favorites-container">
        <div class="container">
          <h1>My Favorite Stories</h1>
          
          <!-- Search and Sort Controls (Skilled: +3pts) -->
          <div class="favorites-controls">
            <div class="search-box">
              <label for="search-input" class="sr-only">Search favorites</label>
              <input 
                type="text" 
                id="search-input" 
                placeholder="🔍 Search by name or description..."
                aria-label="Search favorites"
              />
            </div>
            
            <div class="sort-controls">
              <label for="sort-select">Sort by:</label>
              <select id="sort-select" aria-label="Sort favorites">
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
            </div>

            <button id="clear-all-btn" class="btn-danger" aria-label="Clear all favorites">
              🗑️ Clear All
            </button>
          </div>

          <!-- Favorites List -->
          <div id="favorites-loading" class="loading">Loading favorites...</div>
          <div id="favorites-list" class="favorites-list"></div>
        </div>
      </section>
    `}async afterRender(){if(!u.isAuthenticated()){window.location.hash="#/login";return}await this.loadFavorites(),this.setupSearch(),this.setupSort(),this.setupClearAll()}async loadFavorites(){const e=document.querySelector("#favorites-loading"),t=document.querySelector("#favorites-list");try{if(this.favorites=await f.getAllFavorites(),this.filteredFavorites=[...this.favorites],e.style.display="none",this.favorites.length===0){t.innerHTML=`
          <div class="empty-state">
            <p>📭 No favorite stories yet</p>
            <p>Go to <a href="#/">home page</a> and add some stories to your favorites!</p>
          </div>
        `;return}this.renderFavoritesList()}catch(r){e.textContent="Failed to load favorites: "+r.message}}renderFavoritesList(){const e=document.querySelector("#favorites-list");e.innerHTML=this.filteredFavorites.map(t=>`
      <article class="favorite-card" data-id="${t.id}">
        <img 
          src="${t.photoUrl}" 
          alt="${t.description||"Story photo"}" 
          class="favorite-image"
          loading="lazy"
        />
        <div class="favorite-content">
          <h3>${t.name}</h3>
          <p>${t.description}</p>
          <small>📍 ${t.lat?`${t.lat.toFixed(4)}, ${t.lon.toFixed(4)}`:"No location"}</small>
          <small class="favorite-date">⏰ Added: ${new Date(t.createdAt).toLocaleDateString()}</small>
        </div>
        <button 
          class="btn-remove" 
          data-id="${t.id}"
          aria-label="Remove ${t.name} from favorites"
        >
          ❌ Remove
        </button>
      </article>
    `).join(""),document.querySelectorAll(".btn-remove").forEach(t=>{t.addEventListener("click",async r=>{r.stopPropagation();const s=r.currentTarget.dataset.id;await this.removeFavorite(s)})}),document.querySelectorAll(".favorite-card").forEach(t=>{t.addEventListener("click",r=>{r.target.classList.contains("btn-remove")||(window.location.hash="#/")})})}setupSearch(){document.querySelector("#search-input").addEventListener("input",async t=>{const r=t.target.value.trim();r===""?this.filteredFavorites=[...this.favorites]:this.filteredFavorites=await f.searchFavorites(r),this.renderFavoritesList()})}setupSort(){document.querySelector("#sort-select").addEventListener("change",async t=>{const[r,s]=t.target.value.split("-");this.sortBy=r,this.sortOrder=s,this.filteredFavorites=await f.sortFavorites(r,s),this.renderFavoritesList()})}setupClearAll(){document.querySelector("#clear-all-btn").addEventListener("click",async()=>{if(confirm("Are you sure you want to remove all favorites? This action cannot be undone."))try{await f.clearAllFavorites(),this.favorites=[],this.filteredFavorites=[],await this.loadFavorites()}catch(r){alert("Failed to clear favorites: "+r.message)}})}async removeFavorite(e){try{await f.deleteFavorite(e),this.favorites=this.favorites.filter(t=>t.id!==e),this.filteredFavorites=this.filteredFavorites.filter(t=>t.id!==e),this.favorites.length===0?await this.loadFavorites():this.renderFavoritesList()}catch(t){alert("Failed to remove favorite: "+t.message)}}}const ue={"/":new ae,"/about":new ie,"/login":new ne,"/register":new ce,"/add-story":new le,"/favorites":new de};function pe(o){const e=o.split("/");return{resource:e[1]||null,id:e[2]||null}}function he(o){let e="";return o.resource&&(e=e.concat(`/${o.resource}`)),o.id&&(e=e.concat("/:id")),e||"/"}function me(){return location.hash.replace("#","")||"/"}function fe(){const o=me(),e=pe(o);return he(e)}var y,d,h,b,V,_;class ye{constructor({navigationDrawer:e,drawerButton:t,content:r}){w(this,b);w(this,y,null);w(this,d,null);w(this,h,null);S(this,y,r),S(this,d,t),S(this,h,e),F(this,b,V).call(this),F(this,b,_).call(this)}async renderPage(){const e=fe(),t=ue[e];this.supportsViewTransition&&document.startViewTransition?await document.startViewTransition(async()=>{l(this,y).innerHTML=await t.render(),await t.afterRender()}).finished:(l(this,y).innerHTML=await t.render(),await t.afterRender()),l(this,y).focus()}}y=new WeakMap,d=new WeakMap,h=new WeakMap,b=new WeakSet,V=function(){l(this,d).addEventListener("click",()=>{const e=l(this,h).classList.toggle("open");l(this,d).setAttribute("aria-expanded",e)}),document.body.addEventListener("click",e=>{!l(this,h).contains(e.target)&&!l(this,d).contains(e.target)&&(l(this,h).classList.remove("open"),l(this,d).setAttribute("aria-expanded","false")),l(this,h).querySelectorAll("a").forEach(t=>{t.contains(e.target)&&(l(this,h).classList.remove("open"),l(this,d).setAttribute("aria-expanded","false"))})}),l(this,d).addEventListener("keydown",e=>{(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),l(this,d).click())})},_=function(){this.supportsViewTransition="startViewTransition"in document};async function ge(){if(!("serviceWorker"in navigator)){console.log("Service Worker not supported in this browser");return}try{const e=await navigator.serviceWorker.register("/story-map-app/sw.js",{scope:"/story-map-app/"});return console.log("Service Worker registered successfully:",e),e.addEventListener("updatefound",()=>{console.log("Service Worker update found");const t=e.installing;t.addEventListener("statechange",()=>{t.state==="installed"&&navigator.serviceWorker.controller&&console.log("New Service Worker available. Refresh to update.")})}),e}catch(o){return console.error("Service Worker registration failed:",o),null}}class ve{constructor(){this.deferredPrompt=null,this.installButton=null}init(){window.addEventListener("beforeinstallprompt",e=>{console.log("PWA: beforeinstallprompt event fired"),e.preventDefault(),this.deferredPrompt=e,this.showInstallButton()}),window.addEventListener("appinstalled",()=>{console.log("PWA: App installed successfully"),this.deferredPrompt=null,this.hideInstallButton()})}showInstallButton(){this.installButton||(this.installButton=document.createElement("button"),this.installButton.id="install-button",this.installButton.className="install-button",this.installButton.innerHTML="📱 Install App",this.installButton.setAttribute("aria-label","Install Story Map application"),this.installButton.addEventListener("click",()=>{this.promptInstall()}),document.body.appendChild(this.installButton)),this.installButton.style.display="block"}hideInstallButton(){this.installButton&&(this.installButton.style.display="none")}async promptInstall(){if(!this.deferredPrompt){console.log("PWA: Install prompt not available");return}this.deferredPrompt.prompt();const{outcome:e}=await this.deferredPrompt.userChoice;console.log(`PWA: User response to install prompt: ${e}`),this.deferredPrompt=null,this.hideInstallButton()}isInstalled(){return!!(window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===!0)}}document.addEventListener("DOMContentLoaded",async()=>{const o=new ye({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer")});await o.renderPage(),window.addEventListener("hashchange",async()=>{await o.renderPage()}),await ge();const e=new ve;e.init(),e.isInstalled()?console.log("PWA: App is already installed"):console.log("PWA: App is not installed yet")});
