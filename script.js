const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-task-button');
const todoColumn = document.getElementById('todo');
const container = document.querySelector('.container');

addBtn.addEventListener('click', function() {

    if (taskInput.value.trim() !== '') {
        const newTask = document.createElement('div');
        newTask.classList.add('task-card');

        newTask.innerHTML = `${taskInput.value} <span class="delete-btn">✖</span>`;

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