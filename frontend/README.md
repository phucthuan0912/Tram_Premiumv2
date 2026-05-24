# ForeverVN Frontend

Frontend user-facing cho website ForeverVN.
forevervn-ecommerce.vercel.app đã deploy
App này chịu trách nhiệm:

- hiển thị trang chủ, collection, product detail
- giỏ hàng và thanh toán
- đăng ký, đăng nhập, quên mật khẩu
- newsletter subscribe
- đánh giá sản phẩm
- mua ngay và hiệu ứng add-to-cart

## 1. Công nghệ dùng

- React
- Vite
- React Router
- Axios
- React Toastify
- Tailwind CSS

## 2. Các trang chính

Trong [src/pages](C:\Users\Admin\Desktop\Ecommerce-app\forevervn-ecommerce\frontend\src\pages):

- `Home.jsx`
- `Collection.jsx`
- `Product.jsx`
- `Cart.jsx`
- `PlaceOrder.jsx`
- `Orders.jsx`
- `Login.jsx`
- `MyAccount.jsx`
- `About.jsx`
- `Contact.jsx`

## 3. Chạy local

Di chuyển vào thư mục `frontend`:

```bash
npm install
```

Tạo file `.env`, sau đó chạy:

```bash
npm run dev
```

App mặc định chạy bằng Vite, thường ở:

```txt
http://localhost:5173
```

## 4. Scripts

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

## 5. Biến môi trường

Tạo file `.env` trong thư mục `frontend`:

```env
VITE_BACKEND_URL=http://localhost:4000
```

Khi deploy production:

```env
VITE_BACKEND_URL=https://your-backend.onrender.com
```

Frontend đang đọc biến này trong:

- [ShopContext.jsx](C:\Users\Admin\Desktop\Ecommerce-app\forevervn-ecommerce\frontend\src\context\ShopContext.jsx)

## 6. Tính năng chính

### Trang chủ

- hero
- banner slider
- best seller
- latest collection
- newsletter subscribe
- các khối editorial / story

### Product detail

- chọn size
- thêm vào giỏ
- `Buy Now`
- virtual try-on cho nhóm áo quần
- review

### Giỏ hàng và checkout

- lưu cart theo token user
- hỗ trợ guest cart
- đồng bộ cart về backend khi đăng nhập

### Tài khoản

- login / sign up
- forgot password bằng OTP
- cập nhật profile

### Newsletter

- subscribe bằng email thật
- backend sẽ gửi voucher qua email nếu đã cấu hình mail

## 7. Build production

Từ thư mục `frontend`:

```bash
npm run build
```

Output sẽ nằm trong:

```txt
dist/
```

## 8. Deploy lên Vercel

Khuyến nghị deploy frontend này trên Vercel.

Thiết lập:

- Framework Preset: `Vite`
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

Environment Variables:

```env
VITE_BACKEND_URL=https://your-backend.onrender.com
```

## 9. Checklist chạy local

Trước khi chạy local, kiểm tra:

- [ ] đã có file `frontend/.env`
- [ ] đã điền `VITE_BACKEND_URL`
- [ ] backend local đang chạy ở `http://localhost:4000`
- [ ] đã chạy `npm install`
- [ ] đã chạy `npm run dev`
- [ ] mở `http://localhost:5173` được

## 10. Checklist trước khi deploy Vercel

Trước khi bấm deploy:

- [ ] code mới nhất đã push lên GitHub
- [ ] chọn đúng Root Directory là `frontend`
- [ ] Build Command là `npm run build`
- [ ] Output Directory là `dist`
- [ ] Install Command là `npm install`
- [ ] đã thêm `VITE_BACKEND_URL` trỏ đến backend Render
- [ ] backend Render đang live

## 11. Checklist test sau deploy

Sau khi frontend live, test lần lượt:

- [ ] mở trang home
- [ ] vào collection
- [ ] mở product detail
- [ ] chọn size và add to cart
- [ ] test hiệu ứng add-to-cart
- [ ] test `Buy Now`
- [ ] test login
- [ ] test sign up
- [ ] test forgot password OTP
- [ ] test newsletter subscribe
- [ ] test review sản phẩm
- [ ] test đặt hàng
- [ ] test lịch sử đơn hàng

## 12. Các lỗi hay gặp

### Không load được dữ liệu

Kiểm tra:

- `VITE_BACKEND_URL` có đúng không
- backend Render có live không
- backend có lỗi CORS hoặc env không

### Quên mật khẩu không gửi OTP

Kiểm tra ở backend:

- `EMAIL_USER`
- `EMAIL_PASS`
- Gmail App Password có đúng không

### Newsletter không gửi mail

Kiểm tra ở backend:

- route `/api/system/newsletter/subscribe`
- voucher `SUBSCRIBE` có active không
- cấu hình Gmail đã đúng chưa

### Giỏ hàng bị sai giữa guest và user

Kiểm tra:

- token trong localStorage
- backend cart API
- cart sync sau khi login

## 13. Ghi chú

- Frontend hiện là app Vite thuần, không dùng SSR
- nếu deploy ở Vercel, nhớ luôn kiểm tra đúng `Root Directory`
- nếu backend đổi domain, phải cập nhật lại `VITE_BACKEND_URL`
