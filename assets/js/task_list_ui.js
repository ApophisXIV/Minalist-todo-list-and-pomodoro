import task_list from './task_list.js'

const tasks_container = document.querySelector('#todo-tasks-container')
const tasks_container_title = document.querySelector('#todo-tasks-container-title')

const task_input = document.querySelector('#todo-user-form')
const btn_sort = document.querySelector('#todo-sort-btn')
const btn_delete = document.querySelector('#todo-delete-btn')

const task_template = `
    <div class="todo-task todo-task-uncompleted" task-id="#task_id">
        #task_content
        <p class="task-date">#task_date</p>
    </div>`
task_list.set_task_html_template(task_template)

const update_local_db = () => {
    localStorage.setItem('tasks', task_list.get_tasks_list())
}

const update_counter = () => {
    const uncompleted_tasks = task_list.get_uncompleted_tasks().length
    tasks_container_title.textContent = uncompleted_tasks ? `Pending tasks - ${uncompleted_tasks}` : 'All tasks completed :)'
}

const task_on_click = e => {
    if (!e.target.classList.contains('todo-task')) return // Avoid clicking on the task's date

    const task_id = e.target.getAttribute('task-id')
    e.target.classList.toggle('todo-task-completed')
    task_list.toggle_task_completed(task_id)
    update_counter()
    update_local_db()
}


const add_new_task = e => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target))
    if (!data.task_content || data.task_content.trim() === '') return

    const new_task = task_list.add_task(data.task_content)
    tasks_container.insertAdjacentHTML('beforeend', new_task.html)
    tasks_container.lastElementChild.addEventListener('click', task_on_click)

    update_counter()
    update_local_db()
    e.target.reset()
}
const delete_completed_tasks = () => {
    if (tasks_container.children.length === 0) return
    tasks_container.querySelectorAll('.todo-task-completed').forEach(task => task.remove())

    task_list.delete_completed_tasks()
    update_counter()
    update_local_db()
}
const sort_completed_tasks = () => {
    if (tasks_container.children.length === 0) return
    [...tasks_container.children].sort(task => { if (task_list.is_task_completed(task.getAttribute('task-id'))) return 1; return -1 })
        .forEach(task => tasks_container.append(task))

    task_list.sort_completed_tasks()
    update_counter()
    update_local_db()
}

task_input.addEventListener('submit', add_new_task)
btn_delete.addEventListener('click', delete_completed_tasks)
btn_sort.addEventListener('click', sort_completed_tasks)

const setup_task_list = () => {
    const stored_tasks = JSON.parse(localStorage.getItem('tasks'))
    if (!stored_tasks) return

    // Task format: { id: '', content: '', completed: false }

    stored_tasks.forEach(task => {
        const new_task = task_list.add_task(task.content, task.id)
        task_list.set_task_completed(new_task.id, task.completed)

        tasks_container.insertAdjacentHTML('beforeend', new_task.html)
        tasks_container.lastElementChild.addEventListener('click', task_on_click)
        tasks_container.lastElementChild.classList.toggle('todo-task-completed', task.completed)
    })
    update_counter()
}

export { setup_task_list }