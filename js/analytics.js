// analytics.js
import { Storage } from './storage.js';

export function renderAnalytics() {
    const tasks = Storage.getTasks();
    const stats = Storage.getStats(); // From focus sessions

    // 1. Weekly Progress (Mock logic: Assuming 20 tasks/week goal for demo)
    // In a real app, you'd calculate this based on created tasks this week
    const completedTasks = tasks.filter(t => t.completed).length;
    const weeklyGoal = 20; 
    const progress = Math.min((completedTasks / weeklyGoal) * 100, 100);

    document.getElementById('weekly-progress-text').textContent = `${Math.round(progress)}%`;
    document.getElementById('weekly-progress-bar').style.width = `${progress}%`;

    // 2. Total Completed
    document.getElementById('total-completed-count').textContent = completedTasks;
    
    // 3. Most Productive Category (Calculated)
    const catCounts = {};
    tasks.filter(t => t.completed).forEach(t => {
        catCounts[t.category] = (catCounts[t.category] || 0) + 1;
    });

    // You could render a chart here if you had a canvas element in HTML
}
