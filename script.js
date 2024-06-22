// The Document Object Model (DOM) is a programming interface for web documents. 
// It represents the page so that programs can change the document structure, style, and content.
// The DOM represents the document as nodes and objects;
// that way, programming languages can interact with the page.


// javascript and how it works!!!
// Wait until the entire DOM content is loaded before executing the script (
document.addEventListener('DOMContentLoaded', () => {
    // Select the menu button using its aria-label attribute
    const menuButton = document.querySelector('button[aria-label="Menu Button"]');
    
    // Select the close button using its aria-label attribute
    const closeButton = document.querySelector('button[aria-label="Close Button"]');
    
    // Select the navigation div that contains the menu items
    const nav = document.querySelector('nav div');

    // Add a click event listener to the menu button to toggle the navigation visibility
    menuButton.addEventListener('click', () => {
        // Toggle the class 'max-xl:-translate-y-full' to show or hide the navigation menu
        nav.classList.toggle('max-xl:-translate-y-full');
    });

    // Add a click event listener to the close button to toggle the navigation visibility
    closeButton.addEventListener('click', () => {
        // Toggle the class 'max-xl:-translate-y-full' to show or hide the navigation menu
        nav.classList.toggle('max-xl:-translate-y-full');
    });
});
