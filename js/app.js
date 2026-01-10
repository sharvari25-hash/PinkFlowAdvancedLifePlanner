// app.js
import { TaskManager } from './tasks.js';
import { FilterManager } from './filters.js';
import { FocusManager } from './focus.js';
import { renderAnalytics } from './analytics.js';
import { Storage } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Modules
    TaskManager.init();
    FilterManager.init();
    FocusManager.init();
    renderAnalytics();
    
    setupUI();
    checkTheme();
});

function setupUI() {
    // Modals
    const modal = document.getElementById('modal-task');
    const btnAdd = document.getElementById('btn-add-task');
    const btnClose = document.getElementById('btn-close-modal');
    const btnCancel = document.getElementById('btn-cancel-task');
    const form = document.getElementById('task-form');

    // Open Modal
    btnAdd.addEventListener('click', () => {
        modal.classList.remove('hidden');
        document.getElementById('task-date').valueAsDate = new Date();
    });

    // Close Modal
    const closeModal = () => modal.classList.add('hidden');
    btnClose.addEventListener('click', closeModal);
    btnCancel.addEventListener('click', closeModal);

    // Form Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const taskData = {
            title: document.getElementById('task-title').value,
            description: document.getElementById('task-desc').value,
            category: document.getElementById('task-category').value,
            priority: document.getElementById('task-priority').value,
            dueDate: document.getElementById('task-date').value,
            color: document.querySelector('input[name="task-color"]:checked').value
        };

        TaskManager.addTask(taskData);
        form.reset();
        closeModal();
    });

    // Focus Mode Overlay
    const focusOverlay = document.getElementById('focus-overlay');
    const btnFocus = document.getElementById('btn-focus-mode');
    const btnCloseFocus = document.getElementById('btn-close-focus');

    btnFocus.addEventListener('click', () => {
        focusOverlay.classList.remove('hidden');
    });

    btnCloseFocus.addEventListener('click', () => {
        focusOverlay.classList.add('hidden');
    });

    // View Toggles
    const listView = document.getElementById('view-list');
    const kanbanView = document.getElementById('view-kanban');
    const listContainer = document.getElementById('task-list-container');
    const kanbanContainer = document.getElementById('kanban-container');

    listView.addEventListener('click', () => {
        listView.classList.add('text-pink-600', 'bg-white/50');
        listView.classList.remove('text-gray-400');
        kanbanView.classList.remove('text-pink-600', 'bg-white/50');
        kanbanView.classList.add('text-gray-400');
        
        listContainer.classList.remove('hidden');
        kanbanContainer.classList.add('hidden');
        kanbanContainer.classList.remove('grid');
    });

    kanbanView.addEventListener('click', () => {
        kanbanView.classList.add('text-pink-600', 'bg-white/50');
        kanbanView.classList.remove('text-gray-400');
        listView.classList.remove('text-pink-600', 'bg-white/50');
        listView.classList.add('text-gray-400');

        listContainer.classList.add('hidden');
        kanbanContainer.classList.remove('hidden');
        kanbanContainer.classList.add('grid');
    });

    // Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const current = Storage.getTheme();
        const newTheme = current === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });
}

function checkTheme() {
    const theme = Storage.getTheme();
    setTheme(theme);
}

function setTheme(theme) {
    const body = document.getElementById('app-body');
    const icon = document.querySelector('#theme-toggle i');
    
    if (theme === 'dark') {
        body.classList.remove('from-pink-400', 'via-rose-400', 'to-purple-400');
        body.classList.add('bg-gray-900', 'text-gray-100');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        body.classList.add('from-pink-400', 'via-rose-400', 'to-purple-400');
        body.classList.remove('bg-gray-900', 'text-gray-100');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
    Storage.saveTheme(theme);
}
