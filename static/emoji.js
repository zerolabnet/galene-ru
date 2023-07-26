'use strict';

document.addEventListener('DOMContentLoaded', function () {
  const inputTextarea = document.getElementById('input');
  const emojiButtons = document.querySelectorAll('.emoji');

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

  setupEmojiButtons();
});