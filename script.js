// Task Manager Application
class TaskManager {
    constructor() {
        this.tasks = [];
        this.editingTaskId = null;
        this.currentFilters = {
            category: 'all',
            priority: 'all',
            showCompleted: true
        };
        this.currentSort = 'deadline';
        this.init();
    }

    init() {
        this.loadTasks();
        this.setupEventListeners();
        this.renderTasks();
        this.updateStatistics();
        this.checkReminders();
        // Check reminders every minute
        setInterval(() => this.checkReminders(), 60000);
    }

    setupEventListeners() {
        const taskForm = document.getElementById('taskForm');
        const cancelEditBtn = document.getElementById('cancelEditBtn');
        const filterCategory = document.getElementById('filterCategory');
        const filterPriority = document.getElementById('filterPriority');
        const sortBy = document.getElementById('sortBy');
        const showCompleted = document.getElementById('showCompleted');

        taskForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        cancelEditBtn.addEventListener('click', () => this.cancelEdit());

        filterCategory.addEventListener('change', (e) => {
            this.currentFilters.category = e.target.value;
            this.renderTasks();
        });

        filterPriority.addEventListener('change', (e) => {
            this.currentFilters.priority = e.target.value;
            this.renderTasks();
        });

        sortBy.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.renderTasks();
        });

        showCompleted.addEventListener('change', (e) => {
            this.currentFilters.showCompleted = e.target.checked;
            this.renderTasks();
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const title = document.getElementById('taskTitle').value.trim();
        const deadline = document.getElementById('taskDeadline').value;
        const priority = document.getElementById('taskPriority').value;
        const category = document.getElementById('taskCategory').value;
        const reminder = document.getElementById('taskReminder').value;

        if (!title) {
            alert('Please enter a task title');
            return;
        }

        if (this.editingTaskId !== null) {
            // Update existing task
            this.updateTask(this.editingTaskId, {
                title,
                deadline: deadline || null,
                priority,
                category,
                reminder: reminder || null
            });
        } else {
            // Create new task
            this.addTask({
                title,
                deadline: deadline || null,
                priority,
                category,
                reminder: reminder || null,
                completed: false
            });
        }

        this.resetForm();
        this.renderTasks();
        this.updateStatistics();
    }

    addTask(taskData) {
        const task = {
            id: Date.now(),
            title: taskData.title,
            deadline: taskData.deadline,
            priority: taskData.priority,
            category: taskData.category,
            reminder: taskData.reminder,
            completed: taskData.completed || false,
            dateCreated: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        return task;
    }

    updateTask(taskId, updates) {
        const taskIndex = this.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates };
            this.saveTasks();
        }
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveTasks();
            this.renderTasks();
            this.updateStatistics();
        }
    }

    toggleTaskComplete(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            this.updateStatistics();
        }
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            this.editingTaskId = taskId;
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDeadline').value = task.deadline || '';
            document.getElementById('taskPriority').value = task.priority;
            document.getElementById('taskCategory').value = task.category;
            document.getElementById('taskReminder').value = task.reminder || '';
            document.getElementById('submitBtn').textContent = 'Update Task';
            document.getElementById('cancelEditBtn').style.display = 'block';
            
            // Scroll to form
            document.querySelector('.task-form-section').scrollIntoView({ behavior: 'smooth' });
        }
    }

    cancelEdit() {
        this.editingTaskId = null;
        this.resetForm();
    }

    resetForm() {
        document.getElementById('taskForm').reset();
        document.getElementById('taskPriority').value = 'Medium';
        document.getElementById('taskCategory').value = 'Personal';
        document.getElementById('submitBtn').textContent = 'Add Task';
        document.getElementById('cancelEditBtn').style.display = 'none';
        this.editingTaskId = null;
    }

    getFilteredAndSortedTasks() {
        let filtered = [...this.tasks];

        // Apply filters
        if (this.currentFilters.category !== 'all') {
            filtered = filtered.filter(t => t.category === this.currentFilters.category);
        }

        if (this.currentFilters.priority !== 'all') {
            filtered = filtered.filter(t => t.priority === this.currentFilters.priority);
        }

        if (!this.currentFilters.showCompleted) {
            filtered = filtered.filter(t => !t.completed);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (this.currentSort) {
                case 'deadline':
                    if (!a.deadline && !b.deadline) return 0;
                    if (!a.deadline) return 1;
                    if (!b.deadline) return -1;
                    return new Date(a.deadline) - new Date(b.deadline);
                
                case 'priority':
                    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                
                case 'dateCreated':
                    return new Date(b.dateCreated) - new Date(a.dateCreated);
                
                case 'title':
                    return a.title.localeCompare(b.title);
                
                default:
                    return 0;
            }
        });

        return filtered;
    }

    renderTasks() {
        const taskList = document.getElementById('taskList');
        const filteredTasks = this.getFilteredAndSortedTasks();

        if (filteredTasks.length === 0) {
            taskList.innerHTML = '<p class="empty-message">No tasks found. Add a new task or adjust your filters!</p>';
            return;
        }

        taskList.innerHTML = filteredTasks.map(task => this.createTaskHTML(task)).join('');
        
        // Attach event listeners
        filteredTasks.forEach(task => {
            const checkbox = document.getElementById(`checkbox-${task.id}`);
            const editBtn = document.getElementById(`edit-${task.id}`);
            const deleteBtn = document.getElementById(`delete-${task.id}`);

            if (checkbox) {
                checkbox.addEventListener('change', () => this.toggleTaskComplete(task.id));
            }
            if (editBtn) {
                editBtn.addEventListener('click', () => this.editTask(task.id));
            }
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
            }
        });
    }

    createTaskHTML(task) {
        const deadlineClass = this.getDeadlineClass(task.deadline);
        const deadlineText = task.deadline 
            ? new Date(task.deadline).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            })
            : 'No deadline';

        return `
            <div class="task-item ${task.completed ? 'completed' : ''}">
                <div class="task-header">
                    <input 
                        type="checkbox" 
                        id="checkbox-${task.id}" 
                        class="task-checkbox"
                        ${task.completed ? 'checked' : ''}
                    >
                    <div class="task-content">
                        <div class="task-title">${this.escapeHtml(task.title)}</div>
                        <div class="task-meta">
                            <span class="task-meta-item">
                                <span class="task-badge badge-priority-${task.priority.toLowerCase()}">
                                    ${task.priority}
                                </span>
                            </span>
                            <span class="task-meta-item">
                                <span class="task-badge badge-category">
                                    ${task.category}
                                </span>
                            </span>
                            ${task.deadline ? `
                                <span class="task-meta-item">
                                    📅 <span class="task-deadline ${deadlineClass}">${deadlineText}</span>
                                </span>
                            ` : ''}
                            ${task.reminder ? `
                                <span class="task-meta-item">
                                    ⏰ Reminder set
                                </span>
                            ` : ''}
                        </div>
                        <div class="task-actions">
                            <button class="btn btn-primary btn-small" id="edit-${task.id}">
                                ✏️ Edit
                            </button>
                            <button class="btn btn-danger btn-small" id="delete-${task.id}">
                                🗑️ Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getDeadlineClass(deadline) {
        if (!deadline) return '';
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const deadlineDate = new Date(deadline);
        deadlineDate.setHours(0, 0, 0, 0);
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'overdue';
        if (diffDays <= 3) return 'due-soon';
        return '';
    }

    updateStatistics() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const highPriority = this.tasks.filter(t => t.priority === 'High' && !t.completed).length;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('pendingTasks').textContent = pending;
        document.getElementById('highPriorityTasks').textContent = highPriority;
    }

    checkReminders() {
        const now = new Date();
        
        this.tasks.forEach(task => {
            if (task.reminder && !task.completed) {
                const reminderTime = new Date(task.reminder);
                const timeDiff = reminderTime - now;
                
                // Show notification if reminder is within the next minute and hasn't been shown
                if (timeDiff > 0 && timeDiff <= 60000 && !task.reminderShown) {
                    this.showReminderNotification(task);
                    task.reminderShown = true;
                    this.saveTasks();
                }
            }
        });
    }

    showReminderNotification(task) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`Task Reminder: ${task.title}`, {
                body: `Don't forget: ${task.title}${task.deadline ? ` (Deadline: ${new Date(task.deadline).toLocaleDateString()})` : ''}`,
                icon: '📋',
                tag: `task-${task.id}`
            });
        } else if ('Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.showReminderNotification(task);
                }
            });
        }
        
        // Also show browser alert as fallback
        alert(`⏰ Reminder: ${task.title}${task.deadline ? `\nDeadline: ${new Date(task.deadline).toLocaleDateString()}` : ''}`);
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
            // Reset reminderShown flags on page load
            this.tasks.forEach(task => {
                if (task.reminder) {
                    const reminderTime = new Date(task.reminder);
                    const now = new Date();
                    if (reminderTime <= now) {
                        task.reminderShown = false;
                    }
                }
            });
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Request notification permission on page load
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// Initialize the Task Manager
const taskManager = new TaskManager();

