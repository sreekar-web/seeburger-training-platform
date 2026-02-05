const messages = [];

export function addMessage(msg) {
    messages.push(msg);
}

export function getMessages() {
    return messages;
}

export function getMessageById(id) {
    return messages.find(m => m.id === id);
}

export function updateMessage(id, updates) {
    const msg = getMessageById(id);
    if (msg) Object.assign(msg, updates);
    return msg;
}
