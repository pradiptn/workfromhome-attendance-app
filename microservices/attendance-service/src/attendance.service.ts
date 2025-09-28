import { Injectable, HttpException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Attendance } from "./attendance.entity";
import axios from "axios";

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>
  ) {}

  private async verifyUser(authHeader: string) {
    try {
      const token = authHeader?.replace("Bearer ", "");
      const response = await axios.post(
        "http://auth-service:3001/auth/verify",
        { token }
      );
      if (!response.data.valid) {
        throw new HttpException("Unauthorized", 401);
      }
      return response.data.user;
    } catch {
      throw new HttpException("Unauthorized", 401);
    }
  }

  async create(file: Express.Multer.File, notes: string, authHeader: string) {
    const user = await this.verifyUser(authHeader);

    if (!file) {
      throw new HttpException("No photo uploaded", 400);
    }

    // 🔹 Check if user already has an attendance today
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const existingAttendance = await this.attendanceRepository
      .createQueryBuilder("attendance")
      .where("attendance.userId = :userId", { userId: user.id })
      .andWhere(
        "attendance.createdAt >= :startOfDay AND attendance.createdAt < :endOfDay",
        {
          startOfDay,
          endOfDay,
        }
      )
      .getOne();

    if (existingAttendance) {
      throw new HttpException(
        "You have already submitted attendance today",
        400
      );
    }

    // 🔹 Handle file extension
    const originalExtension = file.originalname.split(".").pop() || "";
    let finalFilename = file.filename;
    if (!finalFilename.endsWith(`.${originalExtension}`)) {
      finalFilename = `${file.filename}.${originalExtension}`;
    }

    const attendance = this.attendanceRepository.create({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      photoPath: `uploads/${finalFilename}`,
      notes,
    });

    return this.attendanceRepository.save(attendance);
  }

  async getAll(userId: number | undefined, authHeader: string) {
  const user = await this.verifyUser(authHeader);
  const query = this.attendanceRepository.createQueryBuilder("attendance");

  if (user.role !== "admin") {
    // Non-admins can only see their own attendance
    query.where("attendance.userId = :userId", { userId: user.id });
  } else if (userId) {
    // Optional: admin can filter by specific user
    query.where("attendance.userId = :userId", { userId });
  }

  return query.orderBy("attendance.createdAt", "DESC").getMany();
}


  async getDashboard(authHeader: string) {
    const user = await this.verifyUser(authHeader);
    if (user.role !== "admin") {
      throw new HttpException("Access denied", 403);
    }

    const totalAttendances = await this.attendanceRepository.count();
    const today = new Date().toISOString().split("T")[0];
    const todayAttendances = await this.attendanceRepository
      .createQueryBuilder("attendance")
      .where("DATE(attendance.createdAt) = :today", { today })
      .getCount();

    const recentAttendances = await this.attendanceRepository.find({
      order: { createdAt: "DESC" },
      take: 5,
    });

    // Get employee count from employee service
    let totalEmployees = 0;
    try {
      const response = await axios.get(
        "http://employee-service:3002/employees",
        {
          headers: { authorization: authHeader },
        }
      );
      totalEmployees = response.data.length;
    } catch (error) {
      console.error("Failed to get employee count:", error);
    }

    return {
      totalEmployees,
      totalAttendances,
      todayAttendances,
      recentAttendances,
    };
  }
}
