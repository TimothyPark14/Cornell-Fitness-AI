export const goalOptions = [
    { label: 'Weight Loss', value: 'weight_loss' },
    { label: 'Muscle Gain', value: 'muscle_gain' },
    { label: 'Maintenance', value: 'maintenance' },
    { label: 'Strength', value: 'strength' },
  ];
export const experienceOptions = [
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' },
  ];
export const frequencyOptions = Array.from({ length: 5 }, (_, i) => ({
    label: `${i + 1} day${i > 0 ? 's' : ''}`,
    value: i + 1,
  }));

export const timeOptions = Array.from({ length: 15 }, (_, i) => {
    const hour = i + 6; // 6 AM to 8 PM
    const date = new Date(2025, 0, 1, hour, 0); // January 1, 2025, HH:00
    const label = date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

      return {
        label,
        value: label,
      };
  });