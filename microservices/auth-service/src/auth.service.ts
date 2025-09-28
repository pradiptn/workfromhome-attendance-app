import { Injectable, OnModuleInit, HttpException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { User } from "./user.entity";

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async onModuleInit() {
    await this.createDefaultAdmin();
  }

  private async createDefaultAdmin() {
    const adminExists = await this.userRepository.findOne({
      where: { role: "admin" },
    });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const admin = this.userRepository.create({
        email: "admin@wfh.com",
        password: hashedPassword,
        name: "Admin User",
        role: "admin",
      });
      await this.userRepository.save(admin);
      console.log("Default admin created: admin@wfh.com / admin123");
    }
  }

  async login(loginDto: { email: string; password: string }) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new HttpException("Invalid credentials", 401);
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: {
    email: string;
    password: string;
    name: string;
    role?: string;
  }) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });
    if (existingUser) {
      throw new HttpException("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = this.userRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
      role: registerDto.role || "employee",
    });

    await this.userRepository.save(user);
    return { message: "User created successfully" };
  }

  async verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userRepository.findOne({
        where: { id: payload.userId },
      });
      return {
        valid: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    } catch {
      return { valid: false };
    }
  }

  // 🔹 Update user info (admin only)
  async updateUser(
    email: string,
    updateDto: {
      email?: string;
      name?: string;
      role?: string;
      password?: string;
    }
  ) {
    // 🔹 Find the user by email
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      console.log("User dengan email berikut tidak ditemukan:", email);
      throw new HttpException("User not found", 404);
    }

    // 🔹 Normalize new email if provided
    const normalizedEmail = updateDto.email?.toLowerCase();

    if (normalizedEmail && normalizedEmail !== user.email.toLowerCase()) {
      const existingUser = await this.userRepository.findOne({
        where: { email: normalizedEmail },
      });

      if (existingUser) {
        throw new HttpException("Email already in use", 400);
      }

      updateDto.email = normalizedEmail;
    } else {
      delete updateDto.email; // don’t overwrite with same email
    }

    // 🔹 Hash password if updated
    if (updateDto.password) {
      updateDto.password = await bcrypt.hash(updateDto.password, 10);
    }

    // 🔹 Update user safely
    await this.userRepository.update(user.id, updateDto);

    // 🔹 Return updated user
    const updatedUser = await this.userRepository.findOne({
      where: { id: user.id },
    });

    return { message: "User updated successfully", user: updatedUser };
  }

  // 🔹 Reset password (admin only)
  async resetPassword(userId: number, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException("User not found", 404);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await this.userRepository.save(user);

    return { message: "Password reset successfully" };
  }
}
