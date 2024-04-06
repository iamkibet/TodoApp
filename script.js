const inputBox = document.getElementById("input-box");
const taskList = document.getElementById("task-list");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");
const todoBtn = document.getElementById("todobtn");
const notesBtn = document.getElementById("notesbtn");
const todoSection = document.getElementById("todosection");
const notesSection = document.getElementById("notessection");
const background = document.getElementById("background");
const btnEl = document.getElementById("btn");
const appEl = document.getElementById("app");

getNotes().forEach((note) => {
  const noteEl = createNoteEl(note.id, note.content);
  appEl.insertBefore(noteEl, btnEl);
});

function createNoteEl(id, content) {
  const element = document.createElement("textarea");
  element.classList.add("note");
  element.placeholder = "Click to write";
  element.value = content;

  element.addEventListener("dblclick", () => {
    const warning = confirm("Delete this note?");
    if (warning) {
      deleteNote(id, element);
    }
  });

  element.addEventListener("input", () => {
    updateNote(id, element.value);
  });

  return element;
}
function deleteNote(id, element) {
  const notes = getNotes().filter((note) => note.id != id);
  SaveNote(notes);
  appEl.removeChild(element);
}

function updateNote(id, content) {
  const notes = getNotes();
  const taget = notes.filter((note) => note.id == id)[0];
  taget.content = content;
  SaveNote(notes);
}

function addNote() {
  const notes = getNotes();
  const noteObj = {
    id: Math.floor(Math.random() * 100000),
    content: "",
  };

  const noteEl = createNoteEl(noteObj.id, noteObj.content);

  appEl.insertBefore(noteEl, btnEl);

  notes.push(noteObj);

  SaveNote(notes);
}

function SaveNote(note) {
  localStorage.setItem("note-app", JSON.stringify(note));
}

function getNotes() {
  return JSON.parse(localStorage.getItem("note-app") || "[]");
}
btnEl.addEventListener("click", addNote);

todoBtn.addEventListener("click", function () {
  todoSection.classList.remove("hidden");
  notesSection.classList.add("hidden");
});

notesBtn.addEventListener("click", () => {
  notesSection.classList.remove("hidden");
  todoSection.classList.add("hidden");
});
// Update counters function
function updateCounters() {
  const completedTasks = document.querySelectorAll(".completed").length;
  const uncompletedTasks =
    document.querySelectorAll("li:not(.completed)").length;

  completedCounter.textContent = completedTasks;
  uncompletedCounter.textContent = uncompletedTasks;
}

// Function to save tasks to local storage
function saveTasksToLocalStorage() {
  const tasks = [];
  const taskElements = document.querySelectorAll("#task-list li");
  taskElements.forEach(function (taskElement) {
    const taskText = taskElement.querySelector("span").textContent;
    const isCompleted = taskElement.classList.contains("completed");
    tasks.push({ text: taskText, completed: isCompleted });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to load tasks from local storage
function loadTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    const tasks = JSON.parse(storedTasks);

    tasks.forEach(function (task) {
      const li = document.createElement("li");
      li.innerHTML = `<label>
        <input type="checkbox" ${task.completed ? "checked" : ""} />
        <span>${task.text}</span>
      </label>
      <span class="edit-btn">Edit</span>
      <span class="delete-btn">Delete</span>`;
      taskList.appendChild(li);

      const checkbox = li.querySelector("input");
      checkbox.addEventListener("click", function () {
        li.classList.toggle("completed", checkbox.checked);
        saveTasksToLocalStorage();
        updateCounters();
      });

      const editBtn = li.querySelector(".edit-btn");
      editBtn.addEventListener("click", function () {
        const update = prompt("Update task:", task.text);
        if (update !== null) {
          task.text = update;
          li.querySelector("span").textContent = update;
          saveTasksToLocalStorage();
          updateCounters();
        }
      });

      const deleteBtn = li.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", function () {
        if (confirm("Are you sure you want to delete this task?")) {
          li.remove();
          saveTasksToLocalStorage();
          updateCounters();
        }
      });
    });
  }
}

// Load tasks from local storage when the page loads
window.addEventListener("load", loadTasksFromLocalStorage);

// Add task function
function addTask() {
  const task = inputBox.value.trim();
  if (!task) {
    alert("Please enter a task.");
    return;
  }

  const li = document.createElement("li");
  li.innerHTML = `<label>
    <input type="checkbox" />
    <span>${task}</span>
  </label>
  <span class="edit-btn">Edit</span>
  <span class="delete-btn">Delete</span>`;
  taskList.appendChild(li);
  inputBox.value = "";

  const taskSpan = li.querySelector("span");

  const checkbox = li.querySelector("input");
  checkbox.addEventListener("click", function () {
    li.classList.toggle("completed", checkbox.checked);
    saveTasksToLocalStorage();
    updateCounters();
  });

  uncompletedCounter.textContent++;

  const editBtn = li.querySelector(".edit-btn");
  editBtn.addEventListener("click", function () {
    const update = prompt("Update task:", taskSpan.textContent);
    if (update !== null) {
      taskSpan.textContent = update;
      li.classList.remove("completed");
      checkbox.checked = false;
      saveTasksToLocalStorage();
      updateCounters();
    }
  });

  const deleteBtn = li.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", function () {
    if (confirm("Are you sure you want to delete this task?")) {
      li.remove();
      saveTasksToLocalStorage();
      updateCounters();
    }
  });
}
