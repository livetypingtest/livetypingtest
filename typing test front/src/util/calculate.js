export const calculateAverage = (numbers) => {
    if (numbers.length === 0) return 0; // Avoid division by zero
    const sum = numbers.reduce((acc, num) => acc + num, 0); // Sum the numbers
    return sum / numbers.length; // Return the average
};

