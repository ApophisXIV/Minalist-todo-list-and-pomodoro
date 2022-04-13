const user_form = document.querySelector('#todo-user-form');
const tasks_container = document.querySelector('#todo-tasks-container');
const tasks_container_title = document.querySelector('#todo-tasks-container-title')
const weekday_checkboxs = document.querySelectorAll('.date-weekday-checkbox')

// Date elements
const date_day = document.querySelector('#date-day');
const date_month = document.querySelector('#date-month');
const date_year = document.querySelector('#date-year');
const date_weekday = document.querySelector('#date-weekday');

// Task buttons
const btn_sort = document.querySelector('#todo-sort-btn')
const btn_delete = document.querySelector('#todo-delete-btn');

const set_date = () => {

    const date = new Date()
    date_day.textContent = date.toLocaleString('es', { day: 'numeric' })
    date_month.textContent = date.toLocaleString('es', { month: 'long' })
    date_year.textContent = date.toLocaleString('es', { year: 'numeric' })
    date_weekday.textContent = date.toLocaleString('es', { weekday: 'long' })

    const lut_weekday_number = { 'D': 0, 'L': 1, 'M': 2, 'X': 3, 'J': 4, 'V': 5, 'S': 6 }

    const weekday_number = lut_weekday_number[date.toLocaleString('es', { weekday: 'narrow' })]
    for (let i = 0; i <= weekday_number; (weekday_checkboxs[i++].checked = true)) { }

}

const update_pending_task_count = () => {
    const n_uncompleted_tasks = tasks_container.querySelectorAll('.todo-task-uncompleted:not(.todo-task-completed)').length
    tasks_container_title.textContent = n_uncompleted_tasks === 0 ? 'No pending tasks' : `Pending tasks - ${n_uncompleted_tasks}`
}

const update_task_state = e => {
    e.target.classList.toggle('todo-task-completed')
    update_pending_task_count()
}

const add_task = e => {

    e.preventDefault()

    const data = Object.fromEntries(new FormData(e.target))
    if (data.task_content === '') return

    const new_task = document.createElement('div')
    new_task.classList.add('todo-task-uncompleted')
    new_task.textContent = data.task_content
    new_task.addEventListener('click', update_task_state)

    tasks_container_title.textContent = `Pending tasks - ${tasks_container.children.length}`
    tasks_container.prepend(new_task)
    update_pending_task_count()

    e.target.reset()
}

const delete_completed_tasks = () => {
    tasks_container.querySelectorAll('.todo-task-completed').forEach(task => task.remove())
    update_pending_task_count()
}

const sort_tasks = () => {
    if (tasks_container.children.length === 0) return
    [...tasks_container.children].sort((a, b) => { if (a.classList.contains('todo-task-completed')) return 1; else return -1 })
        .forEach(task => tasks_container.append(task))
}

user_form.addEventListener('submit', add_task)
btn_delete.addEventListener('click', delete_completed_tasks)
btn_sort.addEventListener('click', sort_tasks)

set_date()
