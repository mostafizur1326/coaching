function moveFocus(current, nextFieldId) {
  if (current.value.length === 1) {
    document.getElementById(nextFieldId)?.focus();
  }
}