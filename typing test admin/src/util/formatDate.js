export const formatDate = (rawDate) => {
    let formattedDate                             

// Check if the rawDate is valid and then parse it
const parsedDate = new Date(rawDate);

if (!isNaN(parsedDate)) {
    // Format the valid date to '04 Oct 2024' format
    formattedDate = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(parsedDate)
    } else {
        console.error('Invalid date format:', rawDate);
    }
    return formattedDate
}
