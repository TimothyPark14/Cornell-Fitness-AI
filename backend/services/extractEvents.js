function groupEventsByDay(events) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const grouped = {};

  for (const event of events) {
    const dayIndex = event.start.getDay();
    const dayName = days[dayIndex];

    if (!grouped[dayName]) {
      grouped[dayName] = [];
    }

    grouped[dayName].push(event);
  }

  return grouped;
}

// Example usage:
export default groupEventsByDay
