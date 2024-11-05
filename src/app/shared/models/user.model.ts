export class User {
    UserId: number | undefined;
    Email: string | undefined;
    Password: string | undefined;
    FirstName: string | undefined;
    LastName: string | undefined;
    RoleId: number | undefined;
    Role: Role | undefined;
}

export class Role {
    RoleId: number | undefined;
    RoleName: string | undefined;
}