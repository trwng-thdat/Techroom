const roomGrid = document.querySelector("#roomGrid");
const addRoomButton = document.querySelector("#addRoomButton");
const roomModal = document.querySelector("#roomModal");
const closeRoomModal = document.querySelector("#closeRoomModal");
const cancelRoomModal = document.querySelector("#cancelRoomModal");
const deleteRoomButton = document.querySelector("#deleteRoomButton");
const roomForm = document.querySelector("#roomForm");
const roomEditId = document.querySelector("#roomEditId");
const roomName = document.querySelector("#roomName");
const roomCapacity = document.querySelector("#roomCapacity");
const roomLocation = document.querySelector("#roomLocation");
const roomStatus = document.querySelector("#roomStatus");
const roomEquipment = document.querySelector("#roomEquipment");
const roomModalTitle = document.querySelector("#roomModalTitle");
const rooms = window.StaffData.facilities.map((room) => ({ ...room, equipment: [...room.equipment] }));

function renderRooms() {
  roomGrid.innerHTML = rooms
    .map(
      (room) => `
        <article class="room-card">
          <div class="room-image" style="background-image:url('${room.image}')">
            <span class="status-pill ${room.status.toLowerCase().replace(/\s+/g, "-")}">${room.status}</span>
          </div>
          <div class="room-body">
            <div class="room-title-row">
              <div>
                <h2>${room.name}</h2>
                <p>${room.location}</p>
              </div>
              <strong><small>Capacity</small>${room.capacity}<span>Students</span></strong>
            </div>
            <div class="equipment-row">
              ${room.equipment
                .map(
                  (item) => `
                    <span>
                      <svg viewBox="0 0 24 24"><path d="M4 6h16v10H4z" /><path d="M8 20h8" /><path d="M12 16v4" /></svg>
                      ${item}
                    </span>
                  `
                )
                .join("")}
            </div>
            <div class="card-actions">
              <button class="secondary-button" type="button" data-action="edit" data-id="${room.id}">Edit</button>
              <button class="icon-button danger-icon" type="button" data-action="delete" data-id="${room.id}" aria-label="Delete ${room.name}">
                <svg viewBox="0 0 24 24"><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /></svg>
              </button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function openRoomModal(roomId = "") {
  const room = rooms.find((item) => item.id === roomId);
  roomModalTitle.textContent = room ? "Edit Room" : "Add Room";
  roomEditId.value = room ? room.id : "";
  roomName.value = room ? room.name : "";
  roomCapacity.value = room ? room.capacity : "";
  roomLocation.value = room ? room.location : "";
  roomStatus.value = room ? room.status : "Available";
  roomEquipment.value = room ? room.equipment.join(", ") : "";
  deleteRoomButton.hidden = !room;
  roomModal.hidden = false;
  roomName.focus();
}

function closeModal() {
  roomModal.hidden = true;
  roomForm.reset();
}

function deleteRoom(roomId) {
  const index = rooms.findIndex((room) => room.id === roomId);
  if (index === -1) return;
  const [removed] = rooms.splice(index, 1);
  closeModal();
  renderRooms();
  showToast(`${removed.name} deleted from facilities.`);
}

roomGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  if (button.dataset.action === "delete") {
    deleteRoom(button.dataset.id);
    return;
  }
  openRoomModal(button.dataset.id);
});

addRoomButton.addEventListener("click", () => openRoomModal());
closeRoomModal.addEventListener("click", closeModal);
cancelRoomModal.addEventListener("click", closeModal);
roomModal.addEventListener("click", (event) => {
  if (event.target === roomModal) closeModal();
});
deleteRoomButton.addEventListener("click", () => {
  if (roomEditId.value) deleteRoom(roomEditId.value);
});

roomForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const existing = rooms.find((room) => room.id === roomEditId.value);
  const payload = {
    id: existing ? existing.id : roomName.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name: roomName.value.trim(),
    location: roomLocation.value.trim(),
    capacity: Number(roomCapacity.value),
    status: roomStatus.value,
    equipment: roomEquipment.value.split(",").map((item) => item.trim()).filter(Boolean),
    image: existing ? existing.image : "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
  };

  if (existing) {
    Object.assign(existing, payload);
    showToast(`${payload.name} updated.`);
  } else {
    rooms.unshift(payload);
    showToast(`${payload.name} added.`);
  }

  closeModal();
  renderRooms();
});

renderRooms();
