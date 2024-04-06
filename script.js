const inputBox = document.getElementById("input-box");
const taskList = document.getElementById("task-list");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");

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
      <span class="edit-btn">edit</span>
      <span class="delete-btn">delete</span>`;
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
  <span class="edit-btn">edit</span>
  <span class="delete-btn">delete</span>`;
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
