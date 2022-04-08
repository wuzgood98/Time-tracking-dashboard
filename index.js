const buttons = [...document.querySelectorAll('.menu-option')]
let data = []

/**
 * When a button is clicked, activate the clicked button and render the cards for the clicked option.
 * @param array - an array of buttons
 */
const listenToButtons = (array) => {
    array.forEach(button => {
        button.addEventListener('click', () => {
            activateClickedOption(button)
            const clickedOption = button.dataset.option
            renderCards(clickedOption)
        })
    });
}

/**
 * It takes a button as an argument, removes the active class from all buttons, and adds the active
 * class to the button that was passed in
 * @param button - The button that was clicked
 */
const activateClickedOption = (button) => {
    buttons.forEach(b => b.classList.remove('active'))
    button.classList.add('active');
}


/**
 * It fetches the data from the data.json file, and then calls the first button's click event
 */
const loadData = async () => {
    const response = await fetch('./data.json')
    const fetchedData = await response.json()
    data = fetchedData
    buttons[0].click()
}

/**
 * It removes all the activities from the DOM
 */
const clearActivities = () => {
    const activities = document.querySelectorAll('.activity')
    activities.forEach(activity => activity.remove())
}

/**
 * It loops through the data array and creates a section for each activity
 * @param clickedOption - The option that was clicked on.
 */
const renderCards = async (clickedOption) => {
    clearActivities()
    const activityTracker = document.querySelector('section.container')
    
    const calcTimeFrame = (option) => {
        if (option === 'daily') {
            return 'Yesterday'
        } else if (option === 'weekly') {
            return 'Last Week'
        } else if (option === 'monthly') {
            return 'Last Month'
        }
    }

    /* Looping through the data array and creating a section for each activity. */
    data.forEach(activity => {
        const name = activity.title
        const activityClass = name.toLowerCase().replace(' ', '-')
        const timeframeData = activity.timeframes[clickedOption]
        const previousTimeframe = calcTimeFrame(clickedOption)
        /* Checking if the current and previous timeframe is equal to 1, and if it is, it will set the
        unit to hr, otherwise it will set it to hrs. */
        let currentUnit = ''
        let previousUnit = ''
        if (timeframeData.current === 1 ) {
            currentUnit = 'hr'
        } else {
            currentUnit = 'hrs'
        }
        if (timeframeData.previous === 1) {
            previousUnit = 'hr'
        } else {
            previousUnit = 'hrs'
        }
        const section = document.createElement('section')
        section.classList.add('activity', activityClass)
        const stringToInsert = `
        <div class="activity-bg">
            <img src="./images/icon-${activityClass}.svg" alt="">
        </div>
        <div class="activity-info">
            <header class="activity-header">
                <h2 class="activity-name">
                    ${name}
                </h2>
                <div class="activity-options">
                    <svg width="21" height="5" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M2.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z"
                            fill="#BBC0FF" fill-rule="evenodd" />
                    </svg>
                </div>
            </header>
            <div class="activity-timeframes">
                <h3 class="activity-current-timeframe">
                    ${timeframeData.current}${currentUnit}
                </h3>
                <div class="activity-previous-timeframe">
                    <p class="time-window">${previousTimeframe}</p>
                    <p> - </p>
                    <p class="time">${timeframeData.previous}${previousUnit}</p>
                </div>
            </div>
        </div>
        `
        section.innerHTML = stringToInsert
        activityTracker.append(section)
    })
}

listenToButtons(buttons)
loadData()