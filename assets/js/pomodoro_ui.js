import pomodoro from './pomodoro.js';
import { select } from './utils.js';
import { notification } from './notifications.js';

// ---- Pomodoro DOM ----
const pomo_timer = {
    output: select('#pomodoro-stage-timer'),
    progress: select('#pomodoro-progress-bar'),
};
const pomo_controls = {
    btn_start_pause: select('#pomodoro-start-pause-btn'),
    btn_reset: select('#pomodoro-reset-btn'),
};
const pomo_settings = {
    pomo_settings: select('#pomodoro-user-settings'),
    work: {
        input_range: select('#pomodoro-range-work'),
        label: select('#pomodoro-work-time-label'),
    },
    break: {
        input_range: select('#pomodoro-range-break'),
        label: select('#pomodoro-break-time-label'),
    },
    long_break: {
        input_range: select('#pomodoro-range-long-break'),
        label: select('#pomodoro-long-break-time-label'),
    },
    interval: {
        input_range: select('#pomodoro-range-intervals'),
        label: select('#pomodoro-intervals-label'),
    },
    confirm: select('#config-confirm'),
};

// ---- Pomodoro UI ----
const update_on_end = () => {
    pomo_timer.output.innerHTML = `<i>Let's go work!</i>`;
    pomo_controls.btn_start_pause.innerText = 'Start';
    pomo_controls.btn_start_pause.classList.add('at-btn-outline-info');
    pomo_controls.btn_start_pause.classList.remove('at-btn-outline-white');
}


const lut_pomodoro_states = {
    'pomodoro': 'It\'s time to work!',
    'break': 'It\'s time to take a break!',
    'long break': 'It\'s time to take a long break. Good job!',
}

const update_ui = () => {
    const time = pomodoro.get_actual_time();
    const state = pomodoro.get_actual_state();
    const progress = pomodoro.get_progress_percentage();

    if(progress == 100)
        notification.notify(lut_pomodoro_states[state])

    pomo_timer.output.innerHTML = `<i>${state}</i> ${time.min}:${time.sec}`;
    pomo_timer.progress.setAttribute('value', progress);

    if (state === 'pomodoro') {
        pomo_timer.progress.classList.toggle('pomodoro-progress-bar-bg', true);
        pomo_timer.progress.classList.toggle('break-progress-bar-bg', false);
        pomo_timer.progress.classList.toggle('long-break-progress-bar-bg', false);
    } else if (state === 'break') {
        pomo_timer.progress.classList.toggle('pomodoro-progress-bar-bg', false);
        pomo_timer.progress.classList.toggle('break-progress-bar-bg', true);
        pomo_timer.progress.classList.toggle('long-break-progress-bar-bg', false);
    } else {
        pomo_timer.progress.classList.toggle('pomodoro-progress-bar-bg', false);
        pomo_timer.progress.classList.toggle('break-progress-bar-bg', false);
        pomo_timer.progress.classList.toggle('long-break-progress-bar-bg', true);
    }
    // Accessibility stuff
    pomo_timer.progress.setAttribute('aria-valuenow', `${progress}`);
    pomo_timer.progress.setAttribute('aria-valuetext', `${time.min}:${time.sec}`);
    pomo_timer.progress.setAttribute('aria-valuemax', `${pomodoro.get_duration_from_state(state)}`);
};

// ---- Pomodoro UI Events ----
//Config pomodoro timer
const config_pomodoro = (config) => {
    pomodoro.set_pomodoro_duration(config.pomodoro_duration);
    pomodoro.set_break_duration(config.break_duration);
    pomodoro.set_long_break_duration(config.long_break_duration);
    pomodoro.set_long_break_interval(config.long_break_interval);
    pomodoro.reset()
    pomodoro.set_actual_state('pomodoro');
}

//Update config
pomo_settings.pomo_settings.addEventListener('submit', e => {
    e.preventDefault()
    const user_config = Object.fromEntries(new FormData(e.target))
    config_pomodoro(user_config)

    // Store config
    localStorage.setItem('pomodoro_config', JSON.stringify(user_config));
})

// Settings listeners
pomo_settings.work.input_range.addEventListener('input', e => {
    pomo_settings.work.label.innerHTML = `${(e.target.value).toString().padStart(2, '0')}:00`;
})
pomo_settings.break.input_range.addEventListener('input', e => {
    pomo_settings.break.label.innerHTML = `${(e.target.value).toString().padStart(2, '0')}:00`;
})
pomo_settings.long_break.input_range.addEventListener('input', e => {
    pomo_settings.long_break.label.innerHTML = `${(e.target.value).toString().padStart(2, '0')}:00`;
})
pomo_settings.interval.input_range.addEventListener('input', e => {
    pomo_settings.interval.label.innerHTML = e.target.value
})
pomo_controls.btn_start_pause.addEventListener('click', () => {
    if (pomodoro.is_running()) {
        pomo_controls.btn_start_pause.textContent = 'Continue';
        pomo_controls.btn_start_pause.classList.add('at-btn-outline-info');
        pomo_controls.btn_start_pause.classList.remove('at-btn-outline-white');
        pomodoro.pause()
        return
    }
    pomo_controls.btn_start_pause.textContent = 'Pause';
    pomo_controls.btn_start_pause.classList.add('at-btn-outline-white');
    pomo_controls.btn_start_pause.classList.remove('at-btn-outline-info');
    pomodoro.start()
})
pomo_controls.btn_reset.addEventListener('click', () => {
    if (!pomodoro.is_running()) return
    pomo_controls.btn_start_pause.textContent = 'Start';
    pomo_controls.btn_start_pause.classList.add('at-btn-outline-info');
    pomo_controls.btn_start_pause.classList.remove('at-btn-outline-white');
    pomodoro.reset();
})

// Callbacks to update UI on Pomodoro events
pomodoro.set_update_ui_callback(update_ui);
pomodoro.set_callback_on_end(update_on_end);

// const setup_pomodoro = () => {
//     // Load config
//     const user_config = JSON.parse(localStorage.getItem('pomodoro_config'))
//     if (user_config) config_pomodoro(user_config)
//     update_ui();
// }

// export { setup_pomodoro }