const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const themeToggle = document.getElementById('theme-toggle');

// Theme persistence
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.dataset.theme = savedTheme;
themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.dataset.theme === 'dark';
  const next = isDark ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('theme', next);
  themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
  themeToggle.setAttribute('aria-label', next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
});

const todos = [];

function renderTodos() {
  list.innerHTML = '';

  todos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = 'todo-item';
    if (todo.completed) {
      item.classList.add('completed');
    }
    item.dataset.id = todo.id;

    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.className = 'todo-toggle';
    toggleButton.setAttribute(
      'aria-label',
      todo.completed ? `Mark todo as incomplete: ${todo.text}` : `Mark todo as completed: ${todo.text}`,
    );
    toggleButton.textContent = todo.completed ? '☑' : '☐';
    toggleButton.addEventListener('click', () => {
      todo.completed = !todo.completed;
      renderTodos();
    });

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.setAttribute('aria-label', `Delete todo: ${todo.text}`);
    removeButton.textContent = '×';
    removeButton.addEventListener('click', () => {
      const index = todos.findIndex((item) => item.id === todo.id);
      if (index !== -1) {
        todos.splice(index, 1);
        renderTodos();
      }
    });

    item.append(toggleButton, text, removeButton);
    list.appendChild(item);
  });

  emptyState.hidden = todos.length > 0;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const value = input.value.trim();
  if (!value) {
    input.focus();
    return;
  }

  todos.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    text: value,
    completed: false,
  });

  input.value = '';
  input.focus();
  renderTodos();
});

renderTodos();
