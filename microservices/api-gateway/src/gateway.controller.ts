import { Controller, All, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { GatewayService } from "./gateway.service";

@Controller()
export class GatewayController {
  constructor(private gatewayService: GatewayService) {}

  private getServiceUrl(service: string, port: number): string {
    // Check if running in Docker by looking for Docker-specific environment
    const isDocker =
      process.env.NODE_ENV === "production" ||
      process.env.DOCKER_ENV === "true" ||
      process.env.HOSTNAME?.includes("docker");
    const host = isDocker ? service : "localhost";
    return `http://${host}:${port}`;
  }

  @All("auth/*")
  async authProxy(@Req() req: Request, @Res() res: Response) {
    return this.gatewayService.proxyRequest(
      this.getServiceUrl("auth-service", 3001),
      req,
      res
    );
  }

  @All("employees/*")
  async employeeProxy(@Req() req: Request, @Res() res: Response) {
    return this.gatewayService.proxyRequest(
      this.getServiceUrl("employee-service", 3002),
      req,
      res
    );
  }

  @All("employees")
  async employeeProxyRoot(@Req() req: Request, @Res() res: Response) {
    return this.gatewayService.proxyRequest(
      this.getServiceUrl("employee-service", 3002),
      req,
      res
    );
  }

  @All("attendance/*")
  async attendanceProxy(@Req() req: Request, @Res() res: Response) {
    return this.gatewayService.proxyRequest(
      this.getServiceUrl("attendance-service", 3003),
      req,
      res
    );
  }

  @All("attendance")
  async attendanceProxyRoot(@Req() req: Request, @Res() res: Response) {
    return this.gatewayService.proxyRequest(
      this.getServiceUrl("attendance-service", 3003),
      req,
      res
    );
  }
  @All("attendance/uploads/*")
  async attendanceUploadsProxy(@Req() req: Request, @Res() res: Response) {
    return this.gatewayService.proxyRequest(
      this.getServiceUrl("attendance-service", 3003),
      req,
      res
    );
  }
}
