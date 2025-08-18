import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';

export default RedisModule.forRootAsync({
  useFactory: (nacosService: ConfigService) => {
    return {
      type: 'single',
      options: {
        host: nacosService.get<string>('REDIS_HOST'),
        username: nacosService.get<string>('REDIS_USERNAME'),
        password: nacosService.get<string>('REDIS_PASSWORD'),
        db: nacosService.get<number>('REDIS_DB'),
        port: nacosService.get<number>('REDIS_PORT'),
      },
    };
  },
  imports: [ConfigModule],
  inject: [ConfigService],
});
