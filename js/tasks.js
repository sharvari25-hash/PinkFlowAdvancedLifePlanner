// tasks.js
import { Storage } from './storage.js';
import { renderAnalytics } from './analytics.js';

let tasks = Storage.getTasks();
let currentView = 'today'; // today, upcoming, important, completed, overdue

// DOM Elements
const taskListContainer = document.getElementById('task-list-container');
const kanbanTodo = document.getElementById('kanban-todo');
const kanbanInProgress = document.getElementById('kanban-inprogress');
const kanbanDone = document.getElementById('kanban-done');
const headerTaskCount = document.getElementById('header-task-count');
const viewTitle = document.getElementById('current-view-title');

// Icons Mapping
const icons = {
    Personal: '<i class="fas fa-home text-pink-500"></i>',
    Work: '<i class="fas fa-briefcase text-purple-500"></i>',
    Study: '<i class="fas fa-book text-blue-500"></i>',
    Health: '<i class="fas fa-heartbeat text-red-500"></i>',
    Finance: '<i class="fas fa-coins text-yellow-500"></i>'
};

const priorityColors = {
    Low: 'bg-green-100 text-green-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    High: 'bg-red-100 text-red-700'
};

const colorBorders = {
    pink: 'border-l-pink-500',
    blue: 'border-l-blue-500',
    green: 'border-l-green-500',
    purple: 'border-l-purple-500'
};

export const TaskManager = {
    init: () => {
        renderTasks();
    },

    getTasks: () => tasks,

    addTask: (taskData) => {
        const newTask = {
            id: Date.now(),
            ...taskData,
            completed: false,
            createdAt: Date.now(),
            status: 'todo' // for kanban
        };
        tasks.push(newTask);
        saveAndRender();
        showToast('Task added successfully! 🌸');
    },

    updateTask: (id, updates) => {
        tasks = tasks.map(t => t.id == id ? { ...t, ...updates } : t);
        saveAndRender();
    },

    deleteTask: (id) => {
        tasks = tasks.filter(t => t.id != id);
        saveAndRender();
        showToast('Task deleted.');
    },

    toggleComplete: (id) => {
        const task = tasks.find(t => t.id == id);
        if (task) {
            task.completed = !task.completed;
            task.status = task.completed ? 'done' : 'todo';
            saveAndRender();
            if (task.completed) showToast('Great job! Task completed! 🎉');
        }
    },

    setView: (view) => {
        currentView = view;
        const titles = {
            today: "Today's Tasks",
            upcoming: "Upcoming Tasks",
            important: "Important Tasks",
            completed: "Completed History",
            overdue: "Overdue Tasks"
        };
        viewTitle.textContent = titles[view] || 'All Tasks';
        renderTasks();
    },

    moveTaskKanban: (id, newStatus) => {
        const task = tasks.find(t => t.id == id);
        if (task) {
            task.status = newStatus;
            task.completed = newStatus === 'done';
            saveAndRender();
        }
    }
};

function saveAndRender() {
    Storage.saveTasks(tasks);
    renderTasks();
    renderAnalytics(); // Update stats
}

function filterTasks() {
    const today = new Date().toISOString().split('T')[0];
    
    return tasks.filter(t => {
        if (currentView === 'today') return t.dueDate === today && !t.completed;
        if (currentView === 'upcoming') return t.dueDate > today && !t.completed;
        if (currentView === 'important') return t.priority === 'High' && !t.completed;
        if (currentView === 'completed') return t.completed;
        if (currentView === 'overdue') return t.dueDate < today && !t.completed;
        return true;
    });
}

function renderTasks() {
    const filtered = filterTasks();
    
    // Update Header Count
    const todayCount = tasks.filter(t => t.dueDate === new Date().toISOString().split('T')[0] && !t.completed).length;
    headerTaskCount.textContent = `You have ${todayCount} tasks today`;

    // Clear List
    taskListContainer.innerHTML = '';

    if (filtered.length === 0) {
        taskListContainer.innerHTML = `
            <div class="text-center py-10 text-gray-400">
                <i class="fas fa-cookie-bite text-4xl mb-3 text-pink-200"></i>
                <p>No tasks found in this view.</p>
            </div>
        `;
    } else {
        filtered.forEach(task => {
            const el = createTaskElement(task);
            taskListContainer.appendChild(el);
        });
    }

    // Render Kanban (All non-completed or recent completed)
    renderKanban();
}

function setupKanbanListeners() {
    const columns = [kanbanTodo, kanbanInProgress, kanbanDone];
    
    columns.forEach(col => {
        col.addEventListener('dragover', (e) => {
            e.preventDefault();
            col.classList.add('bg-white/20');
        });

        col.addEventListener('dragleave', () => {
            col.classList.remove('bg-white/20');
        });

        col.addEventListener('drop', (e) => {
            e.preventDefault();
            col.classList.remove('bg-white/20');
            const taskId = e.dataTransfer.getData('text/plain');
            const newStatus = col.getAttribute('data-status') || col.parentElement.getAttribute('data-status'); // Handles dropping on children
            
            // Because the drop target might be the container's child, we ensure we get the right status
            // The col ID or dataset is safer.
            let targetStatus;
            if (col.id === 'kanban-todo') targetStatus = 'todo';
            else if (col.id === 'kanban-inprogress') targetStatus = 'inprogress';
            else if (col.id === 'kanban-done') targetStatus = 'done';

            if (targetStatus && taskId) {
                TaskManager.moveTaskKanban(taskId, targetStatus);
            }
        });
    });
}

// Call once on init
setupKanbanListeners();

function createTaskElement(task) {
    const div = document.createElement('div');
    div.className = `glass p-4 rounded-xl flex items-center justify-between group hover:bg-white/40 transition-all border-l-4 ${colorBorders[task.color] || 'border-l-gray-300'} animate-slide-in`;
    div.innerHTML = `
        <div class="flex items-center gap-4">
            <input type="checkbox" class="task-checkbox w-5 h-5 rounded-full border-2 border-pink-300 text-pink-500 focus:ring-pink-400 cursor-pointer" ${task.completed ? 'checked' : ''} onchange="window.toggleTask(${task.id})">
            
            <div class="${task.completed ? 'line-through text-gray-400' : ''}">
                <h4 class="font-bold text-gray-800">${task.title}</h4>
                <div class="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <span class="flex items-center gap-1">${icons[task.category] || ''} ${task.category}</span>
                    <span>•</span>
                    <span class="flex items-center gap-1"><i class="far fa-calendar"></i> ${task.dueDate || 'No date'}</span>
                    <span class="px-2 py-0.5 rounded-full ${priorityColors[task.priority]} font-semibold text-[10px] uppercase">${task.priority}</span>
                </div>
            </div>
        </div>

        <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onclick="window.deleteTask(${task.id})" class="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `;
    
    // Bind events manually if needed, but using window globals for simplicity with inline HTML
    return div;
}

function renderKanban() {
    kanbanTodo.innerHTML = '';
    kanbanInProgress.innerHTML = '';
    kanbanDone.innerHTML = '';

    tasks.forEach(task => {
        const el = createKanbanCard(task);
        if (task.status === 'todo' || !task.status) kanbanTodo.appendChild(el);
        else if (task.status === 'inprogress') kanbanInProgress.appendChild(el);
        else if (task.status === 'done') kanbanDone.appendChild(el);
    });
}

function createKanbanCard(task) {
    const div = document.createElement('div');
    div.className = `bg-white p-3 rounded-lg shadow-sm border border-gray-100 cursor-move hover:shadow-md transition-all`;
    div.draggable = true;
    div.dataset.id = task.id;
    
    div.innerHTML = `
        <h4 class="font-bold text-sm text-gray-800 mb-1">${task.title}</h4>
        <div class="flex justify-between items-center">
            <span class="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">${task.category}</span>
            ${task.priority === 'High' ? '<i class="fas fa-flag text-red-400 text-xs"></i>' : ''}
        </div>
    `;
    
    div.addEventListener('dragstart', (e) => {
        div.classList.add('dragging');
        e.dataTransfer.setData('text/plain', task.id);
    });

    div.addEventListener('dragend', () => {
        div.classList.remove('dragging');
    });

    return div;
}

// Global exposure for inline events
window.toggleTask = (id) => TaskManager.toggleComplete(id);
window.deleteTask = (id) => TaskManager.deleteTask(id);

function showToast(msg) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'glass-dark text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 text-sm font-medium animate-slide-in';
    toast.innerHTML = `<i class="fas fa-bell text-pink-300"></i> ${msg}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
