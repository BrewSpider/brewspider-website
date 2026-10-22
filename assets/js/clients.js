---
---
// Logo strip: scrolls slowly in a loop; pauses on hover/focus and stays still for "reduce motion".
$(function() {
  const scrollingClients = $('#scrolling-clients');
  if (!scrollingClients.length) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const scrollSpeed = 1; // pixels per frame
  let scrollPosition = 0;
  let paused = false;

  // Duplicate logos for a continuous loop; the copies are hidden from screen readers and keyboard
  const copies = scrollingClients.children().clone();
  copies.attr('aria-hidden', 'true').find('a').attr('tabindex', '-1');
  scrollingClients.append(copies);

  scrollingClients.on('mouseenter focusin', function() { paused = true; });
  scrollingClients.on('mouseleave focusout', function() { paused = false; });

  function autoScroll() {
    if (!paused) {
      scrollPosition += scrollSpeed;
      if (scrollPosition >= scrollingClients[0].scrollWidth / 2) {
        scrollPosition = 0;
      }
      scrollingClients.scrollLeft(scrollPosition);
    }
    requestAnimationFrame(autoScroll);
  }

  autoScroll();
});
