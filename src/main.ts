import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import *  as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  console.log('✅ SUPABASE_URL:', process.env.SUPABASE_URL);
  console.log('✅ SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY);

  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS so frontend (localhost:3001) can access the backend
  app.enableCors({
    origin: [
      'http://localhost:3000', // Local Next.js (development)
      'http://localhost:3001', // (if you're using 3001 for frontend)
      'https://pixelmint-uuxa.vercel.app', // ✅ Deployed frontend (Vercel)
    ],
    methods: 'GET,POST,PUT,DELETE',
    credentials: true, // ✅ If you plan to use cookies or auth tokens
  });

  await app.listen(3000);
  console.log('🚀 Server running on http://localhost:3000');
}
bootstrap();
