export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0"); // Get hours and pad with leading zero if necessary
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Get minutes and pad with leading zero if necessary
  return `${hours}:${minutes}`; // Return the formatted time as "hour:minute"
};
