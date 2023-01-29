import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './models/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ){}

    async all(): Promise<User[]>{
        return await this.userRepository.find();
    }

    async create(data): Promise<any> {
        const password = await bcrypt.hash(data.password, 12);
        const user = {
            ...data,
            password
        }
        return await this.userRepository.save(user);
    }

    async findOne(condition): Promise<User>{
        return await this.userRepository.findOne({where: condition});
    }
}
