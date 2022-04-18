class Task {
    constructor(task_content, id, date) {
        this.date = date || new Date()
        this.id = id || this.date.getTime()
        this.content = task_content
        this.completed = false
    }

    set_state = (state) => { this.completed = state }
    is_completed = () => { return this.completed }
    toggle_completed = () => { this.completed = !this.completed }

    get_content = () => { return this.content }
    get_date = () => { return this.date }
    get_id = () => { return this.id }

    to_html = (template) => {
        if (!template) return
        return template
            .replace('#task_content', this.get_content())
            .replace('#task_date', this.get_date().toLocaleString('es', { day: 'numeric', month: 'numeric', year: 'numeric' , hour: 'numeric', minute: 'numeric' , weekday: 'short' }))
            .replace(/#task_id/g, this.get_id())
    }
}

class Task_List {
    constructor() {
        this.task_list = []
    }

    add_task = (content, id) => {
        const new_task = new Task(content, id)
        this.task_list.push(new_task)
        return { id: new_task.get_id(), html: new_task.to_html(this.html_template) }
    }
    delete_completed_tasks = () => {
        this.task_list = this.task_list.filter(task => !task.is_completed())
        return this.task_list.length
    }
    sort_completed_tasks = () => { this.task_list.sort((a, b) => { if (!a.is_completed() && b.is_completed()) return -1 }) }

    set_task_html_template = (template) => { this.html_template = template }
    set_tasks_list = (task_list) => { this.task_list = task_list }
    get_tasks_list = (get_html) => {
        if (get_html) return this.task_list.map(task => task.to_html(this.html_template)).join('')
        return JSON.stringify(this.task_list)
    }
    get_uncompleted_tasks = () => { return this.task_list.filter(task => !task.is_completed()) }

    is_task_completed = (id) => { return this.task_list.find(task => task.get_id() == id).is_completed() }
    set_task_completed = (id, completed) => { this.task_list.find(task => task.get_id() == id).set_state(completed) }

    toggle_task_completed = (task_id) => { this.task_list.find(task => task.get_id() == task_id).toggle_completed() }
}

// Singleton
const task_list = new Task_List()
export default task_list
