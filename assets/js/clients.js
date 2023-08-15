---
---
$(document).ready(function() {
const scrollingClients = $('#scrolling-clients');
const scrollSpeed = 1; // Adjust scroll speed as needed
let scrollPosition = 0;

// Duplicate logos for continuous loop
scrollingClients.append(scrollingClients.html());

function autoScroll() {
    scrollPosition += scrollSpeed;
    scrollingClients.scrollLeft(scrollPosition);
    if (scrollPosition >= scrollingClients[0].scrollWidth / 2) {
    scrollPosition = 0;
    }
    requestAnimationFrame(autoScroll);
}

// Start the automatic scrolling when the page loads
autoScroll();
});


