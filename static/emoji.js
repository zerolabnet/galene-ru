'use strict';

document.addEventListener('DOMContentLoaded', function () {
  const inputTextarea = document.getElementById('input');
  const emojiButtons = document.querySelectorAll('.emoji');
  const additionalEmojiButton = document.getElementById("additionalEmojiButton");
  const additionalEmojiPopup = document.getElementById("additionalEmojiPopup");

  function insertEmoji(event) {
    if (event.target.classList.contains('emoji')) {
      const emojiSet = event.target.dataset.emojiSet;
      const currentPosition = inputTextarea.selectionStart;
      const value = inputTextarea.value;
      const newValue = value.slice(0, currentPosition) + emojiSet + value.slice(currentPosition);
      inputTextarea.value = newValue;
      inputTextarea.selectionStart = inputTextarea.selectionEnd = currentPosition + emojiSet.length;
      inputTextarea.focus();
    }
  }

  function setupEmojiButtons() {
    emojiButtons.forEach((button) => {
      button.addEventListener('click', insertEmoji);
    });
  }

  function hidePopupOnClickOutside(event) {
    if (!additionalEmojiPopup.contains(event.target) && event.target !== additionalEmojiButton) {
      additionalEmojiPopup.style.display = "none";
    }
  }

  document.addEventListener('click', hidePopupOnClickOutside);

  additionalEmojiButton.addEventListener("click", function (event) {
    event.preventDefault();
    additionalEmojiPopup.style.display =
      additionalEmojiPopup.style.display === "block" ? "none" : "block";
  });

  setupEmojiButtons();
});