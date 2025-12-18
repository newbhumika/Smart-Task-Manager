# Smart Task Manager

A modern, single-page task management application built with HTML, CSS, and JavaScript. It helps you create, organize, prioritize, and track your tasks efficiently – now with built‑in **light/dark mode**.

## Features

### Core Features ✅
- **Add New Tasks** - Create tasks with title, deadline, priority, and category
- **Edit Tasks** - Update existing tasks with a simple click
- **Delete Tasks** - Remove tasks you no longer need
- **Mark as Completed** - Check off tasks when done
- **Set Deadlines** - Add due dates to your tasks
- **Assign Priorities** - Categorize tasks as Low, Medium, or High priority

### Extra Features ✨
- **Task Categories** - Organize tasks by Personal, Work, or School
- **Sorting** - Sort tasks by deadline, priority, date created, or title
- **Filtering** - Filter tasks by category, priority, or completion status
- **Reminder Notifications** - Set reminders for important tasks (uses the browser Notification API + alerts)
- **Persistent Storage** - All tasks are saved in the browser's `localStorage`
- **Statistics Dashboard** - View total, completed, pending, and high-priority tasks
- **Visual Indicators** - Color-coded priorities and deadline warnings (overdue / due soon)
- **Light & Dark Mode** - Toggle button to switch themes, preference saved in `localStorage`

## How to Run and Use

1. **Open the application**
   - Open `index.html` directly in your web browser (double-click or drag into a tab).
   - No installation, build step, or server is required.

2. **Switch between light and dark mode**
   - Use the **theme button** in the header.
   - The app remembers your choice using `localStorage` and also respects system dark-mode preference on first load.

3. **Add a task**
   - Enter a **title** (required).
   - Optionally set a **deadline**, **priority**, **category**, and **reminder**.
   - Click **“Add Task”**.

4. **Manage existing tasks**
   - **Complete**: Use the checkbox next to a task.
   - **Edit**: Click **“Edit”**, modify the fields in the form, then click **“Update Task”**.
   - **Cancel edit**: Click **“Cancel Edit”** to reset the form.
   - **Delete**: Click **“Delete”** and confirm.

5. **Filter and sort**
   - Filter by **category** (Personal, Work, School) and **priority** (Low/Medium/High).
   - Sort by **deadline**, **priority**, **date created**, or **title**.
   - Toggle **“Show Completed”** to hide/show completed tasks.

6. **Reminders**
   - While creating or editing a task, set a **reminder datetime**.
   - The browser may ask for **notification permission**.
   - When the time is near, the app shows a **notification (if allowed)** and an **alert** as a fallback.

## Technical Details

### Data Structure
Tasks are stored as JavaScript objects in an array with this shape:
```javascript
{
  id: 1234567890,
  title: "Finish resume",
  deadline: "2025-02-10",
  priority: "High",
  category: "Work",
  reminder: "2025-02-09T10:00:00",
  completed: false,
  dateCreated: "2025-01-15T12:00:00.000Z"
}
```

### Storage
- Tasks are automatically saved to the browser's `localStorage` under a key (e.g., `"tasks"`).
- Theme preference is saved under a separate key (e.g., `"stm-theme"`).
- Data persists between sessions; no external database is required.

### Theme System
- Uses CSS custom properties (`--primary-color`, `--bg-color`, etc.) defined in `:root`.
- Dark theme overrides are applied via `body[data-theme="dark"]`.
- `theme.js`:
  - Reads stored theme or falls back to `prefers-color-scheme`.
  - Sets `data-theme="light"` or `"dark"` on `<body>`.
  - Updates the toggle button icon and label.

### Browser Compatibility
- Works in all modern browsers (Chrome, Firefox, Edge, Safari).
- Requires JavaScript enabled.
- Notification API support is recommended for reminders (fallback alerts are still shown).

## CS Concepts Demonstrated

- **CRUD Operations** - Create, Read, Update, Delete tasks.
- **Arrays & Objects** - Task list managed as an array of objects.
- **State Management** - Filters, sorting, completion state, and edit state.
- **Event Handling** - Form submissions, button clicks, checkbox changes.
- **Local Storage** - Persistent data storage for tasks and theme.
- **DOM Manipulation** - Rendering task cards, statistics, and UI updates.
- **Object-Oriented Programming** - `TaskManager` class encapsulating logic.
- **Algorithms** - Sorting tasks and filtering based on user-selected criteria.

## File Structure

```
Task management/
├── index.html   # Single-page app: layout + task manager UI
├── styles.css   # Styling, layout, and theme (light/dark) variables
├── script.js    # Task management logic (TaskManager class, CRUD, filters, reminders)
├── theme.js     # Theme toggle + persistence (light/dark)
└── README.md    # Project documentation
```

## Possible Extensions

Some ideas you can implement next:
- Task search bar (by title / keyword)
- Tags or labels for tasks
- Subtasks or checklists inside each task
- Export/import tasks as JSON or CSV
- Recurring tasks (daily/weekly/monthly)
- Keyboard shortcuts for power users

## License

This project is open source and available for educational purposes.

---

**Enjoy managing your tasks! 🚀**
