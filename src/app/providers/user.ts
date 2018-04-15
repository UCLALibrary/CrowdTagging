export interface User {
    uid: String;
    email: String;
    photoURL: String;
    roles: Roles;
}

export interface Roles {
    admin?: boolean;
    user?: boolean;
}
