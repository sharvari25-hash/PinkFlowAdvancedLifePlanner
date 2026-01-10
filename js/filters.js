// filters.js
import { TaskManager } from './tasks.js';

export const FilterManager = {
    init: () => {
        renderFilters();
    }
};

const filters = [
    { id: 'today', label: 'Today', icon: 'fa-sun', color: 'text-pink-500' },
    { id: 'upcoming', label: 'Upcoming', icon: 'fa-calendar-alt', color: 'text-purple-500' },
    { id: 'important', label: 'Important', icon: 'fa-star', color: 'text-yellow-400' },
    { id: 'completed', label: 'Completed', icon: 'fa-check-circle', color: 'text-green-500' },
    { id: 'overdue', label: 'Overdue', icon: 'fa-exclamation-circle', color: 'text-red-500' }
];

function renderFilters() {
    const nav = document.getElementById('filter-nav');
    nav.innerHTML = '';

    filters.forEach(filter => {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="#" class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 transition-colors text-gray-600 font-medium group" onclick="window.setFilter('${filter.id}', this)">
                <i class="fas ${filter.icon} ${filter.color} w-5 group-hover:scale-110 transition-transform"></i>
                ${filter.label}
            </a>
        `;
        nav.appendChild(li);
    });

    // Set active class on first load
    // nav.firstElementChild.querySelector('a').classList.add('bg-white/60', 'text-pink-600', 'shadow-sm');
}

window.setFilter = (view, el) => {
    // Remove active class from all
    document.querySelectorAll('#filter-nav a').forEach(a => {
        a.classList.remove('bg-white/60', 'text-pink-600', 'shadow-sm');
    });
    // Add to clicked
    el.classList.add('bg-white/60', 'text-pink-600', 'shadow-sm');
    
    TaskManager.setView(view);
};
