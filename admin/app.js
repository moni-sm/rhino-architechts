// Administrator Portal State & Configuration
const ADMIN_USER = "admin";
const ADMIN_PASS = "rhino-admin-2026";
const TEST_USER = "test";
const TEST_PASS = "test";

const API_BASE_URL = window.API_BASE_URL || "http://localhost:8000";
const API_URL = `${API_BASE_URL}/api/projects`;
const REVIEWS_API_URL = `${API_BASE_URL}/api/reviews`;

// Global State
let projectsData = [];
let reviewsData = [];
let activeTab = "dashboard";
let activeReviewFilter = "all"; // 'all' | 'pending' | 'published'

// Document DOM Element Bindings
const loginGate = document.getElementById("login-gate");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const dashboardWrapper = document.getElementById("dashboard-wrapper");
const logoutBtn = document.getElementById("logout-btn");
const pageTitle = document.getElementById("page-title");
const pageSubtitle = document.getElementById("page-subtitle");

const projectForm = document.getElementById("project-form");
const projectList = document.getElementById("projects-list-container");
const projectCountText = document.getElementById("project-count-text");

const reviewsList = document.getElementById("reviews-list-container");
const pendingReviewCountText = document.getElementById("pending-review-count-text");

const projectDrawer = document.getElementById("project-drawer");
const confirmModal = document.getElementById("confirm-modal");
const toastContainer = document.getElementById("toast-container");

// Dashboard Recent Columns
const dashboardRecentProjects = document.getElementById("dashboard-recent-projects");
const dashboardRecentReviews = document.getElementById("dashboard-recent-reviews");

// User Display Bindings
const userAvatarChar = document.getElementById("user-avatar-char");
const userNameDisplay = document.getElementById("user-name-display");

// 1. Initial Load & Session Validation
window.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("adminSession") === "active") {
    setupUserProfile();
    showDashboard();
  } else {
    showLogin();
  }
});

// Setup User Profile displays based on session info
function setupUserProfile() {
  const loggedUser = sessionStorage.getItem("loggedUser") || "Administrator";
  userNameDisplay.textContent = loggedUser;
  userAvatarChar.textContent = loggedUser.charAt(0).toUpperCase();
}

// 2. Authentication Logic
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const user = usernameInput.value.trim();
  const pass = passwordInput.value.trim();
  
  const isValidAdmin = user === ADMIN_USER && pass === ADMIN_PASS;
  const isValidTest = user === TEST_USER && pass === TEST_PASS;
  
  if (isValidAdmin || isValidTest) {
    const displayName = isValidAdmin ? "Administrator" : "Test Guest";
    sessionStorage.setItem("adminSession", "active");
    sessionStorage.setItem("loggedUser", displayName);
    
    loginError.style.display = "none";
    setupUserProfile();
    showDashboard();
    
    usernameInput.value = "";
    passwordInput.value = "";
    
    showToast(`Session unlocked for ${displayName}!`, "success");
  } else {
    loginError.style.display = "block";
    passwordInput.value = "";
    showToast("Access Denied: Invalid credentials.", "danger");
    setTimeout(() => {
      loginError.style.display = "none";
    }, 4000);
  }
});

logoutBtn.addEventListener("click", () => {
  sessionStorage.removeItem("adminSession");
  sessionStorage.removeItem("loggedUser");
  showToast("Session locked successfully.", "warning");
  showLogin();
});

function showDashboard() {
  loginGate.style.display = "none";
  dashboardWrapper.style.display = "flex";
  
  // Reset tabs
  switchTab("dashboard");
  
  // Load data
  fetchAllData();
}

function showLogin() {
  loginGate.style.display = "flex";
  dashboardWrapper.style.display = "none";
}

// Fetch all elements from APIs
async function fetchAllData() {
  await Promise.all([fetchProjects(), fetchReviews()]);
  renderDashboardOverview();
}

// 3. Client Side Routing & Tabs switcher
window.switchTab = (tabId) => {
  activeTab = tabId;
  
  // Update sidebar button active state
  document.querySelectorAll(".sidebar-nav .nav-item").forEach(btn => {
    btn.classList.remove("active");
  });
  
  const activeBtn = document.getElementById(`nav-${tabId}`);
  if (activeBtn) activeBtn.classList.add("active");
  
  // Toggle visibility of panels
  document.querySelectorAll(".main-panel-content .tab-panel").forEach(panel => {
    panel.classList.remove("active");
  });
  
  const activePanel = document.getElementById(`view-${tabId}`);
  if (activePanel) activePanel.classList.add("active");
  
  // Set headers text dynamically
  if (tabId === "dashboard") {
    pageTitle.textContent = "Dashboard Overview";
    pageSubtitle.textContent = "Welcome back. Here is the active website snapshot.";
    renderDashboardOverview();
  } else if (tabId === "projects") {
    pageTitle.textContent = "Showcase Catalog";
    pageSubtitle.textContent = "Manage architectural project galleries highlighted on the homepage.";
    filterProjects();
  } else if (tabId === "reviews") {
    pageTitle.textContent = "Reviews Moderation";
    pageSubtitle.textContent = "Approve client submissions or delete feedback from the database.";
    renderReviews();
  }
};

// 4. Projects Showcase logic
async function fetchProjects() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Database request failed");
    projectsData = await res.json();
    populateCategoryFilters();
    updateProjectsStats();
  } catch (error) {
    console.error("Fetch projects error:", error);
    showToast("Could not sync projects. Backend database offline.", "danger");
  }
}

function updateProjectsStats() {
  const statProjectsCount = document.getElementById("stat-projects-count");
  if (statProjectsCount) statProjectsCount.textContent = projectsData.length;
}

// Populate search filter dropdowns dynamically based on existing categories
function populateCategoryFilters() {
  const filterCat = document.getElementById("project-filter-category");
  if (!filterCat) return;
  
  // Keep the 'All' option
  filterCat.innerHTML = '<option value="all">All Categories</option>';
  
  // Extract unique categories
  const categories = [...new Set(projectsData.map(p => p.category))];
  categories.sort().forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat.toLowerCase();
    opt.textContent = cat;
    filterCat.appendChild(opt);
  });
}

// Search and Filter projects logic
window.filterProjects = () => {
  const searchVal = document.getElementById("project-search").value.toLowerCase().trim();
  const selectCat = document.getElementById("project-filter-category").value;
  const selectStatus = document.getElementById("project-filter-status").value;
  
  const filtered = projectsData.filter(proj => {
    const matchesSearch = proj.title.toLowerCase().includes(searchVal) ||
                          proj.category.toLowerCase().includes(searchVal) ||
                          proj.location.toLowerCase().includes(searchVal);
                          
    const matchesCategory = selectCat === "all" || proj.category.toLowerCase() === selectCat;
    const matchesStatus = selectStatus === "all" || proj.status.toLowerCase() === selectStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  renderProjectsList(filtered);
};

// Render active grid of showcase items
function renderProjectsList(projects) {
  projectCountText.textContent = `Displaying ${projects.length} of ${projectsData.length} total showcase project(s).`;
  
  if (projects.length === 0) {
    projectList.innerHTML = `
      <div class="empty-placeholder" style="grid-column: 1 / -1;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        <p>No project showcase items match your active filters.</p>
      </div>
    `;
    return;
  }
  
  projectList.innerHTML = "";
  
  projects.forEach((proj) => {
    // Find the original global array index of this project to pass to the delete function
    const originalIndex = projectsData.findIndex(p => p.title === proj.title && p.image === proj.image);
    
    const card = document.createElement("div");
    card.className = "admin-project-card";
    
    const statusClass = proj.status ? proj.status.toLowerCase() : "completed";
    const statusLabel = proj.status || "Completed";
    
    card.innerHTML = `
      <div class="card-img-wrapper">
        <img src="${proj.image}" alt="${proj.title}" onerror="this.src='https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'" />
        <span class="card-badge-status ${statusClass}">${statusLabel}</span>
      </div>
      <div class="card-project-body">
        <h3>${proj.title}</h3>
        <div class="card-project-meta">
          <span>📂 ${proj.category}</span>
          <span>📍 ${proj.location}</span>
        </div>
        <p class="card-project-desc">${proj.details || "No project description provided."}</p>
        <div class="card-project-footer">
          <button class="btn-table-action delete" onclick="deleteProject(${originalIndex})">
            🗑️ Delete Project
          </button>
        </div>
      </div>
    `;
    projectList.appendChild(card);
  });
}

// Add Project Showcase (Submit API)
projectForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const title = document.getElementById("proj-title").value.trim();
  const category = document.getElementById("proj-cat").value.trim();
  const location = document.getElementById("proj-loc").value.trim();
  const status = document.getElementById("proj-status").value;
  const image = document.getElementById("proj-img").value.trim();
  const details = document.getElementById("proj-details").value.trim();
  
  const submitBtn = document.getElementById("submit-btn");
  submitBtn.disabled = true;
  submitBtn.textContent = "Uploading to DB...";
  
  const projectData = { title, category, location, image, details, status };
  
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(projectData)
    });
    
    if (res.ok) {
      showToast(`Showcase "${title}" published successfully!`, "success");
      projectForm.reset();
      closeDrawer();
      await fetchProjects();
      if (activeTab === "projects") {
        filterProjects();
      } else {
        renderDashboardOverview();
      }
    } else {
      throw new Error("Failed to post project showcase details");
    }
  } catch (error) {
    console.error("Submit error:", error);
    showToast("Failed to upload project details. Verify backend connection.", "danger");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Save Project";
  }
});

// Delete project showcase
window.deleteProject = async (index) => {
  const project = projectsData[index];
  if (!project) return;
  
  const confirmed = await showConfirmModal(`Are you sure you want to delete the project showcase "${project.title}"?`);
  if (!confirmed) return;
  
  try {
    const res = await fetch(`${API_URL}/${index}`, {
      method: "DELETE"
    });
    
    if (res.ok) {
      showToast(`Showcase project "${project.title}" removed.`, "warning");
      await fetchProjects();
      if (activeTab === "projects") {
        filterProjects();
      } else {
        renderDashboardOverview();
      }
    } else {
      showToast("Could not remove project showcase from database.", "danger");
    }
  } catch (error) {
    console.error("Delete error:", error);
    showToast("Connection failure: Backend database unreachable.", "danger");
  }
};

// 5. Testimonial Reviews Moderation logic
async function fetchReviews() {
  try {
    const res = await fetch(`${REVIEWS_API_URL}/all`);
    if (!res.ok) throw new Error("Database request failed");
    reviewsData = await res.json();
    updateReviewsStats();
  } catch (error) {
    console.error("Fetch reviews error:", error);
    showToast("Could not sync reviews. Backend database offline.", "danger");
  }
}

function updateReviewsStats() {
  let pendingCount = 0;
  let publishedCount = 0;
  
  reviewsData.forEach(rev => {
    if (rev.published) {
      publishedCount++;
    } else {
      pendingCount++;
    }
  });
  
  // Set Stats Cards
  const statPending = document.getElementById("stat-pending-reviews-count");
  if (statPending) statPending.textContent = pendingCount;
  
  const statPublished = document.getElementById("stat-published-reviews-count");
  if (statPublished) statPublished.textContent = publishedCount;
  
  // Set tab badges
  const badgeAll = document.getElementById("badge-rev-all");
  const badgePending = document.getElementById("badge-rev-pending");
  const badgePublished = document.getElementById("badge-rev-published");
  
  if (badgeAll) badgeAll.textContent = reviewsData.length;
  if (badgePending) badgePending.textContent = pendingCount;
  if (badgePublished) badgePublished.textContent = publishedCount;
}

window.filterReviewsTab = (filterType) => {
  activeReviewFilter = filterType;
  
  // Highlight active tab
  document.querySelectorAll(".moderation-tabs .mod-tab").forEach(tab => {
    tab.classList.remove("active");
  });
  
  const activeTabBtn = document.getElementById(`tab-rev-${filterType}`);
  if (activeTabBtn) activeTabBtn.classList.add("active");
  
  renderReviews();
};

function renderReviews() {
  let filtered = reviewsData;
  if (activeReviewFilter === "pending") {
    filtered = reviewsData.filter(r => !r.published);
  } else if (activeReviewFilter === "published") {
    filtered = reviewsData.filter(r => r.published);
  }
  
  pendingReviewCountText.textContent = `Displaying ${filtered.length} review(s) in this list filter.`;
  
  if (filtered.length === 0) {
    reviewsList.innerHTML = `
      <div class="empty-placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <p>No client reviews found matching this filter tab.</p>
      </div>
    `;
    return;
  }
  
  reviewsList.innerHTML = "";
  
  filtered.forEach((rev) => {
    // Find original index in general reviewsData
    const originalIndex = reviewsData.findIndex(r => r.author === rev.author && r.quote === rev.quote);
    
    const stars = "★".repeat(rev.rating || 5) + "☆".repeat(5 - (rev.rating || 5));
    const isPublished = rev.published;
    
    const badgeClass = isPublished ? "completed" : "ongoing";
    const badgeText = isPublished ? "Published" : "Pending Approval";
    
    const toggleBtnClass = isPublished ? "unpublish" : "publish";
    const toggleBtnText = isPublished ? "🔒 Unpublish" : "🔓 Approve & Publish";
    
    const item = document.createElement("div");
    item.className = "review-moderation-item";
    
    item.innerHTML = `
      <div class="review-avatar-quote">“</div>
      <div class="review-body">
        <div class="review-header-row">
          <div class="review-author-title">
            <h3>${rev.author}</h3>
            <span>💼 ${rev.role}</span>
          </div>
          <span class="status-badge-admin ${badgeClass}">${badgeText}</span>
        </div>
        <div class="review-stars">${stars}</div>
        <p class="review-quote-text">"${rev.quote}"</p>
      </div>
      <div class="review-action-col">
        <button class="btn-table-action ${toggleBtnClass}" onclick="togglePublishReview(${originalIndex})">
          ${toggleBtnText}
        </button>
        <button class="btn-table-action delete" onclick="deleteReview(${originalIndex})">
          🗑️ Delete
        </button>
      </div>
    `;
    reviewsList.appendChild(item);
  });
}

// Toggle Review published status
window.togglePublishReview = async (index) => {
  const rev = reviewsData[index];
  if (!rev) return;
  
  try {
    const res = await fetch(`${REVIEWS_API_URL}/${index}/toggle-publish`, {
      method: "PUT"
    });
    
    if (res.ok) {
      const data = await res.json();
      const statusLabel = data.published ? "Published" : "Unpublished";
      showToast(`Review by ${rev.author} has been ${statusLabel}.`, "success");
      await fetchReviews();
      if (activeTab === "reviews") {
        renderReviews();
      } else {
        renderDashboardOverview();
      }
    } else {
      showToast("Failed to modify review status.", "danger");
    }
  } catch (error) {
    console.error("Toggle publish error:", error);
    showToast("Connection error: backend server is offline.", "danger");
  }
};

// Delete Review
window.deleteReview = async (index) => {
  const rev = reviewsData[index];
  if (!rev) return;
  
  const confirmed = await showConfirmModal(`Are you sure you want to permanently delete the review submitted by "${rev.author}"?`);
  if (!confirmed) return;
  
  try {
    const res = await fetch(`${REVIEWS_API_URL}/${index}`, {
      method: "DELETE"
    });
    
    if (res.ok) {
      showToast(`Review by "${rev.author}" deleted.`, "warning");
      await fetchReviews();
      if (activeTab === "reviews") {
        renderReviews();
      } else {
        renderDashboardOverview();
      }
    } else {
      showToast("Failed to delete review from the database.", "danger");
    }
  } catch (error) {
    console.error("Delete review error:", error);
    showToast("Connection failure: database unreachable.", "danger");
  }
};

// 6. Dashboard Overview Renderer (Summaries/Recent activities)
function renderDashboardOverview() {
  // 1. Recent Projects (up to 3)
  dashboardRecentProjects.innerHTML = "";
  if (projectsData.length === 0) {
    dashboardRecentProjects.innerHTML = `<p style="padding:15px 0; font-size:0.85rem; color:#64748B;">No recent projects available.</p>`;
  } else {
    // Show last 3 elements in array (most recent)
    const recent = [...projectsData].reverse().slice(0, 3);
    recent.forEach((proj) => {
      const item = document.createElement("div");
      item.className = "activity-item";
      item.innerHTML = `
        <img src="${proj.image}" alt="${proj.title}" onerror="this.src='https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'" />
        <div class="activity-item-details">
          <h4>${proj.title}</h4>
          <p>📂 ${proj.category} • 📍 ${proj.location}</p>
        </div>
      `;
      dashboardRecentProjects.appendChild(item);
    });
  }
  
  // 2. Pending Moderation Queue (up to 3)
  dashboardRecentReviews.innerHTML = "";
  const pending = reviewsData.filter(r => !r.published);
  
  if (pending.length === 0) {
    dashboardRecentReviews.innerHTML = `
      <div class="empty-placeholder" style="padding: 30px; gap: 8px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width: 32px; height: 32px;">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 14 14"></polyline>
        </svg>
        <p style="font-size:0.85rem;">All caught up! No reviews pending approval.</p>
      </div>
    `;
  } else {
    const recentPending = [...pending].reverse().slice(0, 3);
    recentPending.forEach((rev) => {
      // Find index in original reviewsData
      const originalIndex = reviewsData.findIndex(r => r.author === rev.author && r.quote === rev.quote);
      
      const item = document.createElement("div");
      item.className = "activity-item";
      item.innerHTML = `
        <div class="activity-item-icon-box">“</div>
        <div class="activity-item-details">
          <h4>${rev.author}</h4>
          <p style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:240px;">"${rev.quote}"</p>
        </div>
        <button class="btn-table-action publish" onclick="togglePublishReview(${originalIndex})" style="padding: 5px 8px; font-size: 0.7rem;">Publish</button>
      `;
      dashboardRecentReviews.appendChild(item);
    });
  }
}

// 7. Slide-over Project Form Drawer Drawer toggling
window.openDrawer = () => {
  projectDrawer.classList.add("open");
  document.body.style.overflow = "hidden"; // Disable scroll behind
};

window.closeDrawer = () => {
  projectDrawer.classList.remove("open");
  document.body.style.overflow = ""; // Re-enable scroll
  projectForm.reset();
};

// 8. Custom Confirmation Dialog Modal (Promise-based)
function showConfirmModal(message) {
  return new Promise((resolve) => {
    const msgEl = document.getElementById("confirm-modal-message");
    const cancelBtn = document.getElementById("confirm-modal-cancel");
    const submitBtn = document.getElementById("confirm-modal-submit");
    
    msgEl.textContent = message;
    confirmModal.classList.add("open");
    
    const cleanup = (confirmed) => {
      confirmModal.classList.remove("open");
      cancelBtn.onclick = null;
      submitBtn.onclick = null;
      resolve(confirmed);
    };
    
    cancelBtn.onclick = () => cleanup(false);
    submitBtn.onclick = () => cleanup(true);
  });
}

// 9. Custom Toast Notification Helper
window.showToast = (message, type = "success") => {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  let icon = "✨";
  let title = "Success";
  
  if (type === "warning") {
    icon = "⚠️";
    title = "System Alert";
  } else if (type === "danger") {
    icon = "✗";
    title = "Failure Error";
  }
  
  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-content">
      <h4>${title}</h4>
      <p>${message}</p>
    </div>
    <button class="toast-close-btn">&times;</button>
    <div class="toast-progress">
      <div class="toast-progress-bar-fill"></div>
    </div>
  `;
  
  toastContainer.appendChild(toast);
  
  const dismiss = () => {
    toast.classList.add("removing");
    setTimeout(() => {
      if (toast.parentNode) {
        toastContainer.removeChild(toast);
      }
    }, 300);
  };
  
  // Close on manual click
  const closeBtn = toast.querySelector(".toast-close-btn");
  closeBtn.onclick = dismiss;
  
  // Auto-dismiss after 4 seconds
  const autoTimer = setTimeout(dismiss, 4000);
};
