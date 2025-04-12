import {Role} from './role';

export interface Account {
    id: string;
    title: string;
    firstName: string; 
    lastname: string;
    email: string;
    role: Role;
    jwtToken?: string;
}