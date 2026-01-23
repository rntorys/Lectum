const storageKey = "notas-academicas-v1";
const themeKey = "notas-theme";
const linksKey = "lectum-links-v1";
const eventsKey = "lectum-events-v1";

const els = {
  appRoot: document.getElementById("appRoot"),
  themeToggle: document.getElementById("themeToggle"),
  themeLabel: document.getElementById("themeLabel"),
  overallAverage: document.getElementById("overallAverage"),
  overallFoot: document.getElementById("overallFoot"),
  overallSubjects: document.getElementById("overallSubjects"),
  overallSubjectsFoot: document.getElementById("overallSubjectsFoot"),
  overallNotes: document.getElementById("overallNotes"),
  overallNotesFoot: document.getElementById("overallNotesFoot"),
  overallLowest: document.getElementById("overallLowest"),
  overallLowestFoot: document.getElementById("overallLowestFoot"),
  pendingList: document.getElementById("pendingList"),
  eventForm: document.getElementById("eventForm"),
  eventName: document.getElementById("eventName"),
  eventSubject: document.getElementById("eventSubject"),
  eventDate: document.getElementById("eventDate"),
  eventsList: document.getElementById("eventsList"),
  nextEventName: document.getElementById("nextEventName"),
  nextEventMeta: document.getElementById("nextEventMeta"),
  subjectsGrid: document.getElementById("subjectsGrid"),
  subjectForm: document.getElementById("subjectForm"),
  subjectName: document.getElementById("subjectName"),
  subjectTeacher: document.getElementById("subjectTeacher"),
  subjectGroup: document.getElementById("subjectGroup"),
  subjectColor: document.getElementById("subjectColor"),
  subjectMode: document.getElementById("subjectMode"),
  groupFilter: document.getElementById("groupFilter"),
  modal: document.getElementById("subjectModal"),
  modalClose: document.getElementById("modalClose"),
  modalEyebrow: document.getElementById("modalEyebrow"),
  modalTitle: document.getElementById("modalTitle"),
  modalTeacher: document.getElementById("modalTeacher"),
  modalMode: document.getElementById("modalMode"),
  modalColor: document.getElementById("modalColor"),
  deleteSubject: document.getElementById("deleteSubject"),
  configOpen: document.getElementById("configOpen"),
  configModal: document.getElementById("configModal"),
  configClose: document.getElementById("configClose"),
  exportData: document.getElementById("exportData"),
  importFile: document.getElementById("importFile"),
  updatesOpen: document.getElementById("updatesOpen"),
  updatesModal: document.getElementById("updatesModal"),
  updatesClose: document.getElementById("updatesClose"),
  linkAdd: document.getElementById("linkAdd"),
  linksList: document.getElementById("linksList"),
  linkModal: document.getElementById("linkModal"),
  linkClose: document.getElementById("linkClose"),
  linkForm: document.getElementById("linkForm"),
  saveLink: document.getElementById("saveLink"),
  deleteLink: document.getElementById("deleteLink"),
  linkUrl: document.getElementById("linkUrl"),
  linkLabel: document.getElementById("linkLabel"),
  linkEmoji: document.getElementById("linkEmoji"),
  linkFile: document.getElementById("linkFile"),
  subjectAverage: document.getElementById("subjectAverage"),
  subjectNotes: document.getElementById("subjectNotes"),
  subjectWeight: document.getElementById("subjectWeight"),
  weightBox: document.getElementById("weightBox"),
  weightAlert: document.getElementById("weightAlert"),
  notesList: document.getElementById("notesList"),
  noteForm: document.getElementById("noteForm"),
  saveNote: document.getElementById("saveNote"),
  cancelEdit: document.getElementById("cancelEdit"),
  fileForm: document.getElementById("fileForm"),
  fileInput: document.getElementById("fileInput"),
  filesList: document.getElementById("filesList"),
  fileName: document.getElementById("fileName"),
  saveFile: document.getElementById("saveFile"),
  cancelFileEdit: document.getElementById("cancelFileEdit"),
  noteTitle: document.getElementById("noteTitle"),
  noteType: document.getElementById("noteType"),
  noteScore: document.getElementById("noteScore"),
  noteWeight: document.getElementById("noteWeight"),
  noteDate: document.getElementById("noteDate"),
  noteScheduled: document.getElementById("noteScheduled"),
  weightLabel: document.getElementById("weightLabel"),
  controlBox: document.getElementById("controlBox"),
  controlTitle: document.getElementById("controlTitle"),
  controlScore: document.getElementById("controlScore"),
  controlList: document.getElementById("controlList"),
  addControl: document.getElementById("addControl"),
};

let subjects = loadSubjects();
let activeSubjectId = null;
let controlItems = [];
let editingNoteId = null;
let editingControlId = null;
let links = loadLinks();
let linkImageData = "";
let editingLinkId = null;
let editingFileId = null;
let events = loadEvents();
let editingEventId = null;

function formatDate(dateValue) {
  if (!dateValue) return "-";
  const parts = dateValue.split("-");
  if (parts.length === 3) {
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return date.toLocaleDateString("es-PE");
  }
  return dateValue;
}

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function loadSubjects() {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

function loadLinks() {
  try {
    const raw = localStorage.getItem(linksKey);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

function loadEvents() {
  try {
    const raw = localStorage.getItem(eventsKey);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

function saveSubjects() {
  localStorage.setItem(storageKey, JSON.stringify(subjects));
}

function saveLinks() {
  localStorage.setItem(linksKey, JSON.stringify(links));
}

function saveEvents() {
  localStorage.setItem(eventsKey, JSON.stringify(events));
}

function setTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  els.themeLabel.textContent = theme === "dark" ? "Modo claro" : "Modo oscuro";
  localStorage.setItem(themeKey, theme);
}

function initTheme() {
  const stored = localStorage.getItem(themeKey);
  const theme = stored || "light";
  setTheme(theme);
}

function getActiveSubject() {
  return subjects.find((item) => item.id === activeSubjectId);
}

function createId() {
  return Math.random().toString(36).slice(2, 10);
}

function computeNoteScore(note) {
  if (note.type === "control") {
    if (!note.components || !note.components.length) return 0;
    const sum = note.components.reduce((acc, item) => acc + item.score, 0);
    return sum / note.components.length;
  }
  return note.score;
}

function calculateSubjectAverage(subject) {
  if (!subject.notes.length) return { average: 0, weightSum: 0 };
  const scores = subject.notes.map((note) => computeNoteScore(note));

  if (subject.mode === "percent") {
    const weightSum = subject.notes.reduce((acc, note) => acc + (note.weight || 0), 0);
    if (weightSum <= 0) {
      return { average: 0, weightSum };
    }
    const weighted = subject.notes.reduce((acc, note, index) => {
      return acc + scores[index] * ((note.weight || 0) / weightSum);
    }, 0);
    return { average: weighted, weightSum };
  }

  if (subject.mode === "geometric") {
    const valid = scores.filter((score) => score > 0);
    if (!valid.length) return { average: 0, weightSum: 0 };
    const product = valid.reduce((acc, val) => acc * val, 1);
    return { average: Math.pow(product, 1 / valid.length), weightSum: 0 };
  }

  const sum = scores.reduce((acc, val) => acc + val, 0);
  return { average: sum / scores.length, weightSum: 0 };
}

function calculateOverall() {
  const group = els.groupFilter.value;
  const scoped = group ? subjects.filter((subject) => subject.group === group) : subjects;
  const subjectAverages = scoped.map((subject) => calculateSubjectAverage(subject).average);
  const valid = subjectAverages.filter((val) => val > 0);
  const overall = valid.length ? valid.reduce((acc, val) => acc + val, 0) / valid.length : 0;
  const noteCount = scoped.reduce((acc, subject) => acc + subject.notes.length, 0);
  const lowest = valid.length ? Math.min(...valid) : 0;

  els.overallAverage.textContent = overall.toFixed(2);
  els.overallFoot.textContent = valid.length ? `${valid.length} materias con notas` : "Sin materias aun";
  els.overallSubjects.textContent = scoped.length;
  els.overallSubjectsFoot.textContent = `${scoped.length} materias`;
  els.overallNotes.textContent = noteCount;
  els.overallNotesFoot.textContent = `${noteCount} notas totales`;
  els.overallLowest.textContent = lowest.toFixed(2);
  els.overallLowestFoot.textContent = valid.length ? "Peor promedio del grupo" : "Sin materias aun";
  renderPendingTests(scoped);
}

function renderSubjects() {
  const group = els.groupFilter.value;
  const scoped = group ? subjects.filter((subject) => subject.group === group) : subjects;

  if (!scoped.length) {
    els.subjectsGrid.innerHTML = "<div class=\"empty\">No hay materias registradas aun.</div>";
    return;
  }

  els.subjectsGrid.innerHTML = "";
  scoped.forEach((subject) => {
    const card = document.createElement("article");
    const stats = calculateSubjectAverage(subject);
    card.className = "subject-card";
    card.style.setProperty("--subject-color", subject.color || "var(--accent)");
    card.innerHTML = `
      <span class="mode">${labelForMode(subject.mode)}</span>
      <h4>${subject.name}</h4>
      <span>${subject.teacher || "Docente sin registrar"}</span>
      <span>${subject.group || "Sin grupo"}</span>
      <strong>Promedio: ${stats.average.toFixed(2)}</strong>
      <span>${subject.notes.length} notas</span>
    `;
    card.addEventListener("click", () => openSubject(subject.id));
    els.subjectsGrid.appendChild(card);
  });
}

function labelForMode(mode) {
  if (mode === "percent") return "Porcentaje";
  if (mode === "geometric") return "Geometrica";
  return "Promedio";
}

function openSubject(subjectId) {
  activeSubjectId = subjectId;
  const subject = getActiveSubject();
  if (!subject) return;

  els.modalTitle.textContent = subject.name;
  els.modalTeacher.value = subject.teacher || "";
  els.modalMode.value = subject.mode;
  els.modalColor.value = subject.color || "#1f4c7a";
  els.modal.style.setProperty("--subject-color", subject.color || "var(--accent)");

  renderSubjectDetails(subject);
  els.modal.classList.add("is-open");
  els.modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  els.modal.classList.remove("is-open");
  els.modal.setAttribute("aria-hidden", "true");
  activeSubjectId = null;
  resetNoteForm();
}

function openConfig() {
  els.configModal.classList.add("is-open");
  els.configModal.setAttribute("aria-hidden", "false");
}

function closeConfig() {
  els.configModal.classList.remove("is-open");
  els.configModal.setAttribute("aria-hidden", "true");
}

function openUpdates() {
  els.updatesModal.classList.add("is-open");
  els.updatesModal.setAttribute("aria-hidden", "false");
}

function closeUpdates() {
  els.updatesModal.classList.remove("is-open");
  els.updatesModal.setAttribute("aria-hidden", "true");
}

function openLinkModal() {
  els.linkModal.classList.add("is-open");
  els.linkModal.setAttribute("aria-hidden", "false");
  updateLinkIconFields();
}

function closeLinkModal() {
  els.linkModal.classList.remove("is-open");
  els.linkModal.setAttribute("aria-hidden", "true");
  els.linkForm.reset();
  linkImageData = "";
  editingLinkId = null;
  els.deleteLink.classList.add("is-hidden");
}

function renderSubjectDetails(subject) {
  const stats = calculateSubjectAverage(subject);
  els.subjectAverage.textContent = stats.average.toFixed(2);
  els.subjectNotes.textContent = subject.notes.length;
  els.subjectWeight.textContent = `${stats.weightSum.toFixed(1)}%`;
  els.weightBox.style.display = subject.mode === "percent" ? "block" : "none";
  els.weightLabel.style.display = subject.mode === "percent" ? "grid" : "none";

  if (subject.mode === "percent") {
    if (stats.weightSum > 100) {
      els.weightAlert.textContent = `Te pasaste del 100% (${stats.weightSum.toFixed(1)}%).`;
      els.weightAlert.className = "alert alert-danger";
    } else if (stats.weightSum < 100) {
      els.weightAlert.textContent = `Te falta completar el 100% (${stats.weightSum.toFixed(1)}%).`;
      els.weightAlert.className = "alert alert-warn";
    } else {
      els.weightAlert.textContent = "Perfecto: el porcentaje acumula 100%.";
      els.weightAlert.className = "alert alert-ok";
    }
  } else {
    els.weightAlert.textContent = "";
    els.weightAlert.className = "alert is-hidden";
  }

  renderNotes(subject);
  renderFiles(subject);
}

function renderNotes(subject) {
  if (!subject.notes.length) {
    els.notesList.innerHTML = "<div class=\"empty\">Aun no hay notas en esta materia.</div>";
    return;
  }

  els.notesList.innerHTML = "";
  subject.notes.forEach((note) => {
    const score = computeNoteScore(note);
    const card = document.createElement("article");
    card.className = "note-card";
    const weightInfo = subject.mode === "percent" ? `Peso: ${note.weight || 0}%` : "";
    const compInfo = note.type === "control" ? `Componentes: ${note.components.length}` : "Nota directa";
    const dateInfo = note.date ? `Fecha: ${formatDate(note.date)}` : "Sin fecha";
    const scheduleInfo = note.scheduled ? "Programada" : "Sin programar";

    card.innerHTML = `
      <div class="note-head">
        <strong>${note.title}</strong>
        <div class="note-actions">
          <span class="note-type">${note.type === "control" ? "Control" : "Solida"}</span>
          <button class="ghost" type="button" data-edit="${note.id}">Editar</button>
          <button class="ghost danger" type="button" data-delete="${note.id}">Eliminar</button>
        </div>
      </div>
      <div class="note-metrics">${compInfo}</div>
      <div class="note-metrics">Nota: ${score.toFixed(2)} ${weightInfo}</div>
      <div class="note-metrics">${dateInfo} · ${scheduleInfo}</div>
    `;
    els.notesList.appendChild(card);
  });

  els.notesList.querySelectorAll("[data-edit]").forEach((button) => {
    button.addEventListener("click", () => startEditNote(button.dataset.edit));
  });
  els.notesList.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteNote(button.dataset.delete));
  });
}

function renderControlList() {
  if (!controlItems.length) {
    els.controlList.innerHTML = "<div class=\"empty\">Agrega componentes para la nota control.</div>";
    return;
  }

  els.controlList.innerHTML = "";
  controlItems.forEach((item) => {
    const row = document.createElement("div");
    row.className = "control-item";
    row.innerHTML = `
      <span>${item.title}</span>
      <div class="control-actions">
        <strong>${item.score.toFixed(2)}</strong>
        <button class="ghost" type="button" data-control-edit="${item.id}">Editar</button>
        <button class="ghost danger" type="button" data-control-delete="${item.id}">Eliminar</button>
      </div>
    `;
    els.controlList.appendChild(row);
  });

  els.controlList.querySelectorAll("[data-control-edit]").forEach((button) => {
    button.addEventListener("click", () => startEditControl(button.dataset.controlEdit));
  });
  els.controlList.querySelectorAll("[data-control-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteControlItem(button.dataset.controlDelete));
  });
}

function resetNoteForm() {
  els.noteForm.reset();
  els.noteScore.value = "";
  els.noteWeight.value = 0;
  els.noteDate.value = "";
  els.noteScheduled.checked = false;
  editingNoteId = null;
  els.saveNote.textContent = "Agregar nota";
  els.cancelEdit.classList.add("is-hidden");
  els.controlTitle.value = "";
  els.controlScore.value = "";
  editingControlId = null;
  els.addControl.textContent = "Agregar componente";
  controlItems = [];
  renderControlList();
  toggleControlBox();
}

function toggleControlBox() {
  const type = els.noteType.value;
  if (type === "control") {
    els.controlBox.classList.add("is-visible");
    els.noteScore.value = "";
    els.noteScore.disabled = true;
  } else {
    els.controlBox.classList.remove("is-visible");
    els.noteScore.disabled = false;
  }
}

function handleSubjectSubmit(event) {
  event.preventDefault();
  const newSubject = {
    id: createId(),
    name: els.subjectName.value.trim(),
    teacher: els.subjectTeacher.value.trim(),
    group: els.subjectGroup.value.trim(),
    color: els.subjectColor.value,
    mode: els.subjectMode.value,
    notes: [],
    files: [],
  };

  subjects.push(newSubject);
  els.subjectForm.reset();
  els.subjectGroup.value = "";
  els.subjectColor.value = "#1f4c7a";
  updateGroupFilter();
  updateEventSubjects();
  saveSubjects();
  renderSubjects();
  calculateOverall();
}

function handleNoteSubmit(event) {
  event.preventDefault();
  const subject = getActiveSubject();
  if (!subject) return;

  const type = els.noteType.value;
  const newNote = {
    id: editingNoteId || createId(),
    title: els.noteTitle.value.trim(),
    type,
    score: type === "solid" ? Number(els.noteScore.value) : 0,
    weight: subject.mode === "percent" ? Number(els.noteWeight.value) : 0,
    components: type === "control" ? controlItems.map((item) => ({ ...item })) : [],
    date: els.noteDate.value,
    scheduled: els.noteScheduled.checked,
  };

  if (type === "control" && !newNote.components.length) {
    alert("Agrega al menos un componente para la nota control.");
    return;
  }

  if (editingNoteId) {
    const index = subject.notes.findIndex((note) => note.id === editingNoteId);
    if (index !== -1) {
      subject.notes[index] = newNote;
    }
  } else {
    subject.notes.unshift(newNote);
  }
  saveSubjects();
  renderSubjectDetails(subject);
  calculateOverall();
  resetNoteForm();
}

function handleAddControl() {
  const title = els.controlTitle.value.trim();
  const score = Number(els.controlScore.value);
  if (!title || Number.isNaN(score)) return;

  if (editingControlId) {
    const index = controlItems.findIndex((item) => item.id === editingControlId);
    if (index !== -1) {
      controlItems[index] = { id: editingControlId, title, score };
    }
    editingControlId = null;
    els.addControl.textContent = "Agregar componente";
  } else {
    controlItems.push({ id: createId(), title, score });
  }
  els.controlTitle.value = "";
  els.controlScore.value = "";
  renderControlList();
}

function startEditNote(noteId) {
  const subject = getActiveSubject();
  if (!subject) return;
  const note = subject.notes.find((item) => item.id === noteId);
  if (!note) return;

  editingNoteId = noteId;
  els.noteTitle.value = note.title;
  els.noteType.value = note.type;
  els.noteScore.value = note.type === "solid" ? note.score : "";
  els.noteWeight.value = subject.mode === "percent" ? note.weight || 0 : 0;
  els.noteDate.value = note.date || "";
  els.noteScheduled.checked = Boolean(note.scheduled);
  controlItems = note.type === "control" ? note.components.map((item) => ({ ...item })) : [];
  renderControlList();
  toggleControlBox();
  els.saveNote.textContent = "Guardar cambios";
  els.cancelEdit.classList.remove("is-hidden");
}

function startEditControl(controlId) {
  const item = controlItems.find((entry) => entry.id === controlId);
  if (!item) return;
  editingControlId = controlId;
  els.controlTitle.value = item.title;
  els.controlScore.value = item.score;
  els.addControl.textContent = "Guardar componente";
}

function deleteControlItem(controlId) {
  controlItems = controlItems.filter((item) => item.id !== controlId);
  if (editingControlId === controlId) {
    editingControlId = null;
    els.controlTitle.value = "";
    els.controlScore.value = "";
    els.addControl.textContent = "Agregar componente";
  }
  renderControlList();
}

function renderPendingTests(scopedSubjects) {
  const today = getToday();
  const pending = scopedSubjects.flatMap((subject) =>
    subject.notes
      .filter((note) => note.scheduled && (!note.date || note.date >= today))
      .map((note) => ({ ...note, subjectName: subject.name, subjectColor: subject.color }))
  );

  if (!pending.length) {
    els.pendingList.innerHTML = "<div class=\"empty\">No hay pruebas pendientes.</div>";
    return;
  }

  const sorted = pending.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  els.pendingList.innerHTML = "";
  sorted.forEach((note) => {
    const item = document.createElement("article");
    item.className = "pending-card";
    item.style.setProperty("--subject-color", note.subjectColor || "var(--accent)");
    item.innerHTML = `
      <div class="pending-head">
        <strong>${note.title}</strong>
        <span class="pending-date">${formatDate(note.date)}</span>
      </div>
      <div class="pending-meta">${note.subjectName}</div>
    `;
    els.pendingList.appendChild(item);
  });
}

function renderEvents() {
  if (!events.length) {
    els.eventsList.innerHTML = "<div class=\"empty\">No hay eventos registrados.</div>";
    els.nextEventName.textContent = "Sin eventos";
    els.nextEventMeta.textContent = "Agrega un evento";
    return;
  }

  const sorted = [...events].sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  els.eventsList.innerHTML = "";
  sorted.forEach((event) => {
    const item = document.createElement("div");
    item.className = "event-item";
    item.innerHTML = `
      <div>
        <strong>${event.name}</strong>
        <div class="event-meta">${event.subject}</div>
      </div>
      <div class="event-actions">
        <span class="event-meta">${formatDate(event.date)}</span>
        <button class="icon-button" type="button" data-event-edit="${event.id}" aria-label="Editar evento">✎</button>
        <button class="icon-button danger" type="button" data-event-delete="${event.id}" aria-label="Eliminar evento">-</button>
      </div>
    `;
    els.eventsList.appendChild(item);
  });

  els.eventsList.querySelectorAll("[data-event-edit]").forEach((button) => {
    button.addEventListener("click", () => startEditEvent(button.dataset.eventEdit));
  });
  els.eventsList.querySelectorAll("[data-event-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteEvent(button.dataset.eventDelete));
  });

  const today = getToday();
  const next = sorted.find((event) => event.date && event.date >= today) || sorted[0];
  els.nextEventName.textContent = next ? next.name : "Sin eventos";
  els.nextEventMeta.textContent = next ? `${next.subject} · ${formatDate(next.date)}` : "Agrega un evento";
}

function updateEventSubjects() {
  const current = els.eventSubject.value;
  els.eventSubject.innerHTML = "";
  const base = document.createElement("option");
  base.value = "Extra";
  base.textContent = "Extra";
  els.eventSubject.appendChild(base);

  subjects.forEach((subject) => {
    const option = document.createElement("option");
    option.value = subject.name;
    option.textContent = subject.name;
    if (subject.name === current) option.selected = true;
    els.eventSubject.appendChild(option);
  });
}

function handleEventSubmit(event) {
  event.preventDefault();
  const name = els.eventName.value.trim();
  const subject = els.eventSubject.value || "Extra";
  const date = els.eventDate.value;
  if (!name || !date) return;

  if (editingEventId) {
    const index = events.findIndex((item) => item.id === editingEventId);
    if (index !== -1) {
      events[index] = { id: editingEventId, name, subject, date };
    }
    editingEventId = null;
  } else {
    events.unshift({ id: createId(), name, subject, date });
  }
  saveEvents();
  renderEvents();
  els.eventForm.reset();
  updateEventSubjects();
}

function startEditEvent(eventId) {
  const item = events.find((event) => event.id === eventId);
  if (!item) return;
  editingEventId = eventId;
  els.eventName.value = item.name;
  els.eventSubject.value = item.subject;
  els.eventDate.value = item.date;
}

function deleteEvent(eventId) {
  if (!confirm("Eliminar este evento?")) return;
  events = events.filter((item) => item.id !== eventId);
  saveEvents();
  renderEvents();
  if (editingEventId === eventId) {
    editingEventId = null;
    els.eventForm.reset();
    updateEventSubjects();
  }
}

function renderFiles(subject) {
  if (!subject.files || !subject.files.length) {
    els.filesList.innerHTML = "<div class=\"empty\">No hay archivos subidos.</div>";
    return;
  }

  els.filesList.innerHTML = "";
  subject.files.forEach((file) => {
    const row = document.createElement("div");
    row.className = "file-item";
    const displayName = file.displayName || file.name;
    row.innerHTML = `
      <div class="file-icon">${iconForFile(file.name)}</div>
      <div class="file-meta">
        <h4>${displayName}</h4>
        <p>Subido: ${formatDate(file.uploadedAt)}</p>
      </div>
      <div class="file-actions">
        <a class="ghost" href="${file.data}" download="${file.name}">Descargar</a>
        <button class="ghost" type="button" data-file-edit="${file.id}">Editar</button>
        <button class="ghost danger" type="button" data-file-delete="${file.id}">Eliminar</button>
      </div>
    `;
    els.filesList.appendChild(row);
  });

  els.filesList.querySelectorAll("[data-file-edit]").forEach((button) => {
    button.addEventListener("click", () => startEditFile(button.dataset.fileEdit));
  });
  els.filesList.querySelectorAll("[data-file-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteFile(button.dataset.fileDelete));
  });
}

function iconForFile(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  if (["pdf"].includes(ext)) return "📄";
  if (["doc", "docx"].includes(ext)) return "📝";
  if (["xls", "xlsx", "csv"].includes(ext)) return "📊";
  if (["ppt", "pptx"].includes(ext)) return "📽️";
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "🖼️";
  if (["zip", "rar", "7z"].includes(ext)) return "🗜️";
  return "📁";
}

function handleFileSubmit(event) {
  event.preventDefault();
  const subject = getActiveSubject();
  if (!subject) return;
  const file = els.fileInput.files[0];
  const displayName = els.fileName.value.trim();
  if (!displayName) return;

  if (editingFileId) {
    const index = subject.files.findIndex((item) => item.id === editingFileId);
    if (index === -1) return;
    const existing = subject.files[index];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        subject.files[index] = {
          ...existing,
          name: file.name,
          type: file.type,
          data: reader.result,
          displayName,
          uploadedAt: new Date().toISOString(),
        };
        saveSubjects();
        renderFiles(subject);
        resetFileForm();
      };
      reader.readAsDataURL(file);
    } else {
      subject.files[index] = {
        ...existing,
        displayName,
      };
      saveSubjects();
      renderFiles(subject);
      resetFileForm();
    }
    return;
  }

  if (!file) {
    alert("Selecciona un archivo para subir.");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const entry = {
      id: createId(),
      name: file.name,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      data: reader.result,
      displayName,
    };
    subject.files = subject.files || [];
    subject.files.unshift(entry);
    saveSubjects();
    renderFiles(subject);
    resetFileForm();
  };
  reader.readAsDataURL(file);
}

function startEditFile(fileId) {
  const subject = getActiveSubject();
  if (!subject) return;
  const file = subject.files.find((item) => item.id === fileId);
  if (!file) return;
  editingFileId = fileId;
  els.fileName.value = file.displayName || file.name;
  els.saveFile.textContent = "Guardar cambios";
  els.cancelFileEdit.classList.remove("is-hidden");
}

function deleteFile(fileId) {
  const subject = getActiveSubject();
  if (!subject) return;
  if (!confirm("Eliminar este archivo?")) return;
  subject.files = subject.files.filter((item) => item.id !== fileId);
  saveSubjects();
  renderFiles(subject);
  if (editingFileId === fileId) {
    resetFileForm();
  }
}

function resetFileForm() {
  els.fileForm.reset();
  editingFileId = null;
  els.saveFile.textContent = "Subir archivo";
  els.cancelFileEdit.classList.add("is-hidden");
}

function renderLinks() {
  if (!links.length) {
    els.linksList.innerHTML = "<span class=\"muted small\">Sin links guardados.</span>";
    return;
  }

  els.linksList.innerHTML = "";
  links.forEach((link) => {
    const item = document.createElement("div");
    item.className = "link-item";

    const anchor = document.createElement("a");
    anchor.className = "link-anchor";
    anchor.href = link.url;
    anchor.target = "_blank";
    anchor.rel = "noopener";
    anchor.title = link.label || link.url;

    const icon = document.createElement("span");
    icon.className = "link-icon";
    if (link.iconType === "emoji") {
      icon.textContent = link.iconValue || "";
    } else {
      const img = document.createElement("img");
      img.src = link.iconValue;
      img.alt = "";
      icon.appendChild(img);
    }

    anchor.appendChild(icon);
    if (link.label) {
      const label = document.createElement("span");
      label.textContent = link.label;
      anchor.appendChild(label);
    }

    const actions = document.createElement("div");
    actions.className = "link-actions";
    actions.innerHTML = `
      <button class="icon-button" type="button" data-link-edit="${link.id}" aria-label="Editar link">✎</button>
    `;

    item.appendChild(anchor);
    item.appendChild(actions);
    els.linksList.appendChild(item);
  });

  els.linksList.querySelectorAll("[data-link-edit]").forEach((button) => {
    button.addEventListener("click", () => startEditLink(button.dataset.linkEdit));
  });
}

function getSelectedIconType() {
  const selected = document.querySelector("input[name=\"linkIconType\"]:checked");
  return selected ? selected.value : "favicon";
}

function updateLinkIconFields() {
  const type = getSelectedIconType();
  document.getElementById("emojiRow").style.display = type === "emoji" ? "grid" : "none";
  document.getElementById("fileRow").style.display = type === "image" ? "grid" : "none";
}

function handleLinkSubmit(event) {
  event.preventDefault();
  const url = els.linkUrl.value.trim();
  if (!url) return;

  const iconType = getSelectedIconType();
  let iconValue = "";
  if (iconType === "favicon") {
    iconValue = `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(url)}`;
  } else if (iconType === "emoji") {
    iconValue = els.linkEmoji.value.trim();
    if (!iconValue) {
      alert("Escribe un emoji para el link.");
      return;
    }
  } else {
    if (!linkImageData) {
      alert("Selecciona una imagen para el link.");
      return;
    }
    iconValue = linkImageData;
  }

  const payload = {
    id: editingLinkId || createId(),
    url,
    label: els.linkLabel.value.trim(),
    iconType,
    iconValue,
  };

  if (editingLinkId) {
    const index = links.findIndex((link) => link.id === editingLinkId);
    if (index !== -1) links[index] = payload;
  } else {
    links.unshift(payload);
  }

  saveLinks();
  renderLinks();
  closeLinkModal();
}

function handleLinkFileChange(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    linkImageData = reader.result;
  };
  reader.readAsDataURL(file);
}

function startEditLink(linkId) {
  const link = links.find((item) => item.id === linkId);
  if (!link) return;
  editingLinkId = linkId;
  els.linkUrl.value = link.url;
  els.linkLabel.value = link.label || "";
  if (link.iconType === "emoji") {
    document.querySelector("input[name=\"linkIconType\"][value=\"emoji\"]").checked = true;
    els.linkEmoji.value = link.iconValue || "";
  } else if (link.iconType === "image") {
    document.querySelector("input[name=\"linkIconType\"][value=\"image\"]").checked = true;
    linkImageData = link.iconValue || "";
  } else {
    document.querySelector("input[name=\"linkIconType\"][value=\"favicon\"]").checked = true;
  }
  updateLinkIconFields();
  els.deleteLink.classList.remove("is-hidden");
  openLinkModal();
}

function deleteLink() {
  if (!editingLinkId) return;
  if (!confirm("Eliminar este link?")) return;
  links = links.filter((item) => item.id !== editingLinkId);
  saveLinks();
  renderLinks();
  closeLinkModal();
}

function handleModeChange() {
  const subject = getActiveSubject();
  if (!subject) return;
  subject.mode = els.modalMode.value;
  saveSubjects();
  renderSubjectDetails(subject);
  renderSubjects();
  calculateOverall();
}

function handleColorChange() {
  const subject = getActiveSubject();
  if (!subject) return;
  subject.color = els.modalColor.value;
  els.modal.style.setProperty("--subject-color", subject.color);
  saveSubjects();
  renderSubjects();
}

function handleTeacherChange() {
  const subject = getActiveSubject();
  if (!subject) return;
  subject.teacher = els.modalTeacher.value.trim();
  saveSubjects();
  renderSubjects();
}

function updateGroupFilter() {
  const current = els.groupFilter.value;
  const groups = Array.from(new Set(subjects.map((subject) => subject.group).filter(Boolean))).sort();
  els.groupFilter.innerHTML = "<option value=\"\">Todos</option>";
  groups.forEach((group) => {
    const option = document.createElement("option");
    option.value = group;
    option.textContent = group;
    if (group === current) option.selected = true;
    els.groupFilter.appendChild(option);
  });
}

function deleteNote(noteId) {
  const subject = getActiveSubject();
  if (!subject) return;
  if (!confirm("Eliminar esta nota?")) return;
  subject.notes = subject.notes.filter((note) => note.id !== noteId);
  saveSubjects();
  renderSubjectDetails(subject);
  calculateOverall();
}

function deleteSubject() {
  const subject = getActiveSubject();
  if (!subject) return;
  if (!confirm("Eliminar la materia y todas sus notas?")) return;
  subjects = subjects.filter((item) => item.id !== subject.id);
  saveSubjects();
  closeModal();
  updateGroupFilter();
  updateEventSubjects();
  renderSubjects();
  calculateOverall();
}

function handleThemeToggle() {
  const current = document.body.getAttribute("data-theme") || "light";
  const next = current === "dark" ? "light" : "dark";
  setTheme(next);
}

function handleExport() {
  const payload = JSON.stringify(subjects, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "lectum-data.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function handleImport(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (!Array.isArray(parsed)) {
        throw new Error("Formato invalido");
      }
      subjects = parsed;
      saveSubjects();
      closeModal();
      updateGroupFilter();
      updateEventSubjects();
      renderSubjects();
      calculateOverall();
      closeConfig();
    } catch (err) {
      alert("El archivo JSON no es valido.");
    } finally {
      els.importFile.value = "";
    }
  };
  reader.readAsText(file);
}

els.subjectForm.addEventListener("submit", handleSubjectSubmit);
els.noteForm.addEventListener("submit", handleNoteSubmit);
els.addControl.addEventListener("click", handleAddControl);
els.noteType.addEventListener("change", toggleControlBox);
els.cancelEdit.addEventListener("click", resetNoteForm);
els.modalClose.addEventListener("click", closeModal);
els.modal.addEventListener("click", (event) => {
  if (event.target === els.modal) closeModal();
});
els.modalMode.addEventListener("change", handleModeChange);
els.modalColor.addEventListener("change", handleColorChange);
els.modalTeacher.addEventListener("input", handleTeacherChange);
els.deleteSubject.addEventListener("click", deleteSubject);
els.groupFilter.addEventListener("change", () => {
  renderSubjects();
  calculateOverall();
});
els.themeToggle.addEventListener("click", handleThemeToggle);
els.configOpen.addEventListener("click", openConfig);
els.configClose.addEventListener("click", closeConfig);
els.configModal.addEventListener("click", (event) => {
  if (event.target === els.configModal) closeConfig();
});
els.exportData.addEventListener("click", handleExport);
els.importFile.addEventListener("change", handleImport);
els.updatesOpen.addEventListener("click", openUpdates);
els.updatesClose.addEventListener("click", closeUpdates);
els.updatesModal.addEventListener("click", (event) => {
  if (event.target === els.updatesModal) closeUpdates();
});
els.linkAdd.addEventListener("click", openLinkModal);
els.linkClose.addEventListener("click", closeLinkModal);
els.linkModal.addEventListener("click", (event) => {
  if (event.target === els.linkModal) closeLinkModal();
});
document.querySelectorAll("input[name=\"linkIconType\"]").forEach((input) => {
  input.addEventListener("change", updateLinkIconFields);
});
els.linkForm.addEventListener("submit", handleLinkSubmit);
els.linkFile.addEventListener("change", handleLinkFileChange);
els.deleteLink.addEventListener("click", deleteLink);
els.fileForm.addEventListener("submit", handleFileSubmit);
els.cancelFileEdit.addEventListener("click", resetFileForm);
els.eventForm.addEventListener("submit", handleEventSubmit);

initTheme();
updateGroupFilter();
updateEventSubjects();
renderSubjects();
calculateOverall();
toggleControlBox();
renderControlList();
renderLinks();
renderEvents();
