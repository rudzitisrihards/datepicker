let currentFormat = "DD.MM.YYYY HH:MM"; // Default format is DD.MM.YYYY HH:MM
const inputField = document.getElementById("datetime");
const placeholderLabel = document.querySelector(".placeholder");
const switchButton = document.getElementById("switchFormat");
const saveButton = document.getElementById("saveToDb");
const savedDateDisplay = document.getElementById("savedDate");

// Set initial label text
placeholderLabel.textContent = currentFormat;

// Switch input format on button click
switchButton.addEventListener("click", function () {
  currentFormat =
    currentFormat === "DD.MM.YYYY HH:MM"
      ? "DD/MM/YYYY HH:MM"
      : "DD.MM.YYYY HH:MM"; // Toggle format
  placeholderLabel.textContent = currentFormat;
  inputField.value = ""; // Clear input on format switch
  inputField.classList.remove("invalid");
  saveButton.disabled = true; // Disable save button when format changes
});

// Validate input format & prevent fake dates
inputField.addEventListener("input", function (e) {
  const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
  let formattedValue = value;

  // Format input as DD.MM.YYYY HH:MM (or DD/MM/YYYY HH:MM) based on current format
  if (value.length <= 2) {
    formattedValue = value;
  } else if (value.length <= 4) {
    formattedValue = value.slice(0, 2) + getSeparator() + value.slice(2);
  } else if (value.length <= 6) {
    formattedValue =
      value.slice(0, 2) +
      getSeparator() +
      value.slice(2, 4) +
      getSeparator() +
      value.slice(4);
  } else if (value.length <= 10) {
    formattedValue =
      value.slice(0, 2) +
      getSeparator() +
      value.slice(2, 4) +
      getSeparator() +
      value.slice(4, 8) +
      " " +
      value.slice(8);
  } else if (value.length <= 12) {
    formattedValue =
      value.slice(0, 2) +
      getSeparator() +
      value.slice(2, 4) +
      getSeparator() +
      value.slice(4, 8) +
      " " +
      value.slice(8, 10) +
      ":" +
      value.slice(10);
  } else {
    formattedValue =
      value.slice(0, 2) +
      getSeparator() +
      value.slice(2, 4) +
      getSeparator() +
      value.slice(4, 8) +
      " " +
      value.slice(8, 10) +
      ":" +
      value.slice(10, 12);
  }

  inputField.value = formattedValue; // Update input field with formatted value

  let regex = getRegex();
  if (!regex.test(formattedValue)) {
    e.target.setCustomValidity(`Invalid format! Follow ${currentFormat}`);
    e.target.classList.add("invalid");
    saveButton.disabled = true; // Disable save button if invalid input
    return;
  }

  const match = formattedValue.match(regex);
  let [_, day, month, year, hours, minutes] = match.map(Number); // Convert to numbers

  if (!isValidDate(day, month, year) || !isValidTime(hours, minutes)) {
    e.target.setCustomValidity(
      `Invalid date or time! Use format: ${currentFormat}`
    );
    e.target.classList.add("invalid");
    saveButton.disabled = true; // Disable save button if invalid date or time
  } else {
    e.target.setCustomValidity("");
    e.target.classList.remove("invalid");
    saveButton.disabled = false; // Enable save button if input is valid
  }
});

// Function to validate date correctly
function isValidDate(day, month, year) {
  if (year < 1000 || year > 9999) return false; // Ensures four-digit year
  if (month < 1 || month > 12) return false; // Ensures valid month
  const daysInMonth = new Date(year, month, 0).getDate(); // Gets actual days in month
  return day >= 1 && day <= daysInMonth; // Checks if day is valid
}

// Function to validate time correctly
function isValidTime(hours, minutes) {
  return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
}

// Save button - convert to ISO 8601 and display
saveButton.addEventListener("click", function () {
  const value = inputField.value.trim();
  let regex = getRegex();

  if (regex.test(value)) {
    const match = value.match(regex);
    let [_, day, month, year, hours, minutes] = match.map(Number); // Convert to numbers

    // Create a Date object from the parsed values (with local timezone)
    const date = new Date(year, month - 1, day, hours, minutes);

    // Manually adjust the date to ensure it stays in the local timezone
    const localISODate = date.toLocaleString("sv-SE"); // sv-SE is for a ISO-like string format in local time

    // Display the ISO-like local string
    savedDateDisplay.textContent = `Saved Date (ISO 8601 Local): ${localISODate}`;
  } else {
    savedDateDisplay.textContent = "Invalid date format!";
  }
});

// Function to get separator based on the current format
function getSeparator() {
  return currentFormat.includes("/") ? "/" : ".";
}

// Function to get regex based on the current format
function getRegex() {
  return currentFormat === "DD.MM.YYYY HH:MM"
    ? /^(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2})$/ // For DD.MM.YYYY HH:MM
    : /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/; // For DD/MM/YYYY HH:MM
}