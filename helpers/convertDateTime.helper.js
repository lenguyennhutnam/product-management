module.exports = (date) => {
    // Define the options for the date and time formatter
    const dateOptions = {
        timeZone: "Asia/Ho_Chi_Minh",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    };
    const timeOptions = {
        timeZone: "Asia/Ho_Chi_Minh",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    };
    // Create formatters for Vietnam's time zone
    const dateFormatter = new Intl.DateTimeFormat("en-GB", dateOptions);
    const timeFormatter = new Intl.DateTimeFormat("en-GB", timeOptions);
    // Format the date and time separately
    const formattedDate = dateFormatter.format(date);
    const formattedTime = timeFormatter.format(date);
    return { date: formattedDate, time: formattedTime };
};
