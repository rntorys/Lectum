const storageKey = "notas-academicas-v1";
const themeKey = "notas-theme";

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
  subjectAverage: document.getElementById("subjectAverage"),
  subjectNotes: document.getElementById("subjectNotes"),
  subjectWeight: document.getElementById("subjectWeight"),
  weightBox: document.getElementById("weightBox"),
  weightAlert: document.getElementById("weightAlert"),
  notesList: document.getElementById("notesList"),
  noteForm: document.getElementById("noteForm"),
  saveNote: document.getElementById("saveNote"),
  cancelEdit: document.getElementById("cancelEdit"),
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

function formatDate(dateValue) {
  return dateValue || "-";
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function loadSubjects() {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

function saveSubjects() {
  localStorage.setItem(storageKey, JSON.stringify(subjects));
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
  els.modalTeacher.textContent = subject.teacher || "Docente sin registrar";
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
  };

  subjects.push(newSubject);
  els.subjectForm.reset();
  els.subjectGroup.value = "";
  els.subjectColor.value = "#1f4c7a";
  updateGroupFilter();
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

initTheme();
updateGroupFilter();
renderSubjects();
calculateOverall();
toggleControlBox();
renderControlList();
