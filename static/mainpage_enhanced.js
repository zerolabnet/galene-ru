'use strict';

document.addEventListener("DOMContentLoaded", function() {
  var input = document.getElementById("group");
  input.focus();
  var length = input.value.length;
  input.setSelectionRange(length, length);
});

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

var generateLinkButton = document.getElementById('generate-link-button');
var generatedLink = document.getElementById('generated-link');

generateLinkButton.addEventListener('click', function() {
  var serverName = window.location.hostname + (window.location.port ? ':' + window.location.port : '');
  var groupNameField = document.getElementById('group');
  var groupName = groupNameField.value; // Получаем значение поля ввода
  groupName = groupName.replace(/^\/|\/$/g, ''); // Обрезаем символ "/" в начале и конце строки, если он есть
  var uuid = generateUUID();
  var link = 'https://' + serverName + '/group/' + groupName + '/' + uuid;
  generatedLink.innerHTML = '<a href="' + link + '">' + link + '</a>';
});