import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';

@Injectable()
export class GatewayService {
  async proxyRequest(targetUrl: string, req: Request, res: Response) {
    try {
      const config: any = {
        method: req.method,
        url: `${targetUrl}${req.url}`,
        headers: {
          ...req.headers,
          host: undefined,
        },
        params: req.query,
        validateStatus: (status: number) => status < 500, // Accept all status codes < 500
      };

      // Handle form data and file uploads
      if (req.headers['content-type']?.includes('multipart/form-data')) {
        config.data = req;
        config.headers['content-type'] = req.headers['content-type'];
      } else {
        config.data = req.body;
      }

      const response = await axios(config);
      
      // Handle 304 Not Modified responses
      if (response.status === 304) {
        res.status(304).end();
        return;
      }
      
      res.status(response.status).json(response.data);
    } catch (error: any) {
      console.error('Gateway proxy error:', error.message);
      const status = error.response?.status || 500;
      const data = error.response?.data || { message: 'Internal server error' };
      res.status(status).json(data);
    }
  }
}
