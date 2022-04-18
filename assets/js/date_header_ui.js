const weekday_checkboxs = document.querySelectorAll('.date-weekday-checkbox')

// Date elements
const date_day = document.querySelector('#date-day');
const date_month = document.querySelector('#date-month');
const date_year = document.querySelector('#date-year');
const date_weekday = document.querySelector('#date-weekday');

// Task buttons
const setup_date = () => {

    const date = new Date()
    date_day.textContent = date.toLocaleString('en', { day: 'numeric' })
    date_month.textContent = date.toLocaleString('en', { month: 'long' })
    date_year.textContent = date.toLocaleString('en', { year: 'numeric' })
    date_weekday.textContent = date.toLocaleString('en', { weekday: 'long' })

    const lut_weekday_number = { 'M': 0, 'T': 1, 'W': 2, 'Th': 3, 'F': 4, 'Sa': 5, 'Su': 6 }

    const weekday_number = lut_weekday_number[date.toLocaleString('en', { weekday: 'narrow' })]
    for (let i = 0; i <= weekday_number; (weekday_checkboxs[i++].checked = true)) { }
}

export { setup_date }