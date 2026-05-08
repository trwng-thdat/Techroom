const searchInput = document.querySelector("#searchClasses");
const classList = document.querySelector(".class-list");
const classCards = Array.from(document.querySelectorAll(".class-card"));

function renderEmptyState() {
  const emptyState = document.createElement("p");
  emptyState.className = "empty-state";
  emptyState.textContent = "No classes match your search.";
  classList.appendChild(emptyState);
}

function removeEmptyState() {
  const emptyState = document.querySelector(".empty-state");

  if (emptyState) {
    emptyState.remove();
  }
}

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  removeEmptyState();

  classCards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    const isVisible = text.includes(query);
    card.hidden = !isVisible;

    if (isVisible) {
      visibleCount += 1;
    }
  });

  if (visibleCount === 0) {
    renderEmptyState();
  }
});

classCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    if (event.target.closest(".open-class")) {
      return;
    }
    const code = card.querySelector(".class-code").textContent;
    window.location.href = `../class-management/index.html?code=${encodeURIComponent(code)}`;
  });

  const openBtn = card.querySelector(".open-class");
  if (openBtn) {
    openBtn.addEventListener("click", () => {
      const code = card.querySelector(".class-code").textContent;
      window.location.href = `../class-management/index.html?code=${encodeURIComponent(code)}`;
    });
  }
});
