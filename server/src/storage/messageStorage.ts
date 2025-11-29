
import { OutputSocket } from '../types.js'

const messages: OutputSocket[] = [];

export function findAll() {
    return messages;
}

export function create(data: OutputSocket) {
    messages.push(data);
}