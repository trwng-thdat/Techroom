const materials = window.TeacherData.materials;

const iconPaths = {
  pdf: '<path d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M14 3v5h5" /><path d="M8 13h8M8 17h5" />',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2" /><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2" />',
  doc: '<path d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h6" />',
};

const materialsList = document.querySelector("#materialsList");
const uploadFileButton = document.querySelector("#uploadFile");
const addLinkButton = document.querySelector("#addLink");
const materialModal = document.querySelector("#materialModal");
const materialForm = document.querySelector("#materialForm");
const modalTitle = document.querySelector("#modalTitle");
const deleteFooter = document.querySelector("#deleteFooter");

// Form elements
const titleInput = document.querySelector("#materialTitle");
const descriptionInput = document.querySelector("#materialDescription");
const categorySelect = document.querySelector("#materialCategory");
const typeRadios = document.querySelectorAll('input[name="type"]');
const fileInput = document.querySelector("#materialFile");
const linkInput = document.querySelector("#materialLink");
const fileGroup = document.querySelector("#fileGroup");
const linkGroup = document.querySelector("#linkGroup");
const fileName = document.querySelector("#fileName");

let currentEditIndex = -1;

// Helper: Get current date in format "MMM DD, YYYY"
function getCurrentDate() {
  const date = new Date();
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${day.padStart(2, "0")}, ${year}`;
}

// Show toast notification
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

// Render materials list
function renderMaterials() {
  materialsList.innerHTML = materials
    .map((material, index) => {
      const sizeText = material.size ? `${material.size}   -   ` : "";

      return `
        <article class="material-card">
          <span class="material-icon ${material.type}" aria-hidden="true">
            <svg viewBox="0 0 24 24">${iconPaths[material.type]}</svg>
          </span>
          <h3>${material.title}</h3>
          <p class="material-meta">${sizeText}ADDED ${material.added}</p>
          <button class="edit-button" type="button" data-index="${index}">Edit</button>
        </article>
      `;
    })
    .join("");

  // Add event listeners to edit buttons
  document.querySelectorAll(".edit-button").forEach((btn) => {
    btn.addEventListener("click", (e) =>
      openEditModal(parseInt(e.target.dataset.index)),
    );
  });
}

// Open modal for creating new material
function openCreateModal() {
  currentEditIndex = -1;
  materialForm.reset();
  fileInput.value = "";
  fileName.textContent = "No file selected";
  deleteFooter.style.display = "none";
  modalTitle.textContent = "Add New Material";
  typeRadios[0].checked = true;
  updateTypeFields();
  openMaterialModal();
}

// Open modal for editing material
function openEditModal(index) {
  currentEditIndex = index;
  const material = materials[index];

  titleInput.value = material.title;
  descriptionInput.value = material.description || "";
  categorySelect.value = material.category || "";

  // Set type
  document.querySelector(
    `input[name="type"][value="${material.type}"]`,
  ).checked = true;
  updateTypeFields();

  // Set file or link
  if (material.type !== "link") {
    fileName.textContent = material.file || "No file selected";
  } else {
    linkInput.value = material.link || "";
  }

  deleteFooter.style.display = "block";
  modalTitle.textContent = "Edit Material";
  openMaterialModal();
}

// Update visibility of type-specific fields
function updateTypeFields() {
  const selectedType = document.querySelector(
    'input[name="type"]:checked',
  ).value;
  fileGroup.style.display = selectedType !== "link" ? "block" : "none";
  linkGroup.style.display = selectedType === "link" ? "block" : "none";
}

// Open material modal
function openMaterialModal() {
  materialModal.setAttribute("aria-hidden", "false");
}

// Close material modal
function closeMaterialModal() {
  materialModal.setAttribute("aria-hidden", "true");
  materialForm.reset();
  fileInput.value = "";
  fileName.textContent = "No file selected";
  currentEditIndex = -1;
}

// Handle form submission
materialForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const type = document.querySelector('input[name="type"]:checked').value;
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const category = categorySelect.value;

  if (!title || !category) {
    showToast("Please fill in all required fields", "error");
    return;
  }

  if (type !== "link" && !fileInput.files.length && currentEditIndex === -1) {
    showToast("Please select a file", "error");
    return;
  }

  if (type === "link" && !linkInput.value.trim()) {
    showToast("Please enter a valid link", "error");
    return;
  }

  if (currentEditIndex === -1) {
    // Create new material
    const newMaterial = {
      title,
      type,
      description,
      category,
      added: getCurrentDate(),
    };

    if (type === "link") {
      newMaterial.link = linkInput.value.trim();
      newMaterial.size = "";
    } else {
      const file = fileInput.files[0];
      newMaterial.file = file.name;
      newMaterial.size = (file.size / 1024 / 1024).toFixed(2) + " MB";
    }

    materials.push(newMaterial);
    showToast("Material added successfully");
  } else {
    // Edit existing material
    const material = materials[currentEditIndex];
    material.title = title;
    material.description = description;
    material.category = category;

    if (type === "link") {
      material.link = linkInput.value.trim();
      material.size = "";
    } else if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      material.file = file.name;
      material.size = (file.size / 1024 / 1024).toFixed(2) + " MB";
    }

    material.type = type;
    showToast("Material updated successfully");
  }

  renderMaterials();
  closeMaterialModal();
});

// Handle delete
document.querySelector(".delete-material-btn").addEventListener("click", () => {
  if (currentEditIndex === -1) return;

  showConfirm("Are you sure you want to delete this material?", () => {
    materials.splice(currentEditIndex, 1);
    renderMaterials();
    hideModal();
    showToast("Material deleted successfully");
  });
});

// Handle modal close button
document.querySelector(".modal-close").addEventListener("click", closeMaterialModal);
document.querySelector(".cancel-button").addEventListener("click", closeMaterialModal);

// Close modal when clicking overlay
document.querySelector(".material-modal-overlay").addEventListener("click", closeMaterialModal);

// Type radio change handler
typeRadios.forEach((radio) => {
  radio.addEventListener("change", updateTypeFields);
});

// File change handler
document.querySelector(".change-file-btn").addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    fileName.textContent = fileInput.files[0].name;
  }
});

// Upload file button
uploadFileButton.addEventListener("click", () => {
  openCreateModal();
  document.querySelector('input[name="type"][value="pdf"]').checked = true;
  updateTypeFields();
});

// Add link button
addLinkButton.addEventListener("click", () => {
  openCreateModal();
  document.querySelector('input[name="type"][value="link"]').checked = true;
  updateTypeFields();
});

// Initial render
renderMaterials();
