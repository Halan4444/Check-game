// src/config/typeorm.config-migrations.ts

import { DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export function getConfig(): DataSourceOptions {
    return {
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [path.join(__dirname, '/../**/*.entity{.ts,.js}')],
        migrations: [path.join(__dirname, '/../database/migrations/*{.ts,.js}')],
        extra: {
            charset: 'utf8mb4_unicode_ci',
        },
        logging: true,
    };
}
