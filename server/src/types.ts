export enum Type { 
    JOIN = 'join', 
    MESSAGE = 'message', 
    SYSTEM = 'system', 
    ERROR = 'error' 
}

export type InputSocket = {
    type: Type;
    username?: string;
    text?: string;
}

export type OutputSocket = {
    type: string;
    username?: string;
    text?: string;
    timestamp?: string;
}