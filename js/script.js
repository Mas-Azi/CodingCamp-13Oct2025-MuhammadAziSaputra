// Ambil elemen
const form = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoDate = document.getElementById('todo-date');
const tbody = document.getElementById('todo-body');
const filterBtn = document.getElementById('filter-btn');
const clearAll = document.getElementById('clear-all');

let todos = [];
let showOnlyPending = false;

// ✅ Disable tanggal sebelum hari ini
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
const minDate = `${yyyy}-${mm}-${dd}`;
todoDate.setAttribute('min', minDate);

// Render tampilan tabel
function renderTable() {
  tbody.innerHTML = '';

  let displayedTodos = todos;
  if (showOnlyPending) {
    displayedTodos = todos.filter(t => !t.done);
  }

  if (displayedTodos.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="4" class="empty">No task found</td>`;
    tbody.appendChild(tr);
    return;
  }

  displayedTodos.forEach((todo, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${todo.text}</td>
      <td>${todo.date}</td>
      <td>${todo.done ? '✅ Done' : '🕒 Pending'}</td>
      <td>
        <button onclick="toggleStatus(${index})">Toggle</button>
        <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Toggle status task
function toggleStatus(index) {
  todos[index].done = !todos[index].done;
  renderTable();
}

// Hapus task satuan
function deleteTask(index) {
  if (confirm('Delete this task?')) {
    todos.splice(index, 1);
    renderTable();
  }
}

// Validasi input form
function validateForm(text, date) {
  if (!text.trim()) {
    alert('Please enter a task.');
    return false;
  }

  if (!date) {
    alert('Please choose a due date.');
    return false;
  }

  const today = new Date();
  const selectedDate = new Date(date);
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    alert('Due date cannot be in the past.');
    return false;
  }

  return true;
}

// Submit task baru
form.addEventListener('submit', e => {
  e.preventDefault();

  const text = todoInput.value;
  const date = todoDate.value;

  if (!validateForm(text, date)) return;

  todos.push({ text, date, done: false });
  todoInput.value = '';
  todoDate.value = '';
  renderTable();
});

// Tombol Filter (show pending / all)
filterBtn.addEventListener('click', () => {
  showOnlyPending = !showOnlyPending;
  filterBtn.textContent = showOnlyPending ? 'Show All' : 'Filter';
  renderTable();
});

// Tombol Delete All
clearAll.addEventListener('click', () => {
  if (todos.length === 0) {
    alert('No tasks to delete.');
    return;
  }

  if (confirm('Are you sure you want to delete all tasks?')) {
    todos = [];
    renderTable();
  }
});

// Render awal
renderTable();
