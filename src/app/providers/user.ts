export interface User {
    uid: String;
    dispName: String;
    email: String;
    photoURL: String;
    roles: Roles;
    booksTagged: Array<number>;
}

export interface Roles {
    admin?: boolean;
    user?: boolean;
}
