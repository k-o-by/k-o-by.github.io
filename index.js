document.getElementById('image-count').textContent = document.querySelectorAll('img').length;

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".tab-content");

  function openTab(targetTab) {
    const targetButton = document.querySelector(`.tab-btn[data-target="${targetTab}"]`);
    const targetContent = document.getElementById(targetTab);

    if (targetButton && targetContent) {
      // Remove active class from all buttons and panes
      buttons.forEach(btn => btn.classList.remove("active"));
      contents.forEach(content => content.classList.remove("active"));

      // Add active class to target button and pane
      targetButton.classList.add("active");
      targetContent.classList.add("active");

      // Save selection locally
      localStorage.setItem("activeTab", targetTab);
    }
  }

  // Listen for tab clicks
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-target");
      openTab(targetTab);
    });
  });

  // Restore saved tab on page load
  const savedTab = localStorage.getItem("activeTab");
  if (savedTab) {
    openTab(savedTab);
  }
});

document.querySelectorAll('img').forEach(el => {
  el.setAttribute('draggable', 'false');
  el.setAttribute('oncontextmenu', 'return false;');
});
