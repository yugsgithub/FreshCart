import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';

const app = express();
const port = process.env.PORT || 4000;

// ✅ 1. CORS setup (must come before all routes/middleware)
const allowedOrigins = [
  'http://localhost:5173',
  'https://freshcart.vercel.app',
  'https://freshcart-project-nrem.vercel.app',
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // ✅ allow cookies from cross-origin
}));

// ✅ 2. Stripe webhook route (must come before express.json)
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// ✅ 3. Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ 4. DB & Cloudinary init
const startServer = async () => {
  try {
    await connectDB();
    await connectCloudinary();

    // ✅ 5. Routes
    app.get('/', (req, res) => res.send('✅ API is working'));

    app.use('/api/user', userRouter);
    app.use('/api/seller', sellerRouter);
    app.use('/api/product', productRouter);
    app.use('/api/cart', cartRouter);
    app.use('/api/address', addressRouter);
    app.use('/api/order', orderRouter);

    // ✅ 6. Start the server
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });

  } catch (error) {
    console.error('❌ Server failed to start:', error.message);
  }
};

startServer();
