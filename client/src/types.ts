export interface Message {
  type: string;
  username?: string;
  text?: string;
  timestamp?: string;
  isOwn?: boolean;
}

export interface InputSocket {
  type: 'join' | 'message';
  username?: string;
  text?: string;
}

export interface OutputSocket {
  type: string;
  username?: string;
  text?: string;
  timestamp?: string;
}
