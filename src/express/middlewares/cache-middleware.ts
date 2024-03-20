import express, { Request, Response, NextFunction } from 'express';

interface CacheContent {
  data: any;
  timestamp: number;
}

export class CacheMiddleware {
  private cache: Record<string, CacheContent> = {};
  private ttl: number;

  constructor(ttl: number = 300000) {
    this.ttl = ttl;
  }

  public getMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const key: string = req.originalUrl;
      const cachedContent: CacheContent | undefined = this.cache[key];
      if (cachedContent && Date.now() - cachedContent.timestamp < this.ttl) {
        console.log(`Serving from cache: ${key}`);
        res.send(cachedContent.data);
      } else {
        const originalSend = res.send.bind(res);
        res.send = (body: any): Response => {
          this.cache[key] = { data: body, timestamp: Date.now() };
          return originalSend(body);
        };
        next();
      }
    };
  }
}
