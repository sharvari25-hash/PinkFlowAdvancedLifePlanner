// focus.js
import { Storage } from './storage.js';

let timer;
let timeLeft = 25 * 60; // 25 minutes
let isRunning = false;
let isSession = true; // true = focus, false = break

const display = document.getElementById('timer-display');
const statusText = document.getElementById('focus-status');
const toggleBtn = document.getElementById('btn-timer-toggle');

export const FocusManager = {
    init: () => {
        setupListeners();
    },
    
    toggleTimer: () => {
        if (isRunning) {
            clearInterval(timer);
            toggleBtn.innerHTML = '<i class="fas fa-play ml-1"></i>';
            isRunning = false;
        } else {
            timer = setInterval(tick, 1000);
            toggleBtn.innerHTML = '<i class="fas fa-pause"></i>';
            isRunning = true;
        }
    },

    resetTimer: () => {
        clearInterval(timer);
        isRunning = false;
        isSession = true;
        timeLeft = 25 * 60;
        updateDisplay();
        toggleBtn.innerHTML = '<i class="fas fa-play ml-1"></i>';
        statusText.textContent = "Time to focus!";
        statusText.className = "text-xl text-pink-200";
    }
};

function setupListeners() {
    document.getElementById('btn-timer-toggle').addEventListener('click', FocusManager.toggleTimer);
    document.getElementById('btn-timer-reset').addEventListener('click', FocusManager.resetTimer);
}

function tick() {
    if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
    } else {
        // Timer finished
        clearInterval(timer);
        isRunning = false;
        toggleBtn.innerHTML = '<i class="fas fa-play ml-1"></i>';
        
        if (isSession) {
            // Focus session done
            const stats = Storage.getStats();
            stats.sessions++;
            stats.totalMinutes += 25;
            Storage.saveStats(stats);
            
            // Switch to break
            isSession = false;
            timeLeft = 5 * 60;
            statusText.textContent = "Great job! Take a short break ☕";
            statusText.className = "text-xl text-green-300 font-bold";
            // Play sound or notification here
            alert("Focus session complete! Take a break.");
        } else {
            // Break done
            isSession = true;
            timeLeft = 25 * 60;
            statusText.textContent = "Back to work! 🚀";
            statusText.className = "text-xl text-pink-200";
            alert("Break over! Time to focus.");
        }
        updateDisplay();
    }
}

function updateDisplay() {
    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const s = (timeLeft % 60).toString().padStart(2, '0');
    display.textContent = `${m}:${s}`;
}
