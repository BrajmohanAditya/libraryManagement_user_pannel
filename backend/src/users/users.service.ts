import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async signup(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);

    const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });

    if (existingUser) {
      throw new BadRequestException("Email already exists");
    }

    const hashPassword = await bcrypt.hash(createUserDto.password, 10);
    user.password = hashPassword;
    const data = await this.userRepository.save(user);
    const token = await jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    const { password, ...result } = data;

    return {
      message: "User created successfully",
      token,
      data: result
    };

  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      return {
        message: "Invalid email or password"
      }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException("Invalid email or password");
    }

    const token = await jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '7h' });

    return {
      message: "Login successful",
      token,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        number: user.number,
        state: user.state,
        city: user.city,
        address: user.address,
      }
    }



  }

  async porfile(req: any) {

    const user = await this.userRepository.findOne({
      where: {
        id: req.user.id,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const { password, ...result } = user;

    return {
      message: "User profile retrieved successfully",
      data: result
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException("User not found");
    }
    const data = await this.userRepository.update(id, updateUserDto);

    return {
      message: "User updated successfully",
      data
    };

  }

}
