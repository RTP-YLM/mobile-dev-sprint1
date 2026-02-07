import { Request, Response, NextFunction } from 'express';

/**
 * Request Logging Middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const timestamp = new Date().toISOString();
  const { method, originalUrl, ip } = req;
  
  console.log(`[${timestamp}] ${method} ${originalUrl} - IP: ${ip}`);
  
  // Log response time
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    console.log(`[${timestamp}] ${method} ${originalUrl} - ${statusCode} - ${duration}ms`);
  });
  
  next();
};

/**
 * Security Headers Middleware
 */
export const securityHeaders = (req: Request, res: Response, next: NextFunction): void => {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
};