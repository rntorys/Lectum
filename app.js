const storageKey = "notas-academicas-v1";
const themeKey = "notas-theme";
const linksKey = "lectum-links-v1";
const eventsKey = "lectum-events-v1";
const logoKey = "lectum-logo-v1";
const settingsKey = "lectum-settings-v1";
const selectedGroupKey = "lectum-selected-group-v1";
const filesDatabaseName = "lectum-files-v1";
const filesStoreName = "files";
const defaultLogoSrc = "img/newlogolec.png";
const defaultFailColor = "#fff1f2";
const defaultPassColor = "#f0fdf4";
const defaultSubjectColor = "#1f4c7a";
const pinkSubjectColor = "#c8668a";

const els = {
  appRoot: document.getElementById("appRoot"),
  brandLogo: document.getElementById("brandLogo"),
  themeToggle: document.getElementById("themeToggle"),
  themeLabel: document.getElementById("themeLabel"),
  themeMenu: document.getElementById("themeMenu"),
  overallAverage: document.getElementById("overallAverage"),
  overallFoot: document.getElementById("overallFoot"),
  overallSubjects: document.getElementById("overallSubjects"),
  overallSubjectsFoot: document.getElementById("overallSubjectsFoot"),
  overallNotes: document.getElementById("overallNotes"),
  overallNotesFoot: document.getElementById("overallNotesFoot"),
  overallLowest: document.getElementById("overallLowest"),
  overallLowestFoot: document.getElementById("overallLowestFoot"),
  eventForm: document.getElementById("eventForm"),
  eventName: document.getElementById("eventName"),
  eventSubject: document.getElementById("eventSubject"),
  eventDate: document.getElementById("eventDate"),
  eventTime: document.getElementById("eventTime"),
  eventTopic: document.getElementById("eventTopic"),
  saveEvent: document.getElementById("saveEvent"),
  prevMonth: document.getElementById("prevMonth"),
  nextMonth: document.getElementById("nextMonth"),
  calendarTitle: document.getElementById("calendarTitle"),
  calendarGrid: document.getElementById("calendarGrid"),
  calendar: document.querySelector(".calendar"),
  eventsSidePanel: document.getElementById("eventsSidePanel"),
  eventsList: document.getElementById("eventsList"),
  eventsListTitle: document.getElementById("eventsListTitle"),
  eventsListDescription: document.getElementById("eventsListDescription"),
  eventsHistoryBack: document.getElementById("eventsHistoryBack"),
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
  modalSubjectName: document.getElementById("modalSubjectName"),
  modalTeacher: document.getElementById("modalTeacher"),
  modalSubjectGroup: document.getElementById("modalSubjectGroup"),
  modalMode: document.getElementById("modalMode"),
  modalColor: document.getElementById("modalColor"),
  deleteSubject: document.getElementById("deleteSubject"),
  configOpen: document.getElementById("configOpen"),
  configModal: document.getElementById("configModal"),
  configClose: document.getElementById("configClose"),
  logoPreview: document.getElementById("logoPreview"),
  logoFile: document.getElementById("logoFile"),
  resetLogo: document.getElementById("resetLogo"),
  groupNamesList: document.getElementById("groupNamesList"),
  multiplierList: document.getElementById("multiplierList"),
  weightedAverages: document.getElementById("weightedAverages"),
  creditsList: document.getElementById("creditsList"),
  creditsStatus: document.getElementById("creditsStatus"),
  passingEnabled: document.getElementById("passingEnabled"),
  passingScore: document.getElementById("passingScore"),
  failColor: document.getElementById("failColor"),
  passColor: document.getElementById("passColor"),
  colorDashboard: document.getElementById("colorDashboard"),
  colorSubjects: document.getElementById("colorSubjects"),
  colorComponents: document.getElementById("colorComponents"),
  passingStatus: document.getElementById("passingStatus"),
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
  addNoteToggle: document.getElementById("addNoteToggle"),
  noteForm: document.getElementById("noteForm"),
  saveNote: document.getElementById("saveNote"),
  cancelEdit: document.getElementById("cancelEdit"),
  fileForm: document.getElementById("fileForm"),
  fileInput: document.getElementById("fileInput"),
  filePickerLabel: document.getElementById("filePickerLabel"),
  filesList: document.getElementById("filesList"),
  fileName: document.getElementById("fileName"),
  saveFile: document.getElementById("saveFile"),
  cancelFileEdit: document.getElementById("cancelFileEdit"),
  filePreviewModal: document.getElementById("filePreviewModal"),
  filePreviewClose: document.getElementById("filePreviewClose"),
  filePreviewTitle: document.getElementById("filePreviewTitle"),
  filePreviewBody: document.getElementById("filePreviewBody"),
  noteTitle: document.getElementById("noteTitle"),
  noteType: document.getElementById("noteType"),
  noteScore: document.getElementById("noteScore"),
  noteWeight: document.getElementById("noteWeight"),
  noteDate: document.getElementById("noteDate"),
  weightLabel: document.getElementById("weightLabel"),
};

let subjects = loadSubjects();
let activeSubjectId = null;
let editingNoteId = null;
let inlineEditingNoteId = null;
let addingComponentNoteId = null;
let inlineEditingComponent = null;
let links = loadLinks();
let linkImageData = "";
let editingLinkId = null;
let editingFileId = null;
let events = loadEvents();
let editingEventId = null;
let calendarDate = new Date();
let selectedEventDate = getToday();
let settings = loadSettings();
let filesMigrationPromise = Promise.resolve();

function formatDate(dateValue) {
  if (!dateValue) return "-";
  const base = dateValue.slice(0, 10);
  const parts = base.split("-");
  if (parts.length === 3) {
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    return `${day}/${month}/${year}`;
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

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getSubjectColor(subjectName) {
  const subject = subjects.find((item) => item.name === subjectName);
  return subject ? subject.color || "var(--accent)" : "var(--accent)";
}

function sortEvents(list) {
  return [...list].sort((a, b) => {
    const dateCompare = (a.date || "").localeCompare(b.date || "");
    if (dateCompare !== 0) return dateCompare;
    return (a.time || "").localeCompare(b.time || "");
  });
}

function normalizeCredits(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return 1;
  return Math.round(parsed);
}

function normalizeMultiplier(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return 1;
  return Number(parsed.toFixed(4));
}

function normalizeSubject(subject) {
  return {
    ...subject,
    credits: normalizeCredits(subject.credits),
    multiplierEnabled: Boolean(subject.multiplierEnabled),
    multiplierValue: normalizeMultiplier(subject.multiplierValue),
    notes: Array.isArray(subject.notes) ? subject.notes : [],
    files: Array.isArray(subject.files) ? subject.files : [],
  };
}

function normalizeSettings(value) {
  const passingScore = Number(value && value.passingScore);
  const failColor = value && value.failColor === "#c43b3b" ? defaultFailColor : value && value.failColor;
  const passColor = value && value.passColor === "#2f8f5b" ? defaultPassColor : value && value.passColor;
  const hasPassingTargets = value && (
    Object.prototype.hasOwnProperty.call(value, "colorDashboard") ||
    Object.prototype.hasOwnProperty.call(value, "colorSubjects") ||
    Object.prototype.hasOwnProperty.call(value, "colorComponents")
  );
  return {
    weightedAverages: Boolean(value && value.weightedAverages),
    passingEnabled: Boolean(value && value.passingEnabled),
    passingScore: Number.isFinite(passingScore) ? passingScore : 55,
    failColor: normalizeColor(failColor, defaultFailColor),
    passColor: normalizeColor(passColor, defaultPassColor),
    colorDashboard: hasPassingTargets ? Boolean(value.colorDashboard) : true,
    colorSubjects: hasPassingTargets ? Boolean(value.colorSubjects) : true,
    colorComponents: hasPassingTargets ? Boolean(value.colorComponents) : true,
  };
}

function normalizeColor(value, fallback) {
  return /^#[0-9a-f]{6}$/i.test(String(value || "")) ? value : fallback;
}

function colorForScore(score, target) {
  if (!settings.passingEnabled || !Number.isFinite(Number(score)) || Number(score) <= 0) return "";
  if (target && settings[target] === false) return "";
  return Number(score) >= settings.passingScore ? settings.passColor : settings.failColor;
}

function applyScoreColor(element, score, target) {
  const color = colorForScore(score, target);
  if (color) {
    element.style.color = color;
  } else {
    element.style.removeProperty("color");
  }
}

function loadSubjects() {
  try {
    const raw = localStorage.getItem(storageKey);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(normalizeSubject) : [];
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

function loadSettings() {
  try {
    const raw = localStorage.getItem(settingsKey);
    return normalizeSettings(raw ? JSON.parse(raw) : {});
  } catch (err) {
    return normalizeSettings({});
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

function saveSettings() {
  localStorage.setItem(settingsKey, JSON.stringify(settings));
}

function openFilesDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(filesDatabaseName, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(filesStoreName)) {
        request.result.createObjectStore(filesStoreName);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function setStoredFileData(fileId, data) {
  const database = await openFilesDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(filesStoreName, "readwrite");
    transaction.objectStore(filesStoreName).put(data, fileId);
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error);
    };
  });
}

async function getStoredFileData(file) {
  if (file.data) return file.data;
  const database = await openFilesDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(filesStoreName, "readonly");
    const request = transaction.objectStore(filesStoreName).get(file.id);
    request.onsuccess = () => resolve(request.result || "");
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
  });
}

async function deleteStoredFileData(fileId) {
  const database = await openFilesDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(filesStoreName, "readwrite");
    transaction.objectStore(filesStoreName).delete(fileId);
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error);
    };
  });
}

async function migrateFilesToIndexedDb() {
  const filesWithInlineData = subjects.flatMap((subject) => subject.files || []).filter((file) => file.data);
  if (!filesWithInlineData.length) return;
  try {
    await Promise.all(filesWithInlineData.map((file) => setStoredFileData(file.id, file.data)));
    filesWithInlineData.forEach((file) => delete file.data);
    saveSubjects();
  } catch (error) {
    console.error("No fue posible migrar los archivos a IndexedDB.", error);
  }
}

function setTheme(theme) {
  const validTheme = ["light", "dark", "pink"].includes(theme) ? theme : "light";
  const labels = { light: "Modo claro", dark: "Modo oscuro", pink: "Modo rosado" };
  const previousTheme = document.body.getAttribute("data-theme") || "light";
  const previousDefaultColor = previousTheme === "pink" ? pinkSubjectColor : defaultSubjectColor;
  const nextDefaultColor = validTheme === "pink" ? pinkSubjectColor : defaultSubjectColor;
  document.body.setAttribute("data-theme", validTheme);
  els.themeLabel.textContent = labels[validTheme];
  if (els.subjectColor.value.toLowerCase() === previousDefaultColor) {
    els.subjectColor.value = nextDefaultColor;
  }
  els.themeMenu.querySelectorAll("[data-theme-option]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.themeOption === validTheme);
  });
  localStorage.setItem(themeKey, validTheme);
}

function initTheme() {
  const stored = localStorage.getItem(themeKey);
  const theme = stored || "light";
  setTheme(theme);
}

function setLogo(src) {
  const logoSrc = src || defaultLogoSrc;
  els.brandLogo.src = logoSrc;
  els.logoPreview.src = logoSrc;
  if (src) {
    localStorage.setItem(logoKey, src);
  } else {
    localStorage.removeItem(logoKey);
  }
}

function initLogo() {
  setLogo(localStorage.getItem(logoKey));
}

function getActiveSubject() {
  return subjects.find((item) => item.id === activeSubjectId);
}

function createId() {
  return Math.random().toString(36).slice(2, 10);
}

function computeNoteScore(note) {
  if (note.type === "control") {
    const activeComponents = (note.components || []).filter((item) => !item.discarded);
    if (!activeComponents.length) return 0;
    const sum = activeComponents.reduce((acc, item) => acc + item.score, 0);
    return sum / activeComponents.length;
  }
  return note.score;
}

function calculateSubjectAverage(subject) {
  const activeNotes = subject.notes.filter((note) => !note.discarded);
  if (!activeNotes.length) return { average: 0, baseAverage: 0, weightSum: 0 };
  const scores = activeNotes.map((note) => computeNoteScore(note));
  let baseAverage = 0;
  let weightSum = 0;

  if (subject.mode === "percent") {
    weightSum = activeNotes.reduce((acc, note) => acc + (note.weight || 0), 0);
    if (weightSum <= 0) {
      return { average: 0, baseAverage: 0, weightSum };
    }
    baseAverage = activeNotes.reduce((acc, note, index) => {
      return acc + scores[index] * ((note.weight || 0) / weightSum);
    }, 0);
  } else if (subject.mode === "geometric") {
    const valid = scores.filter((score) => score > 0);
    if (!valid.length) return { average: 0, baseAverage: 0, weightSum: 0 };
    const product = valid.reduce((acc, val) => acc * val, 1);
    baseAverage = Math.pow(product, 1 / valid.length);
  } else {
    const sum = scores.reduce((acc, val) => acc + val, 0);
    baseAverage = sum / scores.length;
  }

  const multiplier = subject.multiplierEnabled ? normalizeMultiplier(subject.multiplierValue) : 1;
  return { average: baseAverage * multiplier, baseAverage, weightSum };
}

function getLastGroupSubjects() {
  if (!subjects.length) return [];
  const lastSubjectWithGroup = [...subjects].reverse().find((subject) => subject.group);
  if (!lastSubjectWithGroup) return subjects.filter((subject) => !subject.group);
  return subjects.filter((subject) => subject.group === lastSubjectWithGroup.group);
}

function getHighestCreditSubject(list) {
  if (!list.length) return null;
  return list.reduce((highest, subject) => {
    if (!highest) return subject;
    return normalizeCredits(subject.credits) > normalizeCredits(highest.credits) ? subject : highest;
  }, null);
}

function calculateOverall() {
  const group = els.groupFilter.value;
  const scoped = group ? subjects.filter((subject) => subject.group === group) : subjects;
  const validSubjects = scoped
    .map((subject) => ({
      subject,
      average: calculateSubjectAverage(subject).average,
    }))
    .filter((item) => item.average > 0);
  const valid = validSubjects.map((item) => item.average);
  const totalCredits = validSubjects.reduce((acc, item) => acc + normalizeCredits(item.subject.credits), 0);
  const weightedOverall = totalCredits
    ? validSubjects.reduce((acc, item) => acc + item.average * normalizeCredits(item.subject.credits), 0) / totalCredits
    : 0;
  const simpleOverall = valid.length ? valid.reduce((acc, val) => acc + val, 0) / valid.length : 0;
  const overall = settings.weightedAverages ? weightedOverall : simpleOverall;
  const lowest = valid.length ? Math.min(...valid) : 0;
  const creditScope = group ? scoped : getLastGroupSubjects();
  const highestCreditSubject = getHighestCreditSubject(creditScope);

  els.overallAverage.textContent = overall.toFixed(2);
  applyScoreColor(els.overallAverage, overall, "colorDashboard");
  els.overallFoot.textContent = valid.length
    ? `${valid.length} materias con notas${settings.weightedAverages ? ` · ${totalCredits} creditos` : ""}`
    : "Sin materias aun";
  els.overallSubjects.textContent = scoped.length;
  els.overallSubjectsFoot.textContent = `${scoped.length} materias`;
  els.overallNotes.textContent = highestCreditSubject ? normalizeCredits(highestCreditSubject.credits) : "0";
  els.overallNotesFoot.textContent = highestCreditSubject
    ? `${highestCreditSubject.name} · ${highestCreditSubject.group || "Sin grupo"}`
    : "Sin materias aun";
  els.overallLowest.textContent = lowest.toFixed(2);
  applyScoreColor(els.overallLowest, lowest, "colorDashboard");
  els.overallLowestFoot.textContent = valid.length ? "Peor promedio del grupo" : "Sin materias aun";
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
    const averageColor = colorForScore(stats.average, "colorSubjects");
    const activeNotesCount = subject.notes.filter((note) => !note.discarded).length;
    const discardedNotesCount = subject.notes.filter((note) => note.discarded).length;
    card.className = "subject-card";
    card.style.setProperty("--subject-color", subject.color || "var(--accent)");
    card.innerHTML = `
      <span class="mode">${labelForMode(subject.mode)}</span>
      <h4>${subject.name}</h4>
      <span>${subject.teacher || "Docente sin registrar"}</span>
      <span>${subject.group || "Sin grupo"}</span>
      ${settings.weightedAverages ? `<span>Creditos: ${normalizeCredits(subject.credits)}</span>` : ""}
      ${subject.multiplierEnabled ? `<span>Multiplicador: x${normalizeMultiplier(subject.multiplierValue).toFixed(4)}</span>` : ""}
      <strong ${averageColor ? `style="color: ${averageColor}"` : ""}>Promedio: ${stats.average.toFixed(2)}</strong>
      ${subject.multiplierEnabled ? `<span>Base sin multiplicador: ${stats.baseAverage.toFixed(2)}</span>` : ""}
      <span>${activeNotesCount} notas${discardedNotesCount ? ` · ${discardedNotesCount} descartadas` : ""}</span>
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
  els.modalSubjectName.value = subject.name;
  els.modalTeacher.value = subject.teacher || "";
  els.modalSubjectGroup.value = subject.group || "";
  els.modalMode.value = subject.mode;
  els.modalColor.value = subject.color || (document.body.getAttribute("data-theme") === "pink" ? pinkSubjectColor : defaultSubjectColor);
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
  renderGroupSettings();
  renderMultiplierSettings();
  renderCreditsSettings();
  renderPassingSettings();
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
  applyScoreColor(els.subjectAverage, stats.average, "colorSubjects");
  els.subjectNotes.textContent = subject.notes.filter((note) => !note.discarded).length;
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
    const isDiscarded = Boolean(note.discarded);
    const scoreColor = isDiscarded ? "" : colorForScore(score, "colorComponents");
    const card = document.createElement("article");
    card.className = `note-card${isDiscarded ? " is-discarded" : ""}`;
    const isEditingNote = inlineEditingNoteId === note.id;
    const isAddingComponent = addingComponentNoteId === note.id;
    const weightInfo = subject.mode === "percent" ? `Peso: ${note.weight || 0}%` : "";
    const compInfo = note.type === "control" ? `Componentes: ${(note.components || []).length}` : "Nota directa";
    const dateInfo = note.date ? `Fecha: ${formatDate(note.date)}` : "Sin fecha";
    const noteHeader = isEditingNote
      ? `
        <div class="inline-edit note-inline-edit">
          <label>
            Nombre
            <input type="text" value="${escapeHtml(note.title)}" data-note-title-input="${note.id}">
          </label>
          ${note.type === "solid" ? `
            <label>
              Nota
              <input type="number" min="0" step="0.1" value="${Number(note.score || 0)}" data-note-score-input="${note.id}">
            </label>
          ` : ""}
          ${subject.mode === "percent" ? `
            <label>
              Porcentaje
              <input type="number" min="0" max="100" step="0.1" value="${Number(note.weight || 0)}" data-note-weight-input="${note.id}">
            </label>
          ` : ""}
          <label>
            Fecha
            <input type="date" value="${escapeHtml(note.date || "")}" data-note-date-input="${note.id}">
          </label>
        </div>
      `
      : `<strong>${escapeHtml(note.title)}</strong>`;
    const componentList = note.type === "control"
      ? `
        <div class="note-components">
          ${(note.components || []).map((component) => {
            const componentScore = Number(component.score);
            const isComponentDiscarded = Boolean(component.discarded);
            const componentColor = isDiscarded || isComponentDiscarded ? "" : colorForScore(componentScore, "colorComponents");
            const isEditingComponent = inlineEditingComponent &&
              inlineEditingComponent.noteId === note.id &&
              inlineEditingComponent.componentId === component.id;
            if (isEditingComponent) {
              return `
                <div class="note-component component-inline-edit">
                  <label>
                    Nombre
                    <input type="text" value="${escapeHtml(component.title)}" data-component-title-input="${escapeHtml(component.id)}">
                  </label>
                  <label>
                    Nota
                    <input type="number" min="0" step="0.1" value="${Number.isFinite(componentScore) ? componentScore : 0}" data-component-score-input="${escapeHtml(component.id)}">
                  </label>
                  <div class="inline-actions">
                    <button class="ghost" type="button" data-component-save="${escapeHtml(component.id)}" data-note-id="${escapeHtml(note.id)}">Guardar</button>
                    <button class="ghost" type="button" data-component-cancel>Cancelar</button>
                  </div>
                </div>
              `;
            }
            return `
              <div class="note-component${isComponentDiscarded ? " is-discarded" : ""}" draggable="true" data-note-component="${escapeHtml(component.id)}" data-note-id="${escapeHtml(note.id)}">
                <span class="drag-handle" role="button" tabindex="0" draggable="true" aria-label="Arrastrar componente" title="Arrastrar componente">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
                <span>${escapeHtml(component.title)}</span>
                <strong ${componentColor ? `style="color: ${componentColor}"` : ""}>${Number.isFinite(componentScore) ? componentScore.toFixed(2) : "0.00"}</strong>
                <div class="component-actions">
                  ${isComponentDiscarded ? `<span class="note-type note-status">Descartado</span>` : ""}
                  ${isComponentDiscarded
                    ? `<button class="ghost" type="button" data-component-restore="${escapeHtml(component.id)}" data-note-id="${escapeHtml(note.id)}">Reintegrar</button>`
                    : `
                      <button class="ghost" type="button" data-component-edit="${escapeHtml(component.id)}" data-note-id="${escapeHtml(note.id)}">Editar</button>
                      <button class="ghost" type="button" data-component-discard="${escapeHtml(component.id)}" data-note-id="${escapeHtml(note.id)}">Descartar</button>
                    `}
                  <button class="ghost danger" type="button" data-component-delete="${escapeHtml(component.id)}" data-note-id="${escapeHtml(note.id)}">Eliminar</button>
                </div>
              </div>
            `;
          }).join("")}
          ${isAddingComponent ? `
            <div class="note-component component-inline-edit add-component-row">
              <label>
                Nombre
                <input type="text" placeholder="Control 1" data-new-component-title="${escapeHtml(note.id)}">
              </label>
              <label>
                Nota
                <input type="number" min="0" step="0.1" data-new-component-score="${escapeHtml(note.id)}">
              </label>
              <div class="inline-actions">
                <button class="ghost" type="button" data-component-add-save="${escapeHtml(note.id)}">Crear</button>
                <button class="ghost" type="button" data-component-add-cancel>Cancelar</button>
              </div>
            </div>
          ` : ""}
        </div>
      `
      : "";

    card.innerHTML = `
      <div class="note-head">
        ${noteHeader}
        <div class="note-actions">
          <span class="note-type">${note.type === "control" ? "Control" : "Solida"}</span>
          ${isDiscarded ? `<span class="note-type note-status">Descartada</span>` : ""}
          ${note.type === "control" && !isDiscarded ? `<button class="icon-button" type="button" data-component-add="${note.id}" aria-label="Agregar componente">+</button>` : ""}
          ${isDiscarded
            ? `<button class="ghost" type="button" data-restore-note="${note.id}">Reintegrar</button>`
            : isEditingNote
            ? `
              <button class="ghost" type="button" data-note-save="${note.id}">Guardar</button>
              <button class="ghost" type="button" data-note-cancel>Cancelar</button>
            `
            : `<button class="ghost" type="button" data-edit="${note.id}">Editar</button>`}
          ${!isDiscarded ? `<button class="ghost" type="button" data-discard-note="${note.id}">Descartar</button>` : ""}
          <button class="ghost danger" type="button" data-delete="${note.id}">Eliminar</button>
        </div>
      </div>
      <div class="note-metrics">${compInfo}</div>
      ${componentList}
      <div class="note-metrics">Nota: <strong ${scoreColor ? `style="color: ${scoreColor}"` : ""}>${score.toFixed(2)}</strong> ${weightInfo}</div>
      <div class="note-metrics">${dateInfo}</div>
    `;
    els.notesList.appendChild(card);
  });

  els.notesList.querySelectorAll("[data-edit]").forEach((button) => {
    button.addEventListener("click", () => startInlineEditNote(button.dataset.edit));
  });
  els.notesList.querySelectorAll("[data-note-save]").forEach((button) => {
    button.addEventListener("click", () => saveInlineNote(button.dataset.noteSave));
  });
  els.notesList.querySelectorAll("[data-note-cancel]").forEach((button) => {
    button.addEventListener("click", cancelInlineNoteEdit);
  });
  els.notesList.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteNote(button.dataset.delete));
  });
  els.notesList.querySelectorAll("[data-discard-note]").forEach((button) => {
    button.addEventListener("click", () => setNoteDiscarded(button.dataset.discardNote, true));
  });
  els.notesList.querySelectorAll("[data-restore-note]").forEach((button) => {
    button.addEventListener("click", () => setNoteDiscarded(button.dataset.restoreNote, false));
  });
  els.notesList.querySelectorAll("[data-component-add]").forEach((button) => {
    button.addEventListener("click", () => startAddComponent(button.dataset.componentAdd));
  });
  els.notesList.querySelectorAll("[data-component-add-save]").forEach((button) => {
    button.addEventListener("click", () => saveNewComponent(button.dataset.componentAddSave));
  });
  els.notesList.querySelectorAll("[data-component-add-cancel]").forEach((button) => {
    button.addEventListener("click", cancelAddComponent);
  });
  els.notesList.querySelectorAll("[data-component-edit]").forEach((button) => {
    button.addEventListener("click", () => startInlineEditComponent(button.dataset.noteId, button.dataset.componentEdit));
  });
  els.notesList.querySelectorAll("[data-component-save]").forEach((button) => {
    button.addEventListener("click", () => saveInlineComponent(button.dataset.noteId, button.dataset.componentSave));
  });
  els.notesList.querySelectorAll("[data-component-cancel]").forEach((button) => {
    button.addEventListener("click", cancelInlineComponentEdit);
  });
  els.notesList.querySelectorAll("[data-component-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteSavedComponent(button.dataset.noteId, button.dataset.componentDelete));
  });
  els.notesList.querySelectorAll("[data-component-discard]").forEach((button) => {
    button.addEventListener("click", () => setComponentDiscarded(button.dataset.noteId, button.dataset.componentDiscard, true));
  });
  els.notesList.querySelectorAll("[data-component-restore]").forEach((button) => {
    button.addEventListener("click", () => setComponentDiscarded(button.dataset.noteId, button.dataset.componentRestore, false));
  });
  els.notesList.querySelectorAll(".note-component").forEach((row) => {
    const handle = row.querySelector(".drag-handle");
    if (!handle) return;
    handle.addEventListener("pointerdown", () => {
      row.dataset.dragReady = "true";
    });
    row.addEventListener("dragstart", handleSavedComponentDragStart);
    row.addEventListener("dragover", handleSavedComponentDragOver);
    row.addEventListener("dragleave", handleSavedComponentDragLeave);
    row.addEventListener("drop", handleSavedComponentDrop);
    row.addEventListener("dragend", handleSavedComponentDragEnd);
  });
}

function refreshActiveSubjectDetails() {
  const subject = getActiveSubject();
  if (!subject) return;
  saveSubjects();
  renderSubjectDetails(subject);
  renderSubjects();
  calculateOverall();
}

function startInlineEditNote(noteId) {
  const subject = getActiveSubject();
  if (!subject) return;
  inlineEditingNoteId = noteId;
  addingComponentNoteId = null;
  inlineEditingComponent = null;
  renderSubjectDetails(subject);
}

function cancelInlineNoteEdit() {
  const subject = getActiveSubject();
  if (!subject) return;
  inlineEditingNoteId = null;
  renderSubjectDetails(subject);
}

function saveInlineNote(noteId) {
  const subject = getActiveSubject();
  if (!subject) return;
  const note = subject.notes.find((item) => item.id === noteId);
  if (!note) return;

  const titleInput = els.notesList.querySelector(`[data-note-title-input="${noteId}"]`);
  const scoreInput = els.notesList.querySelector(`[data-note-score-input="${noteId}"]`);
  const weightInput = els.notesList.querySelector(`[data-note-weight-input="${noteId}"]`);
  const dateInput = els.notesList.querySelector(`[data-note-date-input="${noteId}"]`);
  const nextTitle = titleInput ? titleInput.value.trim() : note.title;
  if (!nextTitle) return;

  note.title = nextTitle;
  if (note.type === "solid" && scoreInput) note.score = Number(scoreInput.value);
  if (weightInput) note.weight = Number(weightInput.value);
  if (dateInput) note.date = dateInput.value;
  inlineEditingNoteId = null;
  refreshActiveSubjectDetails();
}

function startAddComponent(noteId) {
  const subject = getActiveSubject();
  if (!subject) return;
  addingComponentNoteId = addingComponentNoteId === noteId ? null : noteId;
  inlineEditingComponent = null;
  renderSubjectDetails(subject);
}

function cancelAddComponent() {
  const subject = getActiveSubject();
  if (!subject) return;
  addingComponentNoteId = null;
  renderSubjectDetails(subject);
}

function saveNewComponent(noteId) {
  const subject = getActiveSubject();
  if (!subject) return;
  const note = subject.notes.find((item) => item.id === noteId);
  if (!note || note.type !== "control") return;

  const titleInput = els.notesList.querySelector(`[data-new-component-title="${noteId}"]`);
  const scoreInput = els.notesList.querySelector(`[data-new-component-score="${noteId}"]`);
  const title = titleInput ? titleInput.value.trim() : "";
  const score = scoreInput ? Number(scoreInput.value) : NaN;
  if (!title || Number.isNaN(score)) return;

  note.components = Array.isArray(note.components) ? note.components : [];
  note.components.push({ id: createId(), title, score });
  addingComponentNoteId = null;
  refreshActiveSubjectDetails();
}

function startInlineEditComponent(noteId, componentId) {
  const subject = getActiveSubject();
  if (!subject) return;
  inlineEditingComponent = { noteId, componentId };
  addingComponentNoteId = null;
  renderSubjectDetails(subject);
}

function cancelInlineComponentEdit() {
  const subject = getActiveSubject();
  if (!subject) return;
  inlineEditingComponent = null;
  renderSubjectDetails(subject);
}

function saveInlineComponent(noteId, componentId) {
  const subject = getActiveSubject();
  if (!subject) return;
  const note = subject.notes.find((item) => item.id === noteId);
  if (!note || !Array.isArray(note.components)) return;
  const component = note.components.find((item) => item.id === componentId);
  if (!component) return;

  const titleInput = els.notesList.querySelector(`[data-component-title-input="${componentId}"]`);
  const scoreInput = els.notesList.querySelector(`[data-component-score-input="${componentId}"]`);
  const title = titleInput ? titleInput.value.trim() : "";
  const score = scoreInput ? Number(scoreInput.value) : NaN;
  if (!title || Number.isNaN(score)) return;

  component.title = title;
  component.score = score;
  inlineEditingComponent = null;
  refreshActiveSubjectDetails();
}

function deleteSavedComponent(noteId, componentId) {
  const subject = getActiveSubject();
  if (!subject) return;
  const note = subject.notes.find((item) => item.id === noteId);
  if (!note || !Array.isArray(note.components)) return;
  if (!confirm("Eliminar este componente?")) return;
  note.components = note.components.filter((item) => item.id !== componentId);
  if (inlineEditingComponent && inlineEditingComponent.componentId === componentId) {
    inlineEditingComponent = null;
  }
  refreshActiveSubjectDetails();
}

function setComponentDiscarded(noteId, componentId, discarded) {
  const subject = getActiveSubject();
  if (!subject) return;
  const note = subject.notes.find((item) => item.id === noteId);
  if (!note || !Array.isArray(note.components)) return;
  const component = note.components.find((item) => item.id === componentId);
  if (!component) return;
  component.discarded = discarded;
  if (discarded && inlineEditingComponent && inlineEditingComponent.componentId === componentId) {
    inlineEditingComponent = null;
  }
  refreshActiveSubjectDetails();
}

function setNoteDiscarded(noteId, discarded) {
  const subject = getActiveSubject();
  if (!subject) return;
  const note = subject.notes.find((item) => item.id === noteId);
  if (!note) return;
  note.discarded = discarded;
  if (discarded) {
    if (inlineEditingNoteId === noteId) inlineEditingNoteId = null;
    if (addingComponentNoteId === noteId) addingComponentNoteId = null;
    if (inlineEditingComponent && inlineEditingComponent.noteId === noteId) inlineEditingComponent = null;
  }
  refreshActiveSubjectDetails();
}

function handleSavedComponentDragStart(event) {
  const row = event.currentTarget;
  if (row.dataset.dragReady !== "true") {
    event.preventDefault();
    return;
  }
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", JSON.stringify({
    noteId: row.dataset.noteId,
    componentId: row.dataset.noteComponent,
  }));
  row.classList.add("is-dragging");
}

function handleSavedComponentDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  const row = event.currentTarget;
  const rect = row.getBoundingClientRect();
  const isAfter = event.clientY > rect.top + rect.height / 2;
  row.classList.toggle("is-drag-over-before", !isAfter);
  row.classList.toggle("is-drag-over-after", isAfter);
}

function handleSavedComponentDragLeave(event) {
  event.currentTarget.classList.remove("is-drag-over-before", "is-drag-over-after");
}

function handleSavedComponentDrop(event) {
  event.preventDefault();
  let payload = {};
  try {
    payload = JSON.parse(event.dataTransfer.getData("text/plain") || "{}");
  } catch (err) {
    return;
  }
  const targetNoteId = event.currentTarget.dataset.noteId;
  const targetComponentId = event.currentTarget.dataset.noteComponent;
  if (payload.noteId !== targetNoteId) return;
  const rect = event.currentTarget.getBoundingClientRect();
  const position = event.clientY > rect.top + rect.height / 2 ? "after" : "before";
  reorderSavedComponents(targetNoteId, payload.componentId, targetComponentId, position);
}

function handleSavedComponentDragEnd() {
  els.notesList.querySelectorAll(".note-component").forEach((row) => {
    row.classList.remove("is-dragging", "is-drag-over-before", "is-drag-over-after");
    delete row.dataset.dragReady;
  });
}

function reorderSavedComponents(noteId, sourceId, targetId, position) {
  if (!noteId || !sourceId || !targetId || sourceId === targetId) return;
  const subject = getActiveSubject();
  if (!subject) return;
  const note = subject.notes.find((item) => item.id === noteId);
  if (!note || !Array.isArray(note.components)) return;
  if (!reorderComponents(note.components, sourceId, targetId, position)) return;
  saveSubjects();
  renderSubjectDetails(subject);
  calculateOverall();
}

function reorderComponents(list, sourceId, targetId, position) {
  if (!sourceId || !targetId || sourceId === targetId) return false;
  const sourceIndex = list.findIndex((item) => item.id === sourceId);
  const targetIndex = list.findIndex((item) => item.id === targetId);
  if (sourceIndex === -1 || targetIndex === -1) return false;

  const [moved] = list.splice(sourceIndex, 1);
  let insertIndex = list.findIndex((item) => item.id === targetId);
  if (insertIndex === -1) return false;
  if (position === "after") insertIndex += 1;
  list.splice(insertIndex, 0, moved);
  return true;
}

function resetNoteForm() {
  els.noteForm.reset();
  els.noteScore.value = "";
  els.noteWeight.value = 0;
  els.noteDate.value = "";
  editingNoteId = null;
  inlineEditingNoteId = null;
  addingComponentNoteId = null;
  inlineEditingComponent = null;
  els.saveNote.textContent = "Crear nota";
  els.addNoteToggle.textContent = "Agregar nota";
  els.noteForm.classList.add("is-hidden");
  toggleControlBox();
}

function toggleControlBox() {
  const type = els.noteType.value;
  const noteScoreLabel = els.noteScore.closest("label");
  if (type === "control") {
    els.noteScore.value = "";
    els.noteScore.disabled = true;
    if (noteScoreLabel) noteScoreLabel.style.display = "none";
  } else {
    els.noteScore.disabled = false;
    if (noteScoreLabel) noteScoreLabel.style.display = "grid";
  }
}

function openNoteForm() {
  inlineEditingNoteId = null;
  inlineEditingComponent = null;
  addingComponentNoteId = null;
  els.noteForm.classList.remove("is-hidden");
  els.addNoteToggle.textContent = "Agregar otra nota";
  els.noteTitle.focus();
}

function handleAddNoteToggle() {
  if (els.noteForm.classList.contains("is-hidden")) {
    openNoteForm();
  } else {
    resetNoteForm();
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
    credits: 1,
    multiplierEnabled: false,
    multiplierValue: 1,
    notes: [],
    files: [],
  };

  subjects.push(newSubject);
  els.subjectForm.reset();
  els.subjectGroup.value = "";
  els.subjectColor.value = document.body.getAttribute("data-theme") === "pink" ? pinkSubjectColor : defaultSubjectColor;
  updateGroupFilter();
  updateEventSubjects();
  renderCreditsSettings();
  saveSubjects();
  renderSubjects();
  calculateOverall();
  renderGroupSettings();
  renderMultiplierSettings();
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
    components: type === "control" ? [] : [],
    date: els.noteDate.value,
  };

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

function renderEvents() {
  renderCalendar();
  renderEventList();
  renderNextEvent();
  syncEventsPanelHeight();
}

function syncEventsPanelHeight() {
  if (!els.calendar || !els.eventsSidePanel) return;
  if (window.matchMedia("(max-width: 760px)").matches) {
    els.eventsSidePanel.style.maxHeight = "";
    return;
  }

  const calendarRect = els.calendar.getBoundingClientRect();
  const panelRect = els.eventsSidePanel.getBoundingClientRect();
  const availableHeight = Math.floor(calendarRect.bottom - panelRect.top);
  els.eventsSidePanel.style.maxHeight = `${Math.max(240, availableHeight)}px`;
}

function renderCalendar() {
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const startDate = new Date(year, month, 1 - startOffset);

  els.calendarTitle.textContent = firstDay.toLocaleDateString("es-CL", {
    month: "long",
    year: "numeric",
  });
  els.calendarGrid.innerHTML = "";

  for (let index = 0; index < 42; index += 1) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + index);
    const dateKey = toDateKey(day);
    const dayEvents = sortEvents(events.filter((event) => event.date === dateKey));
    const colors = dayEvents.map((event) => getSubjectColor(event.subject));
    const button = document.createElement("button");
    button.type = "button";
    button.className = "calendar-day";
    if (day.getMonth() !== month) button.classList.add("is-muted");
    if (dateKey === getToday()) button.classList.add("is-today");
    if (dateKey === selectedEventDate) button.classList.add("is-selected");
    if (dayEvents.length) {
      button.classList.add("has-events");
      button.style.setProperty("--event-color", colors[0]);
    }
    button.dataset.date = dateKey;

    const dots = colors
      .slice(0, 4)
      .map((color) => `<span class="day-dot" style="--dot-color: ${color}"></span>`)
      .join("");
    const firstEvent = dayEvents[0] ? `<span class="day-event-name">${escapeHtml(dayEvents[0].name)}</span>` : "";
    button.innerHTML = `
      <span class="day-number">${day.getDate()}</span>
      <span class="day-dots">${dots}</span>
      ${firstEvent}
    `;
    button.addEventListener("click", () => {
      selectedEventDate = dateKey;
      if (day.getMonth() !== month) {
        calendarDate = new Date(day.getFullYear(), day.getMonth(), 1);
      }
      renderEvents();
    });
    els.calendarGrid.appendChild(button);
  }
}

function renderEventList() {
  const today = getToday();
  const showingHistory = Boolean(selectedEventDate && selectedEventDate < today);
  const visibleEvents = showingHistory
    ? sortEvents(events.filter((event) => event.date === selectedEventDate))
    : sortEvents(events.filter((event) => event.date && event.date >= today));

  els.eventsListTitle.textContent = showingHistory
    ? `Eventos del ${formatDate(selectedEventDate)}`
    : "Próximos eventos";
  els.eventsListDescription.textContent = showingHistory
    ? "Historial de la fecha seleccionada."
    : "Agenda ordenada por fecha.";
  els.eventsHistoryBack.classList.toggle("is-hidden", !showingHistory);

  if (!visibleEvents.length) {
    els.eventsList.innerHTML = showingHistory
      ? "<div class=\"empty\">No registraste eventos para este dia.</div>"
      : "<div class=\"empty\">No hay proximos eventos.</div>";
    return;
  }

  els.eventsList.innerHTML = "";
  visibleEvents.forEach((event) => {
    const item = document.createElement("div");
    const color = getSubjectColor(event.subject);
    item.className = "event-item";
    item.style.setProperty("--event-color", color);
    const timeText = event.time ? ` · ${escapeHtml(event.time)}` : "";
    const topicText = event.topic ? `<div class="event-topic-text">${escapeHtml(event.topic)}</div>` : "";
    item.innerHTML = `
      <div>
        <strong>${escapeHtml(event.name)}</strong>
        <div class="event-meta">${escapeHtml(event.subject)} · ${formatDate(event.date)}${timeText}</div>
        ${topicText}
      </div>
      <div class="event-actions">
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
}

function renderNextEvent() {
  const today = getToday();
  const sorted = sortEvents(events.filter((event) => event.date && event.date >= today));
  const next = sorted[0];

  if (!next) {
    els.nextEventName.textContent = "Sin eventos";
    els.nextEventMeta.textContent = events.length ? "No hay eventos proximos" : "Agrega un evento";
    return;
  }

  const timeText = next.time ? ` · ${next.time}` : "";
  els.nextEventName.textContent = next.name;
  els.nextEventMeta.textContent = `${next.subject} · ${formatDate(next.date)}${timeText}`;
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
  const time = els.eventTime.value;
  const topic = els.eventTopic.value.trim();
  if (!name || !date) return;

  if (editingEventId) {
    const index = events.findIndex((item) => item.id === editingEventId);
    if (index !== -1) {
      events[index] = { id: editingEventId, name, subject, date, time, topic };
    }
    editingEventId = null;
  } else {
    events.unshift({ id: createId(), name, subject, date, time, topic });
  }
  selectedEventDate = date;
  calendarDate = new Date(`${date}T00:00:00`);
  saveEvents();
  renderEvents();
  resetEventForm();
}

function startEditEvent(eventId) {
  const item = events.find((event) => event.id === eventId);
  if (!item) return;
  editingEventId = eventId;
  els.eventName.value = item.name;
  els.eventSubject.value = item.subject;
  els.eventDate.value = item.date;
  els.eventTime.value = item.time || "";
  els.eventTopic.value = item.topic || "";
  els.saveEvent.textContent = "Guardar cambios";
  selectedEventDate = item.date || selectedEventDate;
  if (item.date) calendarDate = new Date(`${item.date}T00:00:00`);
  renderEvents();
}

function deleteEvent(eventId) {
  if (!confirm("Eliminar este evento?")) return;
  events = events.filter((item) => item.id !== eventId);
  saveEvents();
  renderEvents();
  if (editingEventId === eventId) {
    resetEventForm();
  }
}

function resetEventForm() {
  editingEventId = null;
  els.eventForm.reset();
  els.saveEvent.textContent = "Agregar prueba";
  updateEventSubjects();
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
    row.draggable = true;
    row.dataset.fileId = file.id;
    const displayName = file.displayName || file.name;
    const previewButton = `<button class="ghost file-preview-button" type="button" data-file-preview="${file.id}" aria-label="Visualizar archivo" title="Visualizar archivo">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path>
          <circle cx="12" cy="12" r="2.5"></circle>
        </svg>
        <span>Visualizar</span>
      </button>`;
    row.innerHTML = `
      <span class="drag-handle" role="button" tabindex="0" draggable="true" aria-label="Arrastrar archivo" title="Arrastrar archivo">
        <span></span>
        <span></span>
        <span></span>
      </span>
      <div class="file-icon">${iconForFile(file.name)}</div>
      <div class="file-meta">
        <h4>${escapeHtml(displayName)}</h4>
        <p>Subido: ${formatDate(file.uploadedAt)}</p>
      </div>
      <div class="file-actions">
        ${previewButton}
        <button class="download-icon" type="button" data-file-download="${file.id}" aria-label="Descargar archivo" title="Descargar archivo">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M11 4h2v8l3-3 1.4 1.4L12 15.8l-5.4-5.4L8 9l3 3V4Z"></path>
            <path d="M5 18h14v2H5v-2Z"></path>
          </svg>
        </button>
        <button class="ghost" type="button" data-file-edit="${file.id}">Editar</button>
        <button class="ghost danger" type="button" data-file-delete="${file.id}">Eliminar</button>
      </div>
    `;
    els.filesList.appendChild(row);
  });

  els.filesList.querySelectorAll("[data-file-preview]").forEach((button) => {
    button.addEventListener("click", () => openFilePreview(button.dataset.filePreview));
  });
  els.filesList.querySelectorAll("[data-file-download]").forEach((button) => {
    button.addEventListener("click", () => downloadStoredFile(button.dataset.fileDownload));
  });
  els.filesList.querySelectorAll("[data-file-edit]").forEach((button) => {
    button.addEventListener("click", () => startEditFile(button.dataset.fileEdit));
  });
  els.filesList.querySelectorAll("[data-file-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteFile(button.dataset.fileDelete));
  });
  els.filesList.querySelectorAll(".file-item").forEach((row) => {
    const handle = row.querySelector(".drag-handle");
    handle.addEventListener("pointerdown", () => {
      row.dataset.dragReady = "true";
    });
    row.addEventListener("dragstart", handleFileDragStart);
    row.addEventListener("dragover", handleFileDragOver);
    row.addEventListener("dragleave", handleFileDragLeave);
    row.addEventListener("drop", handleFileDrop);
    row.addEventListener("dragend", handleFileDragEnd);
  });
}

function getFileExtension(filename = "") {
  const parts = filename.toLowerCase().split(".");
  return parts.length > 1 ? parts.pop() : "";
}

function getPreviewType(file) {
  const type = (file.type || "").toLowerCase();
  const extension = getFileExtension(file.name);
  if ((type.startsWith("image/") && type !== "image/svg+xml") || ["png", "jpg", "jpeg", "gif", "webp", "bmp"].includes(extension)) return "image";
  if (type === "application/pdf" || extension === "pdf") return "pdf";
  if (type.startsWith("audio/") || ["mp3", "wav", "ogg", "m4a", "aac"].includes(extension)) return "audio";
  if (type.startsWith("video/") || ["mp4", "webm", "ogv", "mov"].includes(extension)) return "video";
  if (type.startsWith("text/") || ["txt", "csv", "md", "json", "log"].includes(extension)) return "text";
  return "";
}

function canPreviewFile(file) {
  return Boolean(file && getPreviewType(file));
}

function decodeTextDataUrl(dataUrl) {
  const commaIndex = dataUrl.indexOf(",");
  if (commaIndex === -1) return "";
  const metadata = dataUrl.slice(0, commaIndex);
  const payload = dataUrl.slice(commaIndex + 1);
  if (!metadata.includes(";base64")) return decodeURIComponent(payload);
  const bytes = Uint8Array.from(atob(payload), (character) => character.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}

async function openFilePreview(fileId) {
  const subject = getActiveSubject();
  const file = subject && subject.files.find((item) => item.id === fileId);
  if (!file) return;
  if (!canPreviewFile(file)) {
    alert("Este formato no admite vista previa en el navegador. Puedes descargar el archivo para abrirlo con su aplicación correspondiente.");
    return;
  }

  let fileData;
  try {
    fileData = await getStoredFileData(file);
  } catch (error) {
    alert("No fue posible abrir el archivo guardado.");
    return;
  }
  if (!fileData) {
    alert("El contenido de este archivo no está disponible.");
    return;
  }

  const previewType = getPreviewType(file);
  const displayName = file.displayName || file.name;
  els.filePreviewTitle.textContent = displayName;
  els.filePreviewBody.innerHTML = "";

  let preview;
  if (previewType === "image") {
    preview = document.createElement("img");
    preview.src = fileData;
    preview.alt = displayName;
  } else if (previewType === "pdf") {
    preview = document.createElement("iframe");
    preview.src = fileData;
    preview.title = displayName;
  } else if (previewType === "audio") {
    preview = document.createElement("audio");
    preview.src = fileData;
    preview.controls = true;
  } else if (previewType === "video") {
    preview = document.createElement("video");
    preview.src = fileData;
    preview.controls = true;
  } else {
    preview = document.createElement("pre");
    preview.className = "file-preview-text";
    try {
      preview.textContent = decodeTextDataUrl(fileData);
    } catch (error) {
      preview.textContent = "No fue posible interpretar el contenido de este archivo.";
    }
  }

  els.filePreviewBody.appendChild(preview);
  els.filePreviewModal.classList.add("is-open");
  els.filePreviewModal.setAttribute("aria-hidden", "false");
}

async function downloadStoredFile(fileId) {
  const subject = getActiveSubject();
  const file = subject && subject.files.find((item) => item.id === fileId);
  if (!file) return;
  try {
    const fileData = await getStoredFileData(file);
    if (!fileData) throw new Error("Contenido no disponible");
    const link = document.createElement("a");
    link.href = fileData;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    alert("No fue posible descargar el archivo guardado.");
  }
}

function closeFilePreview() {
  els.filePreviewModal.classList.remove("is-open");
  els.filePreviewModal.setAttribute("aria-hidden", "true");
  els.filePreviewBody.innerHTML = "";
}

function handleFileDragStart(event) {
  const row = event.currentTarget;
  if (row.dataset.dragReady !== "true") {
    event.preventDefault();
    return;
  }
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", row.dataset.fileId);
  row.classList.add("is-dragging");
}

function handleFileDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  const row = event.currentTarget;
  const rect = row.getBoundingClientRect();
  const isAfter = event.clientY > rect.top + rect.height / 2;
  row.classList.toggle("is-drag-over-before", !isAfter);
  row.classList.toggle("is-drag-over-after", isAfter);
}

function handleFileDragLeave(event) {
  event.currentTarget.classList.remove("is-drag-over-before", "is-drag-over-after");
}

function handleFileDrop(event) {
  event.preventDefault();
  const sourceId = event.dataTransfer.getData("text/plain");
  const targetId = event.currentTarget.dataset.fileId;
  const rect = event.currentTarget.getBoundingClientRect();
  const position = event.clientY > rect.top + rect.height / 2 ? "after" : "before";
  reorderFiles(sourceId, targetId, position);
}

function handleFileDragEnd() {
  els.filesList.querySelectorAll(".file-item").forEach((row) => {
    row.classList.remove("is-dragging", "is-drag-over-before", "is-drag-over-after");
    delete row.dataset.dragReady;
  });
}

function reorderFiles(sourceId, targetId, position) {
  const subject = getActiveSubject();
  if (!subject || !Array.isArray(subject.files)) return;
  if (!reorderComponents(subject.files, sourceId, targetId, position)) return;
  saveSubjects();
  renderFiles(subject);
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

function setFileUploadBusy(isBusy) {
  els.saveFile.disabled = isBusy;
  if (isBusy) {
    els.saveFile.textContent = "Procesando archivo...";
  } else {
    els.saveFile.textContent = editingFileId ? "Guardar cambios" : "Subir archivo";
  }
}

function persistFileChange(rollback) {
  try {
    saveSubjects();
    return true;
  } catch (error) {
    rollback();
    alert("No fue posible guardar el archivo. El almacenamiento del navegador puede estar lleno; prueba con un archivo más pequeño o exporta un respaldo antes de liberar espacio.");
    return false;
  }
}

async function handleFileSubmit(event) {
  event.preventDefault();
  await filesMigrationPromise;
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
      reader.onload = async () => {
        const updatedFile = {
          ...existing,
          name: file.name,
          type: file.type,
          displayName,
          uploadedAt: new Date().toISOString(),
        };
        delete updatedFile.data;
        try {
          await setStoredFileData(existing.id, reader.result);
        } catch (error) {
          setFileUploadBusy(false);
          alert("No fue posible guardar el archivo en el almacenamiento del navegador.");
          return;
        }
        subject.files[index] = updatedFile;
        saveSubjects();
        renderFiles(subject);
        resetFileForm();
      };
      reader.onerror = () => {
        setFileUploadBusy(false);
        alert("No fue posible leer el archivo seleccionado.");
      };
      setFileUploadBusy(true);
      reader.readAsDataURL(file);
    } else {
      const updatedFile = {
        ...existing,
        displayName,
      };
      subject.files[index] = updatedFile;
      if (!persistFileChange(() => {
        subject.files[index] = existing;
      })) return;
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
  reader.onload = async () => {
    const entry = {
      id: createId(),
      name: file.name,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      displayName,
    };
    try {
      await setStoredFileData(entry.id, reader.result);
    } catch (error) {
      setFileUploadBusy(false);
      alert("No fue posible guardar el archivo en el almacenamiento del navegador.");
      return;
    }
    subject.files = subject.files || [];
    subject.files.unshift(entry);
    saveSubjects();
    renderFiles(subject);
    resetFileForm();
  };
  reader.onerror = () => {
    setFileUploadBusy(false);
    alert("No fue posible leer el archivo seleccionado.");
  };
  setFileUploadBusy(true);
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

async function deleteFile(fileId) {
  const subject = getActiveSubject();
  if (!subject) return;
  if (!confirm("Eliminar este archivo?")) return;
  subject.files = subject.files.filter((item) => item.id !== fileId);
  saveSubjects();
  try {
    await deleteStoredFileData(fileId);
  } catch (error) {
    console.error("No fue posible eliminar el contenido del archivo.", error);
  }
  renderFiles(subject);
  if (editingFileId === fileId) {
    resetFileForm();
  }
}

function resetFileForm() {
  els.fileForm.reset();
  editingFileId = null;
  els.saveFile.textContent = "Subir archivo";
  els.saveFile.disabled = false;
  els.cancelFileEdit.classList.add("is-hidden");
  updateFilePickerLabel();
}

function updateFilePickerLabel() {
  const file = els.fileInput.files[0];
  els.filePickerLabel.textContent = file ? file.name : "Seleccionar archivo";
  if (file && !els.fileName.value.trim()) {
    els.fileName.value = file.name.replace(/\.[^.]+$/, "");
  }
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

function getGroups() {
  return Array.from(new Set(subjects.map((subject) => subject.group).filter(Boolean))).sort();
}

function renderGroupSettings() {
  const groups = getGroups();
  if (!groups.length) {
    els.groupNamesList.innerHTML = "<div class=\"empty\">No hay grupos creados aun.</div>";
    return;
  }

  els.groupNamesList.innerHTML = groups
    .map((group) => `
      <div class="group-name-row">
        <input type="text" value="${escapeHtml(group)}" data-group-input="${escapeHtml(group)}" aria-label="Nombre del grupo ${escapeHtml(group)}">
        <button class="ghost" type="button" data-group-save="${escapeHtml(group)}">Guardar</button>
      </div>
    `)
    .join("");
}

function renameGroup(oldGroup, nextGroup) {
  const newGroup = nextGroup.trim();
  if (!oldGroup || !newGroup || oldGroup === newGroup) return;
  if (subjects.some((subject) => subject.group === newGroup)) {
    alert("Ya existe un grupo con ese nombre.");
    return;
  }

  subjects.forEach((subject) => {
    if (subject.group === oldGroup) {
      subject.group = newGroup;
    }
  });

  if (els.groupFilter.value === oldGroup) {
    els.groupFilter.value = newGroup;
  }
  if (localStorage.getItem(selectedGroupKey) === oldGroup) {
    localStorage.setItem(selectedGroupKey, newGroup);
  }
  saveSubjects();
  updateGroupFilter(newGroup);
  renderGroupSettings();
  renderMultiplierSettings();
  renderCreditsSettings();
  renderSubjects();
  calculateOverall();
}

function renderMultiplierSettings() {
  if (!subjects.length) {
    els.multiplierList.innerHTML = "<div class=\"empty\">Crea materias para asignar multiplicadores.</div>";
    return;
  }

  const groups = subjects.reduce((acc, subject) => {
    const groupName = subject.group || "Sin grupo";
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(subject);
    return acc;
  }, {});

  els.multiplierList.innerHTML = "";
  Object.keys(groups)
    .sort()
    .forEach((groupName) => {
      const groupBox = document.createElement("div");
      groupBox.className = "multiplier-group";
      const rows = groups[groupName]
        .map((subject) => `
          <div class="multiplier-row">
            <label class="checkline">
              <input type="checkbox" ${subject.multiplierEnabled ? "checked" : ""} data-multiplier-enabled="${escapeHtml(subject.id)}">
              <span>
                <strong>${escapeHtml(subject.name)}</strong>
                <small>${escapeHtml(subject.teacher || "Docente sin registrar")}</small>
              </span>
            </label>
            <input type="number" min="0.0001" step="0.0001" value="${normalizeMultiplier(subject.multiplierValue).toFixed(4)}" data-multiplier-value="${escapeHtml(subject.id)}" aria-label="Multiplicador de ${escapeHtml(subject.name)}">
          </div>
        `)
        .join("");
      groupBox.innerHTML = `
        <h4>${escapeHtml(groupName)}</h4>
        ${rows}
      `;
      els.multiplierList.appendChild(groupBox);
    });
}

function handleMultiplierChange(event) {
  const enabledInput = event.target.closest("[data-multiplier-enabled]");
  const valueInput = event.target.closest("[data-multiplier-value]");
  const subjectId = enabledInput ? enabledInput.dataset.multiplierEnabled : valueInput ? valueInput.dataset.multiplierValue : "";
  if (!subjectId) return;
  const subject = subjects.find((item) => item.id === subjectId);
  if (!subject) return;

  if (enabledInput) {
    subject.multiplierEnabled = enabledInput.checked;
  }
  if (valueInput) {
    subject.multiplierValue = normalizeMultiplier(valueInput.value);
    valueInput.value = subject.multiplierValue.toFixed(4);
  }
  saveSubjects();
  renderSubjects();
  calculateOverall();
  const activeSubject = getActiveSubject();
  if (activeSubject && activeSubject.id === subject.id) {
    renderSubjectDetails(activeSubject);
  }
}

function renderCreditsSettings() {
  els.weightedAverages.checked = settings.weightedAverages;
  els.creditsStatus.textContent = settings.weightedAverages
    ? "El promedio general usa la formula: suma(promedio x creditos) / suma(creditos)."
    : "Cada materia cuenta igual mientras esta opcion este desactivada.";

  if (!subjects.length) {
    els.creditsList.innerHTML = "<div class=\"empty\">Crea materias para asignar creditos.</div>";
    return;
  }

  const groups = subjects.reduce((acc, subject) => {
    const groupName = subject.group || "Sin grupo";
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(subject);
    return acc;
  }, {});

  els.creditsList.innerHTML = "";
  Object.keys(groups)
    .sort()
    .forEach((groupName) => {
      const groupBox = document.createElement("div");
      groupBox.className = "credits-group";
      const rows = groups[groupName]
        .map((subject) => `
          <label class="credit-row">
            <span>
              <strong>${escapeHtml(subject.name)}</strong>
              <small>${escapeHtml(subject.teacher || "Docente sin registrar")}</small>
            </span>
            <input type="number" min="1" step="1" value="${normalizeCredits(subject.credits)}" data-credit-subject="${escapeHtml(subject.id)}" aria-label="Creditos de ${escapeHtml(subject.name)}">
          </label>
        `)
        .join("");
      groupBox.innerHTML = `
        <h4>${escapeHtml(groupName)}</h4>
        ${rows}
      `;
      els.creditsList.appendChild(groupBox);
    });
}

function renderPassingSettings() {
  els.passingEnabled.checked = settings.passingEnabled;
  els.passingScore.value = settings.passingScore;
  els.failColor.value = settings.failColor;
  els.passColor.value = settings.passColor;
  els.colorDashboard.checked = settings.colorDashboard;
  els.colorSubjects.checked = settings.colorSubjects;
  els.colorComponents.checked = settings.colorComponents;
  els.passingStatus.textContent = settings.passingEnabled
    ? `Notas menores a ${settings.passingScore} usan reprobado; iguales o mayores usan aprobado.`
    : "Al activar, las notas menores al minimo usan el color reprobado.";
}

function refreshScoreDisplays() {
  calculateOverall();
  renderSubjects();
  const subject = getActiveSubject();
  if (subject) renderSubjectDetails(subject);
}

function handleWeightedAveragesToggle() {
  settings.weightedAverages = els.weightedAverages.checked;
  saveSettings();
  renderCreditsSettings();
  calculateOverall();
}

function handleCreditChange(event) {
  const input = event.target.closest("[data-credit-subject]");
  if (!input) return;
  const subject = subjects.find((item) => item.id === input.dataset.creditSubject);
  if (!subject) return;

  subject.credits = normalizeCredits(input.value);
  input.value = subject.credits;
  saveSubjects();
  calculateOverall();
  renderSubjects();
}

function handlePassingSettingsChange() {
  const score = Number(els.passingScore.value);
  settings.passingEnabled = els.passingEnabled.checked;
  settings.passingScore = Number.isFinite(score) ? score : 55;
  settings.failColor = normalizeColor(els.failColor.value, defaultFailColor);
  settings.passColor = normalizeColor(els.passColor.value, defaultPassColor);
  settings.colorDashboard = els.colorDashboard.checked;
  settings.colorSubjects = els.colorSubjects.checked;
  settings.colorComponents = els.colorComponents.checked;
  saveSettings();
  renderPassingSettings();
  refreshScoreDisplays();
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
  renderEvents();
}

function handleTeacherChange() {
  const subject = getActiveSubject();
  if (!subject) return;
  subject.teacher = els.modalTeacher.value.trim();
  saveSubjects();
  renderSubjects();
}

function handleSubjectNameChange() {
  const subject = getActiveSubject();
  if (!subject) return;

  const previousName = subject.name;
  const nextName = els.modalSubjectName.value.trim();
  if (!nextName) {
    els.modalSubjectName.value = previousName;
    return;
  }
  if (subjects.some((item) => item.id !== subject.id && item.name.toLowerCase() === nextName.toLowerCase())) {
    alert("Ya existe una materia con ese nombre.");
    els.modalSubjectName.value = previousName;
    return;
  }
  if (nextName === previousName) return;

  subject.name = nextName;
  events.forEach((event) => {
    if (event.subject === previousName) event.subject = nextName;
  });
  els.modalTitle.textContent = nextName;
  saveSubjects();
  saveEvents();
  updateEventSubjects();
  renderSubjects();
  renderEvents();
  renderCreditsSettings();
  renderMultiplierSettings();
  calculateOverall();
}

function handleSubjectGroupChange() {
  const subject = getActiveSubject();
  if (!subject) return;

  const previousGroup = subject.group || "";
  const nextGroup = els.modalSubjectGroup.value.trim();
  if (nextGroup === previousGroup) return;

  subject.group = nextGroup;
  saveSubjects();
  const selectedGroup = els.groupFilter.value;
  const preferredGroup = selectedGroup === previousGroup ? nextGroup : selectedGroup;
  updateGroupFilter(preferredGroup);
  if (preferredGroup) localStorage.setItem(selectedGroupKey, preferredGroup);
  else localStorage.removeItem(selectedGroupKey);
  renderSubjects();
  renderGroupSettings();
  renderCreditsSettings();
  renderMultiplierSettings();
  calculateOverall();
}

function updateGroupFilter(preferredGroup = els.groupFilter.value || localStorage.getItem(selectedGroupKey) || "") {
  const current = preferredGroup;
  const groups = getGroups();
  els.groupFilter.innerHTML = "<option value=\"\">Todos</option>";
  groups.forEach((group) => {
    const option = document.createElement("option");
    option.value = group;
    option.textContent = group;
    if (group === current) option.selected = true;
    els.groupFilter.appendChild(option);
  });
  if (current && !groups.includes(current)) {
    els.groupFilter.value = "";
    localStorage.removeItem(selectedGroupKey);
  }
}

function deleteNote(noteId) {
  const subject = getActiveSubject();
  if (!subject) return;
  if (!confirm("Eliminar esta nota?")) return;
  subject.notes = subject.notes.filter((note) => note.id !== noteId);
  if (inlineEditingNoteId === noteId) inlineEditingNoteId = null;
  if (addingComponentNoteId === noteId) addingComponentNoteId = null;
  if (inlineEditingComponent && inlineEditingComponent.noteId === noteId) inlineEditingComponent = null;
  saveSubjects();
  renderSubjectDetails(subject);
  calculateOverall();
}

async function deleteSubject() {
  const subject = getActiveSubject();
  if (!subject) return;
  if (!confirm("Eliminar la materia y todas sus notas?")) return;
  const fileIds = (subject.files || []).map((file) => file.id);
  subjects = subjects.filter((item) => item.id !== subject.id);
  saveSubjects();
  await Promise.all(fileIds.map((fileId) => deleteStoredFileData(fileId).catch(() => {})));
  closeModal();
  updateGroupFilter();
  updateEventSubjects();
  renderGroupSettings();
  renderMultiplierSettings();
  renderCreditsSettings();
  renderSubjects();
  calculateOverall();
}

function handleThemeToggle() {
  const isOpen = els.themeMenu.classList.toggle("is-open");
  els.themeToggle.setAttribute("aria-expanded", String(isOpen));
}

function handleLogoChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    setLogo(reader.result);
    els.logoFile.value = "";
  };
  reader.readAsDataURL(file);
}

function handleLogoReset() {
  setLogo("");
  els.logoFile.value = "";
}

async function handleExport() {
  try {
    await filesMigrationPromise;
    const exportSubjects = await Promise.all(subjects.map(async (subject) => ({
      ...subject,
      files: await Promise.all((subject.files || []).map(async (file) => ({
        ...file,
        data: await getStoredFileData(file),
      }))),
    })));
    const payload = JSON.stringify(
      {
        version: 4,
        exportedAt: new Date().toISOString(),
        theme: document.body.getAttribute("data-theme") || "light",
        logo: localStorage.getItem(logoKey) || "",
        settings,
        subjects: exportSubjects,
        links,
        events,
      },
      null,
      2
    );
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "lectum-data.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    alert("No fue posible preparar el respaldo. Comprueba que los archivos guardados sigan disponibles.");
  }
}

function handleImport(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async () => {
    try {
      await filesMigrationPromise;
      const parsed = JSON.parse(reader.result);
      const nextSubjects = Array.isArray(parsed) ? parsed : parsed.subjects;
      const nextLinks = Array.isArray(parsed) ? [] : parsed.links || [];
      const nextEvents = Array.isArray(parsed) ? [] : parsed.events || [];
      const nextSettings = Array.isArray(parsed) ? {} : parsed.settings || {};

      if (!Array.isArray(nextSubjects) || !Array.isArray(nextLinks) || !Array.isArray(nextEvents)) {
        throw new Error("Formato invalido");
      }
      const importedSubjects = nextSubjects.map(normalizeSubject);
      const importedFiles = importedSubjects.flatMap((subject) => subject.files || []);
      await Promise.all(importedFiles.map(async (storedFile) => {
        if (storedFile.data) {
          await setStoredFileData(storedFile.id, storedFile.data);
          delete storedFile.data;
        }
      }));
      subjects = importedSubjects;
      links = nextLinks;
      events = nextEvents;
      settings = normalizeSettings(nextSettings);
      if (!Array.isArray(parsed) && parsed.theme) {
        setTheme(["light", "dark", "pink"].includes(parsed.theme) ? parsed.theme : "light");
      }
      if (!Array.isArray(parsed)) {
        setLogo(parsed.logo || "");
      }
      saveSubjects();
      saveLinks();
      saveEvents();
      saveSettings();
      closeModal();
      updateGroupFilter();
      updateEventSubjects();
      renderGroupSettings();
      renderMultiplierSettings();
      renderCreditsSettings();
      renderPassingSettings();
      renderSubjects();
      calculateOverall();
      renderLinks();
      renderEvents();
      closeConfig();
    } catch (err) {
      alert("No fue posible importar el archivo JSON. Comprueba que sea un respaldo válido y que el navegador tenga espacio disponible.");
    } finally {
      els.importFile.value = "";
    }
  };
  reader.readAsText(file);
}

els.subjectForm.addEventListener("submit", handleSubjectSubmit);
els.noteForm.addEventListener("submit", handleNoteSubmit);
els.addNoteToggle.addEventListener("click", handleAddNoteToggle);
els.noteType.addEventListener("change", toggleControlBox);
els.cancelEdit.addEventListener("click", resetNoteForm);
els.modalClose.addEventListener("click", closeModal);
els.modal.addEventListener("click", (event) => {
  if (event.target === els.modal) closeModal();
});
els.modalMode.addEventListener("change", handleModeChange);
els.modalColor.addEventListener("change", handleColorChange);
els.modalTeacher.addEventListener("input", handleTeacherChange);
els.modalSubjectName.addEventListener("change", handleSubjectNameChange);
els.modalSubjectGroup.addEventListener("change", handleSubjectGroupChange);
els.deleteSubject.addEventListener("click", deleteSubject);
els.groupFilter.addEventListener("change", () => {
  if (els.groupFilter.value) {
    localStorage.setItem(selectedGroupKey, els.groupFilter.value);
  } else {
    localStorage.removeItem(selectedGroupKey);
  }
  renderSubjects();
  calculateOverall();
});
els.themeToggle.addEventListener("click", handleThemeToggle);
els.themeMenu.addEventListener("click", (event) => {
  const option = event.target.closest("[data-theme-option]");
  if (!option) return;
  setTheme(option.dataset.themeOption);
  els.themeMenu.classList.remove("is-open");
  els.themeToggle.setAttribute("aria-expanded", "false");
});
document.addEventListener("click", (event) => {
  if (event.target.closest(".theme-menu-wrap")) return;
  els.themeMenu.classList.remove("is-open");
  els.themeToggle.setAttribute("aria-expanded", "false");
});
els.configOpen.addEventListener("click", openConfig);
els.configClose.addEventListener("click", closeConfig);
els.configModal.addEventListener("click", (event) => {
  if (event.target === els.configModal) closeConfig();
});
els.logoFile.addEventListener("change", handleLogoChange);
els.resetLogo.addEventListener("click", handleLogoReset);
els.groupNamesList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-group-save]");
  if (!button) return;
  const oldGroup = button.dataset.groupSave;
  const input = Array.from(els.groupNamesList.querySelectorAll("[data-group-input]"))
    .find((item) => item.dataset.groupInput === oldGroup);
  if (!input) return;
  renameGroup(oldGroup, input.value);
});
els.multiplierList.addEventListener("change", handleMultiplierChange);
els.weightedAverages.addEventListener("change", handleWeightedAveragesToggle);
els.creditsList.addEventListener("change", handleCreditChange);
els.passingEnabled.addEventListener("change", handlePassingSettingsChange);
els.passingScore.addEventListener("change", handlePassingSettingsChange);
els.failColor.addEventListener("input", handlePassingSettingsChange);
els.passColor.addEventListener("input", handlePassingSettingsChange);
els.colorDashboard.addEventListener("change", handlePassingSettingsChange);
els.colorSubjects.addEventListener("change", handlePassingSettingsChange);
els.colorComponents.addEventListener("change", handlePassingSettingsChange);
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
els.fileInput.addEventListener("change", updateFilePickerLabel);
els.cancelFileEdit.addEventListener("click", resetFileForm);
els.filePreviewClose.addEventListener("click", closeFilePreview);
els.filePreviewModal.addEventListener("click", (event) => {
  if (event.target === els.filePreviewModal) closeFilePreview();
});
els.prevMonth.addEventListener("click", () => {
  calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1);
  renderEvents();
});
els.nextMonth.addEventListener("click", () => {
  calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1);
  renderEvents();
});
els.eventsHistoryBack.addEventListener("click", () => {
  selectedEventDate = getToday();
  renderEvents();
});
window.addEventListener("resize", syncEventsPanelHeight);
els.eventForm.addEventListener("submit", handleEventSubmit);

initTheme();
initLogo();
filesMigrationPromise = migrateFilesToIndexedDb();
updateGroupFilter();
updateEventSubjects();
renderGroupSettings();
renderMultiplierSettings();
renderCreditsSettings();
renderPassingSettings();
renderSubjects();
calculateOverall();
toggleControlBox();
renderLinks();
renderEvents();
