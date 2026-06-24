const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const todoStats = document.getElementById('todo-stats');
const statsText = document.getElementById('stats-text');
const clearCompleted = document.getElementById('clear-completed');
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
    toggleButton.textContent = todo.completed ? '✓' : '';
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
      item.classList.add('removing');
      item.addEventListener('animationend', () => {
        const index = todos.findIndex((t) => t.id === todo.id);
        if (index !== -1) {
          todos.splice(index, 1);
          renderTodos();
        }
      }, { once: true });
    });

    item.append(toggleButton, text, removeButton);
    list.appendChild(item);
  });

  updateStats();
}

function updateStats() {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;

  emptyState.hidden = total > 0;
  todoStats.hidden = total === 0;

  if (total > 0) {
    statsText.textContent = `${completed} of ${total} task${total === 1 ? '' : 's'} completed`;
  }
}

clearCompleted.addEventListener('click', () => {
  const completedItems = list.querySelectorAll('.todo-item.completed');
  if (completedItems.length === 0) return;

  let remaining = completedItems.length;
  completedItems.forEach((item) => {
    item.classList.add('removing');
    item.addEventListener('animationend', () => {
      const id = item.dataset.id;
      const index = todos.findIndex((t) => t.id === id);
      if (index !== -1) {
        todos.splice(index, 1);
      }
      remaining -= 1;
      if (remaining === 0) {
        renderTodos();
      }
    }, { once: true });
  });
});

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
