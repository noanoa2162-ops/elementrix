"use strict";
// ========================================
// Type Definitions
// ========================================
// Regex patterns
const USERNAME_REGEX = /^[A-Za-z\u0590-\u05FF0-9 ]{2,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Encode user-controlled text before inserting it into HTML templates.
const escapeUserText = (value) => {
    const element = document.createElement('div');
    element.textContent = value;
    return element.innerHTML;
};
