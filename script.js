let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const taskList = document.getElementById('task-list');
const totalTasksCount = document.getElementById('total-tasks-count');
const taskInput = document.getElementById('task-input');
const dueDateInput = document.getElementById('due-date-input');
const moodSelect = document.getElementById('mood-select');
const addTaskButton = document.getElementById('add-task-btn');
const modal = document.getElementById('modal');
const closeModalButton = document.querySelector('.close');
const addTask = document.getElementById('add-task');
const searchInput = document.getElementById('search');
const darkModeToggle = document.getElementById('dark-mode-toggle');

addTaskButton.addEventListener('click', () => {
    modal.style.display = 'block';
});

closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

addTask.addEventListener('click', addTaskToList);

function addTaskToList() {
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    const mood = moodSelect.value;
    const priority = document.querySelector('input[name="priority"]:checked')?.value;

    if (taskText && dueDate && priority) {
        tasks.push({ text: taskText, completed: false, dueDate, mood, priority });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        resetModal();
        showNotification("Task added successfully!");
        modal.style.display = 'none';
    } else {
        alert("Please enter a task, select a due date, and choose a priority.");
    }
}

function resetModal() {
    taskInput.value = '';
    dueDateInput.value = '';
    moodSelect.value = 'happy';
    document.querySelector('input[name="priority"]:checked').checked = false; // Reset priority
}

function renderTasks(filter = '') {
    taskList.innerHTML = '';
    const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(filter.toLowerCase()));
    totalTasksCount.innerText = filteredTasks.length;

    filteredTasks.forEach((task, index) => {
        const listItem = document.createElement('div');
        listItem.className = `task ${task.priority.toLowerCase()} ${task.completed ? 'completed' : ''}`;
        listItem.innerHTML = `
            <div>
                <strong>${task.text}</strong>
                <p>Due: ${task.dueDate} | Mood: ${task.mood}</p>
            </div>
            <div>
                <button class="complete-task">${task.completed ? '✅' : '✔️'}</button>
                <button class="remove-task">🗑️</button>
            </div>
        `;

        const removeButton = listItem.querySelector('.remove-task');
        removeButton.addEventListener('click', () => {
            tasks.splice(index, 1);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
            showNotification("Task removed successfully!");
        });

        const completeButton = listItem.querySelector('.complete-task');
        completeButton.addEventListener('click', () => {
            task.completed = !task.completed;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
            showNotification(`Task marked as ${task.completed ? 'completed' : 'incomplete'}.`);
        });

        taskList.appendChild(listItem);
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

searchInput.addEventListener('input', (event) => {
    renderTasks(event.target.value);
});

darkModeToggle.addEventListener('click', toggleDarkMode);

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

renderTasks();
