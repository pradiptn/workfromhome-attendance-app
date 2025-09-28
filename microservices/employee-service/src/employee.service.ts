import { Injectable, HttpException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Employee } from "./employee.entity";
import axios from "axios";

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>
  ) {}

  private async verifyAdmin(authHeader: string) {
    try {
      const token = authHeader?.replace("Bearer ", "");
      const response = await axios.post(
        "http://auth-service:3001/auth/verify",
        { token }
      );
      if (!response.data.valid || response.data.user.role !== "admin") {
        throw new HttpException("Access denied", 403);
      }
      return response.data.user;
    } catch (error) {
      console.error("Auth verification failed:", error.message);
      throw new HttpException("Unauthorized", 401);
    }
  }

  async getAll(authHeader: string) {
    await this.verifyAdmin(authHeader);
    return this.employeeRepository.find();
  }

  async create(
    data: { name: string; email: string; password: string; role?: string },
    authHeader: string
  ) {
    await this.verifyAdmin(authHeader);

    // ✅ Register in AuthService (AuthService will hash the password)
    await axios.post(
      "http://auth-service:3001/auth/register",
      {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role || "employee",
      },
      {
        headers: { Authorization: authHeader },
      }
    );

    // ✅ Save employee without password
    const employee = this.employeeRepository.create({
      name: data.name,
      email: data.email,
      role: data.role || "employee",
    });

    await this.employeeRepository.save(employee);
    return employee;
  }

  async update(id: number, data: any, authHeader: string) {
    await this.verifyAdmin(authHeader);

    // 🔹 Find employee by ID first
    const currentEmployee = await this.employeeRepository.findOne({
      where: { id },
    });

    if (!currentEmployee) {
      throw new HttpException("Employee not found", 404);
    }

    const email = currentEmployee.email;

    console.log(81, currentEmployee.email)
    console.log(82, data.email)

    // ✅ Only send fields that actually change
    const userUpdateData: {
      email?: string;
      name?: string;
      role?: string;
      password?: string;
    } = {};

    if (data.email && data.email !== currentEmployee.email) {
      userUpdateData.email = data.email.toLowerCase();
    }
    if (data.name && data.name !== currentEmployee.name) {
      userUpdateData.name = data.name;
    }
    if (data.role && data.role !== currentEmployee.role) {
      userUpdateData.role = data.role;
    }
    if (data.password) {
      userUpdateData.password = data.password; // AuthService will hash it
    }

    if (Object.keys(userUpdateData).length > 0) {
      try {
        await axios.patch(
          `http://auth-service:3001/auth/users/${email}`,
          userUpdateData,
          { headers: { Authorization: authHeader } }
        );
        console.log("✅ User info updated in AuthService");
      } catch (error: any) {
        throw new HttpException(
          error.response?.data?.message ||
            "Failed to update user in auth service",
          error.response?.status || 500
        );
      }
    }

    // ✅ Update employee fields (excluding password)
    const { password, ...employeeData } = data;
    await this.employeeRepository.update({ id }, employeeData);

    return this.employeeRepository.findOne({ where: { id } });
  }

  async delete(id: number, authHeader: string) {
    await this.verifyAdmin(authHeader);

    // ✅ Also delete User in Auth Service
    await axios.delete(`http://auth-service:3001/auth/delete/${id}`, {
      headers: { Authorization: authHeader },
    });

    return this.employeeRepository.delete(id);
  }
}
