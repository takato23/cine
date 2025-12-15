export * from './movie'
export * from './showtime'
export * from './product'
export * from './order'

// User type for authentication
export interface User {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    role: 'ADMIN' | 'STAFF' | 'CLIENT';
}
