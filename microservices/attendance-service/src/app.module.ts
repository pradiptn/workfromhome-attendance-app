import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { Attendance } from './attendance.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'attendance_db',
      entities: [Attendance],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Attendance]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AppModule {}
