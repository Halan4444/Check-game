import {TypeOrmModule, TypeOrmModuleAsyncOptions, TypeOrmModuleOptions} from "@nestjs/typeorm";
import {ConfigModule, ConfigService} from "@nestjs/config";
import 'dotenv/config'



export const typeormConfigAsync: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
        return {
            type: 'postgres',
            host: configService.get('DB_HOST'),
            port: configService.get('DB_PORT'),
            username:configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_NAME'),
            entities: [
                __dirname + '/../**/*.entity{.ts,.js}',
            ],
            migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
            extra: {
                charset:'utf8mb4_unicode_ci'
            },
            synchronize: true,
            logging: true
        }
    },
    inject:[ConfigService]
}

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username:process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
        __dirname + '/../**/*.entity{.ts,.js}',
    ],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    extra: {
        charset:'utf8mb4_unicode_ci'
    },
    logging: true
} ;

