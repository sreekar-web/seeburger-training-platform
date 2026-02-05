let messages = [];

export function addMessage(msg) {
    messages.push(msg);
}

export function updateMessage(id, update) {
    messages = messages.map(m =>
        m.id === id ? { ...m, ...update } : m
    );
}

export function getMessages() {
    return messages;
}

export function getMessage(id) {
    return messages.find(m => m.id === id);
}
