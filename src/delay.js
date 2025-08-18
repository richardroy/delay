import Element from './Element.js';
import Config from './model/Config.js';

const CUSTOM_MESSAGE_ID = "customMessageP";

async function setCustomMessage() {
  const customMessage = await Config.getCustomMessage();
  const p = Element.getById(CUSTOM_MESSAGE_ID);
  if (p) p.textContent = customMessage;
}

window.addEventListener('DOMContentLoaded', setCustomMessage);