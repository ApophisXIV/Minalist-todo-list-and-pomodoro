// 25 + 5 + 25 + 5 + 25 + 5 + 25 + 15
class Pomodoro {
    constructor(pomodoro_config = { pomodoro_duration: 25, break_duration: 5, long_break_duration: 15, long_break_after: 1 }) {
        this.pomodoro_duration = pomodoro_config.pomodoro_duration * 60
        this.break_duration = pomodoro_config.break_duration * 60
        this.long_break_duration = pomodoro_config.long_break_duration * 60
        this.long_break_interval = pomodoro_config.long_break_after
        this.update_ui_callback = pomodoro_config.update_ui_callback || function () { }
        this.end_callback = pomodoro_config.end_callback || function () { }

    }

    set_pomodoro_duration = duration => { this.pomodoro_duration = duration * 60 }
    set_break_duration = duration => { this.break_duration = duration * 60 }
    set_long_break_duration = duration => { this.long_break_duration = duration * 60 }
    set_long_break_interval = interval => { this.long_break_interval = interval }

    get_actual_config = () => { return { pomodoro_duration: this.pomodoro_duration / 60, break_duration: this.break_duration / 60, long_break_duration: this.long_break_duration / 60, long_break_after: this.long_break_interval } }

    set_update_ui_callback = callback => { this.update_ui_callback = callback }
    set_callback_on_end = callback => { this.end_callback = callback }

    set_actual_state = state => { this.actual_state = state }
    get_actual_state = () => { return this.actual_state }
    get_last_state = () => { return this.last_state }

    set_actual_duration = duration => { this.actual_duration = duration }
    get_actual_duration = () => { return this.actual_duration }

    get_duration_from_state = state => { return state === 'pomodoro' ? this.pomodoro_duration : state === 'break' ? this.break_duration : this.long_break_duration }
    get_progress_percentage = () => { return 100 - (100 * this.actual_duration / this.get_duration_from_state(this.actual_state)) }
    get_actual_time = () => {
        return {
            min: parseInt(this.actual_duration / 60).toString().padStart(2, '0'),
            sec: (this.actual_duration % 60).toString().padStart(2, '0')
        }
    }

    is_running = () => { return this.timer !== undefined }

    start = () => {
        if (this.is_running()) return // Avoid multiple timers

        this.set_actual_state(this.get_actual_state() === undefined ? 'pomodoro' : this.get_actual_state())
        this.set_actual_duration(this.get_actual_duration() === undefined ? this.pomodoro_duration : this.get_actual_duration())
        this.actual_interval = this.long_break_interval

        console.log('Config: ', this.pomodoro_duration, this.break_duration, this.long_break_duration, this.long_break_interval)

        this.timer = setInterval(() => {

            // console.log('Running', this.get_actual_time(), this.get_actual_state());
            this.set_actual_duration(this.get_actual_duration() - 1)
            this.update_ui_callback()
            this.last_state = this.get_actual_state()

            switch (this.actual_state) {
                case 'pomodoro':
                    if (this.get_actual_duration() !== 0) return
                    this.set_actual_state('break')
                    this.set_actual_duration(this.break_duration)

                    if (this.actual_interval !== 0) return
                    this.set_actual_state('long break')
                    this.set_actual_duration(this.long_break_duration)
                    this.actual_interval = this.long_break_interval
                    break

                case 'break':
                    if (this.get_actual_duration() !== 0) return
                    this.set_actual_state('pomodoro')
                    this.set_actual_duration(this.pomodoro_duration)
                    this.actual_interval--
                    break

                case 'long break':
                    if (this.get_actual_duration() !== 0) return
                    this.set_actual_state('pomodoro')
                    this.reset()
                    this.end_callback()
                    break
            }
        }, 1000)
    }

    pause = () => {
        // console.log('Pause');
        clearInterval(this.timer)
        this.timer = undefined
        return { time: this.get_actual_time(), state: this.get_actual_state() }
    }

    reset = () => {
        // console.log('Reset');
        this.pause()
        this.set_actual_state('pomodoro')
        this.set_actual_duration(this.pomodoro_duration)
        this.update_ui_callback()
    }

}

// Singleton
const pomodoro = new Pomodoro()
export default pomodoro

