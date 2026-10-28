
const jobs = [
  {
    id: 1, title: "Frontend Developer Intern", company: "PixelCraft",
    initials: "PC", color: "purple", category: "Development",
    type: "Remote", location: "India", stipend: "₹10,000",
    skills: ["HTML", "CSS", "JavaScript"],
    description: "Build responsive web pages and interactive user experiences with a creative development team."
  },
  {
    id: 2, title: "Python Developer Intern", company: "CodeNest",
    initials: "CN", color: "green", category: "Development",
    type: "Hybrid", location: "Pune", stipend: "₹12,000",
    skills: ["Python", "SQL", "Git"],
    description: "Work on Python applications, automate tasks, and learn software development practices."
  },
  {
    id: 3, title: "UI/UX Design Intern", company: "DesignLoop",
    initials: "DL", color: "purple", category: "Design",
    type: "Remote", location: "India", stipend: "₹8,000",
    skills: ["UI/UX", "Figma", "Prototyping"],
    description: "Create wireframes, prototypes, and intuitive designs for real-world digital products."
  },
  {
    id: 4, title: "Data Analyst Intern", company: "Insight Labs",
    initials: "IL", color: "orange", category: "Data",
    type: "On-site", location: "Mumbai", stipend: "₹15,000",
    skills: ["Python", "SQL", "Excel"],
    description: "Analyze datasets, identify trends, and turn information into useful business insights."
  },
  {
    id: 5, title: "React Developer Intern", company: "WebOrbit",
    initials: "WO", color: "green", category: "Development",
    type: "Remote", location: "India", stipend: "₹12,000",
    skills: ["React", "JavaScript", "CSS"],
    description: "Develop reusable interface components and build modern web application features."
  },
  {
    id: 6, title: "Digital Marketing Intern", company: "GrowthHive",
    initials: "GH", color: "orange", category: "Marketing",
    type: "Hybrid", location: "Pune", stipend: "₹7,000",
    skills: ["SEO", "Content", "Analytics"],
    description: "Support digital campaigns, improve website visibility, and analyze marketing results."
  },
  {
    id: 7, title: "Machine Learning Intern", company: "FutureMind",
    initials: "FM", color: "purple", category: "Data",
    type: "Remote", location: "India", stipend: "₹15,000",
    skills: ["Python", "SQL", "Machine Learning"],
    description: "Explore datasets, experiment with machine learning models, and evaluate their performance."
  },
  {
    id: 8, title: "Electrical Design Intern", company: "VoltEdge",
    initials: "VE", color: "orange", category: "Engineering",
    type: "On-site", location: "Pune", stipend: "₹9,000",
    skills: ["Electrical", "AutoCAD", "MATLAB"],
    description: "Assist with electrical drawings, basic circuit analysis, and engineering documentation."
  },
  {
    id: 9, title: "Backend Developer Intern", company: "CloudStack",
    initials: "CS", color: "green", category: "Development",
    type: "Hybrid", location: "Mumbai", stipend: "₹14,000",
    skills: ["Python", "SQL", "APIs"],
    description: "Learn server-side programming, database integration, and API development."
  }
];

const STORAGE = {
  saved: "skilllink_saved_v1",
  applications: "skilllink_applications_v1"
};

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

let savedJobs = readStorage(STORAGE.saved, []);
let applications = readStorage(STORAGE.applications, []);
let activeSkill = "";
let toastTimeout;

const jobGrid = document.getElementById("jobGrid");
const savedGrid = document.getElementById("savedGrid");
const emptyJobs = document.getElementById("emptyJobs");
const emptySaved = document.getElementById("emptySaved");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const typeFilter = document.getElementById("typeFilter");
const jobCount = document.getElementById("jobCount");
const savedCount = document.getElementById("savedCount");
const applicationBody = document.getElementById("applicationBody");
const emptyApplications = document.getElementById("emptyApplications");
const toast = document.getElementById("toast");

function saveData() {
  try {
    localStorage.setItem(STORAGE.saved, JSON.stringify(savedJobs));
    localStorage.setItem(STORAGE.applications, JSON.stringify(applications));
    return true;
  } catch {
    showToast("Could not save data. Check your browser storage.");
    return false;
  }
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function showToast(message) {
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add("show");

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function isSaved(id) {
  return savedJobs.includes(id);
}

function getApplication(id) {
  return applications.find(app => app.jobId === id);
}

function renderJobCard(job) {
  const saved = isSaved(job.id);
  const applied = Boolean(getApplication(job.id));

  return `
    <article class="job-card">
      <div class="job-card-top">
        <div class="company-logo ${escapeHTML(job.color)}">
          ${escapeHTML(job.initials)}
        </div>
        <button
          class="heart-btn ${saved ? "saved" : ""}"
          data-action="save"
          data-id="${job.id}"
          aria-label="${saved ? "Remove saved job" : "Save job"}"
          aria-pressed="${saved}"
          title="${saved ? "Remove from saved jobs" : "Save this job"}"
        >${saved ? "♥" : "♡"}</button>
      </div>

      <h3 class="job-title">${escapeHTML(job.title)}</h3>
      <p class="company-name">${escapeHTML(job.company)}</p>

      <div class="job-meta">
        <span>${escapeHTML(job.type)}</span>
        <span>${escapeHTML(job.location)}</span>
        <span>${escapeHTML(job.category)}</span>
      </div>

      <p class="job-description">${escapeHTML(job.description)}</p>

      <div class="skill-list">
        ${job.skills.map(skill =>
          `<span class="skill-tag">${escapeHTML(skill)}</span>`
        ).join("")}
      </div>

      <div class="job-card-bottom">
        <div class="stipend">
          ${escapeHTML(job.stipend)}
          <small>per month · sample</small>
        </div>
        <button
          class="apply-btn"
          data-action="apply"
          data-id="${job.id}"
          ${applied ? "disabled" : ""}
        >${applied ? "Applied ✓" : "Apply now ↗"}</button>
      </div>
    </article>
  `;
}

function getFilteredJobs() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const type = typeFilter.value;

  return jobs.filter(job => {
    const searchableText = [
      job.title,
      job.company,
      job.category,
      job.location,
      job.type,
      ...job.skills
    ].join(" ").toLowerCase();

    const matchesSearch = !query || searchableText.includes(query);
    const matchesCategory =
      category === "all" || job.category === category;
    const matchesType = type === "all" || job.type === type;
    const matchesSkill =
      !activeSkill ||
      searchableText.includes(activeSkill.toLowerCase());

    return matchesSearch && matchesCategory && matchesType && matchesSkill;
  });
}

function renderJobs() {
  const filteredJobs = getFilteredJobs();

  jobGrid.innerHTML = filteredJobs.map(renderJobCard).join("");
  jobCount.textContent =
    `${filteredJobs.length} ${filteredJobs.length === 1 ? "opportunity" : "opportunities"}`;

  emptyJobs.classList.toggle("hidden", filteredJobs.length !== 0);
}

function renderSavedJobs() {
  const list = jobs.filter(job => savedJobs.includes(job.id));

  savedGrid.innerHTML = list.map(renderJobCard).join("");
  savedCount.textContent = `${list.length} saved`;
  emptySaved.classList.toggle("hidden", list.length !== 0);
}

function renderApplications() {
  const total = applications.length;
  const underReview = applications.filter(
    app => app.status === "Under review"
  ).length;
  const offers = applications.filter(
    app => app.status === "Offer received"
  ).length;

  document.getElementById("totalApps").textContent = total;
  document.getElementById("reviewApps").textContent = underReview;
  document.getElementById("offerApps").textContent = offers;

  emptyApplications.classList.toggle("hidden", total !== 0);

  applicationBody.innerHTML = applications.map(app => {
    const job = jobs.find(item => item.id === app.jobId);
    if (!job) return "";

    return `
      <tr>
        <td><strong>${escapeHTML(job.title)}</strong></td>
        <td>${escapeHTML(job.company)}</td>
        <td>${escapeHTML(app.date)}</td>
        <td>
          <select
            class="status-select"
            data-action="status"
            data-id="${job.id}"
            aria-label="Application status for ${escapeHTML(job.title)}"
          >
            ${[
              "Applied",
              "Under review",
              "Interview",
              "Offer received",
              "Rejected"
            ].map(status => `
              <option value="${status}"
                ${app.status === status ? "selected" : ""}>
                ${status}
              </option>
            `).join("")}
          </select>
        </td>
        <td>
          <button class="remove-btn"
            data-action="remove-application"
            data-id="${job.id}">Remove</button>
        </td>
      </tr>
    `;
  }).join("");
}

function renderAll() {
  renderJobs();
  renderSavedJobs();
  renderApplications();
}

function toggleSavedJob(id) {
  if (isSaved(id)) {
    savedJobs = savedJobs.filter(savedId => savedId !== id);
    if (saveData()) showToast("Job removed from your saved list.");
  } else {
    savedJobs.push(id);
    if (saveData()) showToast("Job saved successfully!");
  }

  renderAll();
}

function applyToJob(id) {
  if (getApplication(id)) {
    showToast("You have already applied to this sample listing.");
    return;
  }

  const job = jobs.find(item => item.id === id);
  if (!job) return;

  const date = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  applications.push({
    jobId: id,
    date,
    status: "Applied"
  });

  if (saveData()) {
    renderAll();
    showToast(`Application added for ${job.title}!`);
  } else {
    applications = applications.filter(app => app.jobId !== id);
    renderAll();
  }
}

// Handle clicks on dynamically generated job cards.
document.addEventListener("click", event => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  const id = Number(button.dataset.id);

  if (!Number.isInteger(id)) return;

  if (action === "save") {
    toggleSavedJob(id);
  }

  if (action === "apply") {
    applyToJob(id);
  }

  if (action === "remove-application") {
    applications = applications.filter(app => app.jobId !== id);

    if (saveData()) {
      renderAll();
      showToast("Application removed from your tracker.");
    }
  }
});

// Update application status.
document.addEventListener("change", event => {
  const select = event.target.closest('[data-action="status"]');
  if (!select) return;

  const id = Number(select.dataset.id);
  const app = getApplication(id);

  const validStatuses = [
    "Applied",
    "Under review",
    "Interview",
    "Offer received",
    "Rejected"
  ];

  if (!app || !validStatuses.includes(select.value)) return;

  const previousStatus = app.status;
  app.status = select.value;

  if (saveData()) {
    renderApplications();
    showToast("Application status updated.");
  } else {
    app.status = previousStatus;
    renderApplications();
  }
});

// Search and filters.
document.getElementById("searchButton").addEventListener("click", renderJobs);

searchInput.addEventListener("input", renderJobs);
categoryFilter.addEventListener("change", renderJobs);
typeFilter.addEventListener("change", renderJobs);

document.querySelectorAll(".skill-chip").forEach(button => {
  button.addEventListener("click", () => {
    const selected = button.dataset.skill;

    activeSkill = activeSkill === selected ? "" : selected;

    document.querySelectorAll(".skill-chip").forEach(chip => {
      chip.classList.toggle(
        "selected",
        chip.dataset.skill === activeSkill
      );
    });

    renderJobs();
  });
});

function clearFilters() {
  searchInput.value = "";
  categoryFilter.value = "all";
  typeFilter.value = "all";
  activeSkill = "";

  document.querySelectorAll(".skill-chip").forEach(chip => {
    chip.classList.remove("selected");
  });

  renderJobs();
}

document.getElementById("clearFilters").addEventListener("click", clearFilters);
document.getElementById("resetSearch").addEventListener("click", clearFilters);

// Highlight the current section in the navigation.
const navLinks = document.querySelectorAll(".nav-link");

function updateActiveNav() {
  const current = window.location.hash || "#home";

  navLinks.forEach(link => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === current
    );
  });
}

window.addEventListener("hashchange", updateActiveNav);

// Set the current year in the footer.
document.getElementById("year").textContent = new Date().getFullYear();

// Load saved data and display the website.
renderAll();
updateActiveNav();
