import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.signup(createUserDto);
  }
  @Post('login')
  login(@Body() loginUserDto: CreateUserDto) {
    return this.usersService.login(loginUserDto.email, loginUserDto.password);
  }

  @Get('profile')
  profile(@Req() req: any) {
    
    return this.usersService.porfile(req);
  }

  @Put('update')
  update( @Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }


}
