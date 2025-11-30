import { Server } from "socket.io";

interface IUser {
    id: number;
    username: string;
}

class UserService {
    private io: Server | null = null;
    private users: IUser[] = [];
    private lastId: number = 0;

    /**
     * Ініціалізує сервіс з Socket.IO сервером
     */
    initialize(io: Server): void {
        this.io = io;
    }

    loadAll(): IUser[] {
        return this.users;
    }

    addUser(name: string): void {
        const user = { id: ++this.lastId, username: name.trim() };
        this.users.push(user);

        this.broadcastUsers();
    }

    removeUser(name: string): boolean {
        const index = this.users.findIndex(u => u.username === name.trim());
        console.log('index', index);
        console.log('this.users', JSON.stringify(this.users));
        
        if (index >= 0) {
            this.users.splice(index, 1);
            console.log('this.users <<<', JSON.stringify(this.users));
            this.broadcastUsers();
            return true;
        }
        return false;
    }

    broadcastUsers(): void {
        if (!this.io) {
            console.error('UserService: Socket.IO server is not initialized');
            return;
        }

        // Відправляємо всім клієнтам
        this.io.emit('users-updated', JSON.stringify(this.users));
    }

}

export const userService = new UserService();
