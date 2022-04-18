const weekday_checkboxs = document.querySelectorAll('.date-weekday-checkbox')

// Date elements
const date_day = document.querySelector('#date-day');
const date_month = document.querySelector('#date-month');
const date_year = document.querySelector('#date-year');
const date_weekday = document.querySelector('#date-weekday');

// Task buttons
const setup_date = () => {

    const date = new Date()
    date_day.textContent = date.toLocaleString('es', { day: 'numeric' })
    date_month.textContent = date.toLocaleString('es', { month: 'long' })
    date_year.textContent = date.toLocaleString('es', { year: 'numeric' })
    date_weekday.textContent = date.toLocaleString('es', { weekday: 'long' })

    const lut_weekday_number = { 'L': 0, 'M': 1, 'X': 2, 'J': 3, 'V': 4, 'S': 5, 'D': 6 }

    const weekday_number = lut_weekday_number[date.toLocaleString('es', { weekday: 'narrow' })]
    for (let i = 0; i <= weekday_number; (weekday_checkboxs[i++].checked = true)) { }
}

export { setup_date }