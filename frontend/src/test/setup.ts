import '@testing-library/jest-dom';

// Provide a mock for scrollIntoView in jsdom
window.HTMLElement.prototype.scrollIntoView = function () {};

