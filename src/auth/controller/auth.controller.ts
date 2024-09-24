import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async findAllUsers() {
    return this.authService.findAllUsers();
  }

  @Get(':id')
  async findUserById(@Param('id') id: number) {
    return this.authService.findUserById(id);
  }

  @Post('/register')
  async registerUser(@Body() registerDto: RegisterDto) {
    return this.authService.registerUser(registerDto);
  }

  @Post('/login')
  async loginUser(@Body() loginDto: LoginDto) {
    return this.authService.loginUser(loginDto);
  }
}