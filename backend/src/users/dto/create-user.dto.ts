import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateUserDto {

    name!: string;
    email!: string;
    password!: string;
    number!: string;
    state!: string;
    city!: string;
    address!: string;
    gender!: string;
}
