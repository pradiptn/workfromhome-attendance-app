import { Controller, Get, Post, Body, Headers, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AttendanceService } from './attendance.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        // Append extension to avoid missing extension issue
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname); // get extension (.jpg, .png, etc.)
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { notes?: string },
    @Headers('authorization') auth: string
  ) {
    return this.attendanceService.create(file, body.notes, auth);
  }

  @Get()
  async getAll(@Query('userId') userId: number, @Headers('authorization') auth: string) {
    return this.attendanceService.getAll(userId, auth);
  }

  @Get('dashboard')
  async getDashboard(@Headers('authorization') auth: string) {
    return this.attendanceService.getDashboard(auth);
  }
}
