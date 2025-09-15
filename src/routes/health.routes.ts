import { Router, Request, Response } from 'express';
import { testConnection } from '../db/connection';

export const createHealthRoutes = (): Router => {
  const router = Router();

  router.get('/health', async (req: Request, res: Response): Promise<void> => {
    const timestamp = new Date().toISOString();
    
    try {
      const dbResult = await testConnection();
      
      const healthStatus = {
        status: dbResult.success ? 'healthy' : 'unhealthy',
        timestamp,
        services: {
          api: 'healthy',
          database: dbResult.success ? 'healthy' : 'unhealthy'
        },
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
        ...(dbResult.error && { databaseError: dbResult.error })
      };

      const statusCode = dbResult.success ? 200 : 503;
      res.status(statusCode).json(healthStatus);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({
        status: 'unhealthy',
        timestamp,
        services: {
          api: 'healthy',
          database: 'unhealthy'
        },
        uptime: process.uptime(),
        error: 'Health check failed',
        details: errorMessage
      });
    }
  });

  return router;
};