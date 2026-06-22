const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-task-button');
const todoColumn = document.getElementById('todo');
const container = document.querySelector('.container');
const columns = document.querySelectorAll('.column');
const changeModeBtn = document.getElementById('change-mode');
const priorityInput = document.getElementById('priority-input');
const clearDoneBtn = document.getElementById('clear-done-btn');

function updateCounters() {
    columns.forEach(column => {
        const count = column.querySelectorAll('.task-card').length;
        const badge = column.querySelector('.task-count');
        if(badge) badge.textContent = count;
    });
}

function saveToLocalStorage() {
    const boardState = {todo: [], "in-progress": [], done: []};

    columns.forEach(column => {
        const colId = column.id;
        const taskCards = column.querySelectorAll('.task-card');
        taskCards.forEach(card => {
            const text = card.innerText.replace('✖', '').trim();

            let priority = 'medium';
            if (card.classList.contains('priority-low')) priority = 'low';
            if (card.classList.contains('priority-high')) priority = 'high';

            boardState[colId].push({text, priority});
        });
    });
    localStorage.setItem('myKanbanBoard', JSON.stringify(boardState));
}
function makeTaskDraggable(task) {
    task.addEventListener('dragstart', () => {
        task.classList.add('dragging');
    });

    task.addEventListener('dragend', () => {
        task.classList.remove('dragging');
        updateCounters();
        saveToLocalStorage();
    });

    task.addEventListener('dblclick', function(e) {
        if (e.target.classList.contains('delete-btn')) return;
        if (task.querySelector('.edit-input')) return;
        
        const oldText = task.innerText.replace('✖', '').trim();

        task.innerHTML = `<input type="text" class="edit-input" value="${oldText}">`;

        const input = task.querySelector('.edit-input');
        input.focus();

        let isSaved = false;
        function saveEdit() {
            if (isSaved) return;
            isSaved = true;
            const newText = input.value.trim();

            task.innerHTML = `${newText || oldText} <span class="delete-btn">✖</span>`;
            saveToLocalStorage();

        }
        input.addEventListener('keydown', (event) => {
            if (event.key === "Enter") saveEdit();
        });
        input.addEventListener('blur', saveEdit);
    });
}

clearDoneBtn.addEventListener('click', function() {
    const doneCards = document.querySelectorAll('#done .task-card');
    doneCards.forEach(card => card.remove());
    updateCounters();
    saveToLocalStorage();
});

const existingTasks = document.querySelectorAll('.task-card');
existingTasks.forEach(task => {
    makeTaskDraggable(task);
});

addBtn.addEventListener('click', function() {
    const newTaskText = taskInput.value.trim();

    const priority = priorityInput.value;

    if (newTaskText !== '') {
        let isDuplicate = false;

        const allCurrentTasks = document.querySelectorAll('.task-card');
        allCurrentTasks.forEach(task => {
            const existingText = task.innerText.replace('✖', '').trim();
            if (existingText.toLowerCase() === newTaskText.toLowerCase()) {
                isDuplicate = true;
            }
        });

        if (isDuplicate) {
            alert('This task already exists. Please enter a different tasks.');
        } else {
            const newTask = document.createElement('div');
            newTask.classList.add('task-card', `priority-${priority}`);
            newTask.setAttribute('draggable', 'true');

            newTask.innerHTML = `${newTaskText} <span class="delete-btn">✖</span>`;
            makeTaskDraggable(newTask);
            todoColumn.appendChild(newTask);
            taskInput.value= '';

            updateCounters();
            saveToLocalStorage();
        } 
    } else{
        alert('Please enter a task before adding...');
    }


});

container.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-btn')) {
        event.target.parentElement.remove();

        updateCounters();
        saveToLocalStorage();
    }
});

columns.forEach(column => {
    column.addEventListener('dragover', e => {
        e.preventDefault();

        const afterElement = getDragAfterElement(column, e.clientY);
        const draggable = document.querySelector('.dragging');

        if (afterElement == null) {
            column.appendChild(draggable);
            const clearBtn = column.querySelector('.clear-done-btn');
            if (clearBtn) {
                column.insertBefore(draggable, clearBtn);
            } else {
                column.appendChild(draggable);
            }
        } else {
            column.insertBefore(draggable, afterElement);
        }
    });
});

function getDragAfterElement(column, y) {
    const draggableElements = [...column.querySelectorAll('.task-card:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

changeModeBtn.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    if (isDark) {
        changeModeBtn.textContent = '☀️ Light Mode';
    } else {
        changeModeBtn.textContent = '🌙 Dark Mode';
    }
    localStorage.setItem('kanbanDarkMode', isDark);
});

function loadFromLocalStorage() {
    const savedData = localStorage.getItem('myKanbanBoard');
    const savedTheme = localStorage.getItem('kanbanDarkMode');

    if (savedTheme === 'true') {
        document.body.classList.add('dark-mode');
        changeModeBtn.textContent = '☀️ Light Mode';
    }

    if (savedData) {
        columns.forEach(col => {
            col.querySelectorAll('.task-card').forEach(c => c.remove());
        });

        const boardState = JSON.parse(savedData);
        Object.keys(boardState).forEach(colId => {
            const targetColumn =document.getElementById(colId);
            boardState[colId].forEach(taskData => {
                const element = document.createElement('div');
                element.classList.add('task-card', `priority-${taskData.priority}`);
                element.setAttribute('draggable', 'true');
                element.innerHTML = `${taskData.text} <span class="delete-btn">✖</span>`;

                makeTaskDraggable(element);

                const clearBtn = targetColumn.querySelector('.clear-done-btn');
                if (clearBtn) {
                    targetColumn.insertBefore(element, clearBtn);
                } else {
                    targetColumn.appendChild(element);
                }
            });
        });
    } else {
        const initialTasks = document.querySelectorAll('.task-card');
        initialTasks.forEach(task => {
            task.classList.add('priority-medium');
        });
    }
    updateCounters()
}

loadFromLocalStorage();