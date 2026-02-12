import { User } from '@model';

export interface AuthStatus {
    loggedIn: boolean;
    loggedUser: User;
}