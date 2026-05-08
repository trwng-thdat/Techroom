const materials = [
  {
    title: "Calculus Foundations: Limits & Continuity",
    type: "pdf",
    size: "4.2 MB",
    added: "OCT 12, 2023",
  },
  {
    title: "Interactive Desmos Graph: Unit Circle",
    type: "link",
    size: "",
    added: "OCT 10, 2023",
  },
  {
    title: "Homework Sheet 04: Trigonometric Identities",
    type: "doc",
    size: "850 KB",
    added: "OCT 08, 2023",
  },
  {
    title: "Midterm Exam Review: Semester A",
    type: "pdf",
    size: "12.5 MB",
    added: "OCT 05, 2023",
  },
  {
    title: "Visualizing Derivatives - 3Blue1Brown",
    type: "link",
    size: "",
    added: "OCT 02, 2023",
  },
];

const iconPaths = {
  pdf: '<path d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M14 3v5h5" /><path d="M8 13h8M8 17h5" />',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2" /><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2" />',
  doc: '<path d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h6" />',
};

const materialsList = document.querySelector("#materialsList");
const uploadFileButton = document.querySelector("#uploadFile");
const addLinkButton = document.querySelector("#addLink");

function renderMaterials() {
  materialsList.innerHTML = materials
    .map((material) => {
      const sizeText = material.size ? `${material.size}   •   ` : "";

      return `
        <article class="material-card">
          <span class="material-icon ${material.type}" aria-hidden="true">
            <svg viewBox="0 0 24 24">${iconPaths[material.type]}</svg>
          </span>
          <h3>${material.title}</h3>
          <p class="material-meta">${sizeText}ADDED ${material.added}</p>
          <button class="edit-button" type="button" data-title="${material.title}">Edit</button>
        </article>
      `;
    })
    .join("");
}

materialsList.addEventListener("click", (event) => {
  const editButton = event.target.closest(".edit-button");

  if (!editButton) {
    return;
  }

  window.alert(`Editor for ${editButton.dataset.title} will be added next.`);
});

uploadFileButton.addEventListener("click", () => {
  window.alert("Upload file flow will be added next.");
});

addLinkButton.addEventListener("click", () => {
  window.alert("Add link flow will be added next.");
});

renderMaterials();
