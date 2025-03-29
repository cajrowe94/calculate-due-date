/**
 * Caleb Rowe
 * Emarsys Homework 3-29-25
 */

function calculateDueDate(submitDateTime, turnaroundTime) {
    const submitDateObject = new Date(submitDateTime);
    const parameterValidity = getParameterValidity(submitDateObject, turnaroundTime);

    // check for valid parameters
    if (parameterValidity.error) {
        return parameterValidity;
    }

    const workingHours = getWorkingHours();
    const hoursPerWorkingDay = Math.ceil(workingHours.end[0] - workingHours.start[0]);
    const turnaroundTimeWorkingDays = Math.ceil(turnaroundTime / hoursPerWorkingDay);

    // adjust submit time if outside working hours
    if (submitDateObject.getHours() < workingHours.start[0]) {
        // set to start of same day
        submitDateObject.setHours(workingHours.start[0]);
    } else if (submitDateObject.getHours() > workingHours.end[0]) {
        // set to start of next day
        submitDateObject.setHours(workingHours.start[0]);
        submitDateObject.setDate(submitDateObject.getDate() + 1);
    }

    let dueDate = new Date(submitDateObject.getTime());
    let dueDateCurrentHour;
    let hoursLeft = turnaroundTime;

    // work through hours left until 0
    while (hoursLeft > 0) {
        dueDateCurrentHour = dueDate.getHours();
        let hoursLeftInDay = workingHours.end[0] - dueDateCurrentHour;

        // advance one day, subtract days hours from hours left
        if (hoursLeft > hoursLeftInDay) {
            hoursLeft -= hoursLeftInDay;
            dueDate.setDate(submitDateObject.getDate() + 1);
            dueDate.setHours(workingHours.start[0]);
        } else {
            dueDate.setHours(dueDate.getHours() + hoursLeft);
            hoursLeft = 0;
        }

        // check if weekend
        if (dueDate.getDay() == 0) {
            dueDate.setDate(dueDate.getDate() + 1);
        } else if (dueDate.getDay() == 6) {
            dueDate.setDate(dueDate.getDate() + 2);
        }
    }

    return { dueDate: dueDate.toString() };
}

/** Helper functions */

function getWorkingHours() {
    return {
        // hour, min, sec
        start: [9, 0, 0],
        end: [17, 0, 0]
    }
}

function getParameterValidity(submitDateObject, turnaroundTime) {
    const invalidParams = [];

    // submitDateTime
    if (
        !submitDateObject ||
        isNaN(submitDateObject)
    ) {
        invalidParams.push('submitDateTime');
    }

    // turnaroundTime
    if (
        !turnaroundTime ||
        isNaN(turnaroundTime) ||
        turnaroundTime < 1
    ) {
        invalidParams.push('turnaroundTime');
    }

    if (invalidParams.length) {
        return { error: `Invalid parameters: ${ invalidParams.join(', ') }` }
    }

    return { error: false }
}

module.exports = calculateDueDate;