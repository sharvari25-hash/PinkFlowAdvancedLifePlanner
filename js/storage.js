// storage.js

const KEYS = {
    TASKS: 'pinkflow_tasks',
    THEME: 'pinkflow_theme',
    FOCUS_SESSIONS: 'pinkflow_sessions',
    USER_PREFS: 'pinkflow_prefs'
};

const defaultTasks = [
    {
        id: 1,
        title: "Welcome to PinkFlow! 🌸",
        description: "Explore the features: Add tasks, drag & drop, and use Focus Mode.",
        category: "Personal",
        priority: "High",
        dueDate: new Date().toISOString().split('T')[0],
        completed: false,
        color: "pink",
        createdAt: Date.now()
    }
];

export const Storage = {
    getTasks: () => {
        const tasks = localStorage.getItem(KEYS.TASKS);
        return tasks ? JSON.parse(tasks) : defaultTasks;
    },

    saveTasks: (tasks) => {
        localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
    },

    getTheme: () => {
        return localStorage.getItem(KEYS.THEME) || 'light';
    },

    saveTheme: (theme) => {
        localStorage.setItem(KEYS.THEME, theme);
    },

    getStats: () => {
        const stats = localStorage.getItem(KEYS.FOCUS_SESSIONS);
        return stats ? JSON.parse(stats) : { sessions: 0, totalMinutes: 0 };
    },

    saveStats: (stats) => {
        localStorage.setItem(KEYS.FOCUS_SESSIONS, JSON.stringify(stats));
    }
};
