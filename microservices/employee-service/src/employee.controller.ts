import { Controller, Get, Post, Put, Delete, Body, Param, Headers } from '@nestjs/common';
import { EmployeeService } from './employee.service';

@Controller('employees')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @Get()
  async getAll(@Headers('authorization') auth: string) {
    return this.employeeService.getAll(auth);
  }

  @Post()
  async create(@Body() body: any, @Headers('authorization') auth: string) {
    return this.employeeService.create(body, auth);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() body: any, @Headers('authorization') auth: string) {
    return this.employeeService.update(id, body, auth);
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @Headers('authorization') auth: string) {
    return this.employeeService.delete(id, auth);
  }
}
