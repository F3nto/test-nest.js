import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from '../entities/auth.entities';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto } from '../dto/auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly jwtService: JwtService,
  ) {}

  findAllUsers = async (): Promise<Auth[]> => await this.authRepository.find();

  findUserById = async (id: number): Promise<Auth> => {
    const user = await this.authRepository.findOneBy({ id });
    if (!user) throw new Error(`User with ID ${id} not found!`);
    return user;
  };

  registerUser = async (
    registerDto: RegisterDto,
  ): Promise<{ message: string; user: Auth }> => {
    const { name, email, password, dateOfBirth } = registerDto;

    const existingUser = await this.authRepository.findOneBy({ email });
    if (existingUser) throw new BadRequestException('User already exists!');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = this.authRepository.create({
      name,
      email,
      password: hashedPassword,
      dateOfBirth
    });

    const savedUser = await this.authRepository.save(newUser);
    return { message: 'Registration successful!', user: savedUser };
  };

  loginUser = async (
    loginDto: LoginDto,
  ): Promise<{ message: string; token: string }> => {
    const { email, password } = loginDto;

    const user = await this.authRepository.findOneBy({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password!');
    }

    const payload = { id: user.id, name: user.name, email: user.email };
    const token = this.jwtService.sign(payload);

    return { message: 'Login successful!', token };
  };
}
