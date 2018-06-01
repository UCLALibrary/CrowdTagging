export interface User {
    uid: String;
    dispName: String;
    email: String;
    photoURL: String;
    roles: Roles;
    booksTagged: Array<string>;
    numTagged: number;
}

export interface Roles {
    admin?: boolean;
    user?: boolean;
}
