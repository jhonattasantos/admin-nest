import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, NotFoundException, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './models/register.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/models/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {


    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    @Post('register')
    async register(@Body() bodyRequest: RegisterDto) {

        if (bodyRequest.password !== bodyRequest.password_confirmation) {
            throw new BadRequestException('Passwords do not match!')
        }

        return this.userService.create(bodyRequest)
    }

    @Post('login')
    async login(
        @Body('email') email: string,
        @Body('password') password: string,
        @Res({ passthrough: true }) response: Response
    ): Promise<User> {
        const user = await this.userService.findOne({
            email
        })

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (!await bcrypt.compare(password, user.password)) {
            throw new BadRequestException('Invalid Credentials');
        }

        const jwt = await this.jwtService.signAsync({ id: user.id });
        response.cookie('jwt', jwt, { httpOnly: true })

        return user;
    }

    @Get('user')
    async user(@Req() request: Request) {
        const cookie = request.cookies['jwt'];
        const data = await this.jwtService.verifyAsync(cookie);
        return this.userService.findOne({ id: data['id']})
    }

    @Post('logout')
    async logout(@Res({ passthrough: true}) response: Response) {
        response.clearCookie('jwt');
        return {
            message: 'Success'
        }
    }
}
