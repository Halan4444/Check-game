import { SesModule } from '@nextnm/nestjs-ses';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        SesModule.forRoot({
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            region: 'us-east-1',
        }),
    ],
    providers: [],
    exports: [],
})
export class AwsModule {}