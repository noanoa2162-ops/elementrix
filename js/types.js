"use strict";
// ========================================
// Type Definitions
// ========================================
// Regex patterns
const USERNAME_REGEX = /^[A-Za-z\u0590-\u05FF0-9 ]{2,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
