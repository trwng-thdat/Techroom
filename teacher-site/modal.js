(function () {
  const style = document.createElement("style");
  style.textContent = `
    .modal-overlay {
      position: fixed; inset: 0; z-index: 200;
      display: flex; align-items: center; justify-content: center;
      background: rgba(23, 33, 30, 0.4);
      backdrop-filter: blur(2px);
    }
    .modal-box {
      max-width: min(420px, calc(100vw - 32px));
      border-radius: 12px; padding: 28px 30px 22px;
      background: #fff;
      box-shadow: 0 24px 48px rgba(23, 33, 30, 0.2);
      text-align: center;
    }
    .modal-message {
      margin: 0 0 20px;
      color: #1a2522;
      font-size: 14px; font-weight: 600; line-height: 1.5;
    }
    .modal-actions {
      display: flex; gap: 10px; justify-content: center;
    }
    .modal-btn {
      min-width: 80px; height: 38px;
      border: 0; border-radius: 8px;
      cursor: pointer;
      font-size: 13px; font-weight: 800;
    }
    .modal-btn.primary {
      color: #fff;
      background: #007a66;
    }
    .modal-btn.primary:hover { background: #008c76; }
    .modal-btn.secondary {
      color: #1a2522;
      background: #dfe7e4;
    }
    .modal-btn.secondary:hover { background: #d0dad6; }
    .modal-btn.danger {
      color: #fff;
      background: #d62828;
    }
    .modal-btn.danger:hover { background: #c41e1e; }
  `;
  document.head.appendChild(style);

  let modalEl = null;

  window.showModal = function (message) {
    if (modalEl) modalEl.remove();

    modalEl = document.createElement("div");
    modalEl.className = "modal-overlay";
    modalEl.innerHTML = `
      <div class="modal-box" role="dialog" aria-modal="true">
        <p class="modal-message">${message}</p>
        <div class="modal-actions">
          <button class="modal-btn primary modal-close" type="button">OK</button>
        </div>
      </div>
    `;

    modalEl.addEventListener("click", (event) => {
      if (event.target === modalEl || event.target.classList.contains("modal-close")) {
        modalEl.remove();
        modalEl = null;
      }
    });

    document.body.appendChild(modalEl);
  };

  window.showConfirm = function (message, onConfirm) {
    if (modalEl) modalEl.remove();

    modalEl = document.createElement("div");
    modalEl.className = "modal-overlay";
    modalEl.innerHTML = `
      <div class="modal-box" role="dialog" aria-modal="true">
        <p class="modal-message">${message}</p>
        <div class="modal-actions">
          <button class="modal-btn secondary modal-cancel" type="button">Cancel</button>
          <button class="modal-btn danger modal-confirm" type="button">Delete</button>
        </div>
      </div>
    `;

    const close = () => { modalEl.remove(); modalEl = null; };

    modalEl.addEventListener("click", (event) => {
      if (event.target === modalEl || event.target.classList.contains("modal-cancel")) {
        close();
      }
      if (event.target.classList.contains("modal-confirm")) {
        close();
        if (onConfirm) onConfirm();
      }
    });

    document.body.appendChild(modalEl);
  };
})();
