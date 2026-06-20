const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-task-button');
const todoColumn = document.getElementById('todo');

addBtn.addEventListener('click', function() {

    if (taskInput.value.trim() !== '') {
        const newTask = document.createElement('div');
        newTask.classList.add('task-card');
        newTask.textContent = taskInput.value;
        todoColumn.appendChild(newTask);
        taskInput.value= '';
    } else{
        alert('Please enter a task before adding...');
    }
});