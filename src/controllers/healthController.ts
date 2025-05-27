import { Request, Response } from 'express';

export class HealthController {
    async basicCheck(req: Request, res: Response) {
        try {
            const memoryUsage = process.memoryUsage();
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            
            return res.status(200).json({
                status: 'UP',
                uptime: `${hours}h ${minutes}m`,
                memory: {
                    used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
                    total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
                },
                version: process.env.npm_package_version || '1.0.0'
            });
        } catch (error) {
            return res.status(503).json({
                status: 'DOWN',
                error: 'Service Unavailable',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    async detailedCheck(req: Request, res: Response) {
        try {
            const basicInfo = await this.basicCheck(req, res);
            const data = basicInfo.json();

            // Informações adicionais
            const additionalInfo = {
                environment: process.env.NODE_ENV || 'development',
                nodeVersion: process.version,
                platform: process.platform,
                cpus: require('os').cpus().length,
                timestamp: new Date().toISOString()
            };

            return res.status(200).json({
                ...data,
                ...additionalInfo
            });
        } catch (error) {
            return res.status(503).json({
                status: 'DOWN',
                error: 'Service Unavailable',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
} 