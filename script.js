const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');
const filters = document.querySelectorAll('.filter');
const count = document.getElementById('count');
const clearCompleted = document.getElementById('clearCompleted');

const STORAGE_KEY = 'todo-web.tasks';

let tasks = [];
let currentFilter = 'all';

function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  tasks = saved ? JSON.parse(saved) : [];
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function updateCount() {
  const activeCount = tasks.filter((task) => !task.done).length;
  const label = activeCount === 1 ? 'item' : 'items';
  count.textContent = `${activeCount} ${label}`;
}

function renderTasks() {
  taskList.innerHTML = '';
  const filtered = tasks.filter((task) => {
    if (currentFilter === 'active') return !task.done;
    if (currentFilter === 'done') return task.done;
    return true;
  });

  filtered.forEach((task) => {
    const li = document.createElement('li');
    li.className = `task${task.done ? ' done' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => {
      task.done = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = task.text;

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = 'Delete';
    remove.addEventListener('click', () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    li.append(checkbox, label, remove);
    taskList.append(li);
  });

  updateCount();
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.unshift({
    id: crypto.randomUUID(),
    text,
    done: false,
  });

  taskInput.value = '';
  saveTasks();
  renderTasks();
}

addButton.addEventListener('click', addTask);

taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTask();
  }
});

filters.forEach((button) => {
  button.addEventListener('click', () => {
    filters.forEach((btn) => btn.classList.remove('is-active'));
    button.classList.add('is-active');
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

clearCompleted.addEventListener('click', () => {
  tasks = tasks.filter((task) => !task.done);
  saveTasks();
  renderTasks();
});

loadTasks();
renderTasks();
