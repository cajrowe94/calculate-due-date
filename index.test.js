const calculateDueDate = require('./index.js');

test('invalid parameters', () => {
    let dueDate = calculateDueDate();
    expect(dueDate).toEqual({ error: 'Invalid parameters: submitDateTime, turnaroundTime' });

    dueDate = calculateDueDate('asd', 16);
    expect(dueDate).toEqual({ error: 'Invalid parameters: submitDateTime' });

    dueDate = calculateDueDate(1, 'asd');
    expect(dueDate).toEqual({ error: 'Invalid parameters: turnaroundTime' });

    dueDate = calculateDueDate(1, 0);
    expect(dueDate).toEqual({ error: 'Invalid parameters: turnaroundTime' });
});

test('due dates', () => {
    // submit within working hours and turnaround same day
    let dueDate = calculateDueDate('Thu Mar 20 2025 10:00:00', 3);
    expect(dueDate).toEqual({ dueDate: 'Thu Mar 20 2025 13:00:00' });

    // submit within working hours and turnaround outside working hours
    dueDate = calculateDueDate('Thu Mar 20 2025 10:00:00', 8);
    expect(dueDate).toEqual({ dueDate: 'Fri Mar 21 2025 10:00:00' });

    // submit outside working hours and turnaround same week
    dueDate = calculateDueDate(1742875200000, 16);
    expect(dueDate).toEqual({ dueDate: 'Thurs Mar 27 2025 09:00:00' });

    // submit outside working hours and turnaround spans weekends
    dueDate = calculateDueDate(1743134400000, 72);
    expect(dueDate).toEqual({ dueDate: 'Wed Apr 9 2025 09:00:00' });

    // submit within working hours and turnaround outside working hours and as float
    dueDate = calculateDueDate('Thu Mar 20 2025 10:00:00', 8.2);
    expect(dueDate).toEqual({ dueDate: 'Fri Mar 21 2025 10:00:00' });
});