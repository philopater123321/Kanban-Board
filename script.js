const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-task-button');
const todoColumn = document.getElementById('todo');
const container = document.querySelector('.container');
const columns = document.querySelectorAll('.column');

function makeTaskDraggable(task) {
    task.addEventListener('dragstart', () => {
        task.classList.add('dragging');
    });

    task.addEventListener('dragend', () => {
        task.classList.remove('dragging');
    });

}

const existingTasks = document.querySelectorAll('.task-card');
existingTasks.forEach(task => {
    makeTaskDraggable(task);
});
addBtn.addEventListener('click', function() {

    if (taskInput.value.trim() !== '') {
        const newTask = document.createElement('div');
        newTask.classList.add('task-card');
        newTask.setAttribute('draggable', 'true');
        
        newTask.innerHTML = `${taskInput.value} <span class="delete-btn">✖</span>`;
        makeTaskDraggable(newTask);
        todoColumn.appendChild(newTask);
        taskInput.value= '';
    } else{
        alert('Please enter a task before adding...');
    }
});

container.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-btn')) {
        event.target.parentElement.remove();
    }
});

columns.forEach(column => {
    column.addEventListener('dragover', e => {
        e.preventDefault();

        const afterElement = getDragAfterElement(column, e.clientY);
        const draggable = document.querySelector('.dragging');

        if (afterElement == null) {
            column.appendChild(draggable);
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