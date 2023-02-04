class UserCreateDto {
    constructor(body) {
        this.login = body.login;
        this.role = body.role ? body.role : 'USER';
        this.isActive = body.isActive ? body.isActive : true;
    }
}