# 📓 Sổ Lưu Bút Đa Hành Trình - Hệ Sinh Thái Nhóm Hảo Hán (Travel Journal Ecosystem)

**Định vị dự án:** Một ứng dụng Web (Local Web App) sinh ra để lưu trữ kỷ niệm, ảnh, và trải nghiệm cốt lõi của **Nhóm Hảo Hán** (gồm các đại ca: *Nguyễn Duy Tân, Trần Thế Dũng, Nguyễn Thế Quyết, Nguyễn Văn Tuyển, Lê Thị Xuân Thu, Nguyễn Khắc Hiếu, Trần Hải Nam*).

Slogan nhóm: **"Cảm ơn vua Tuyển!"**

Dự án được cố tình thiết kế để chạy hoàn toàn trên máy tính cá nhân (100% Local và Offline) với mục tiêu bảo mật dữ liệu riêng tư tuyệt đối.

---

## 🏗 Kiến trúc Hệ Thống (Architecture)

Quy mô dự án được chia làm 2 tầng (chạy chung 1 cửa sổ bằng thư viện `concurrently` với lệnh `npm run dev`):

- **Tầng Giao Diện (Frontend - Cổng 5173):** Xây dựng bằng hệ sinh thái siêu tốc: `React` + `Vite` + `TailwindCSS` + `Framer Motion` (để làm hiệu ứng UI cinematic).
- **Tầng Dữ Liệu (Local Backend - Cổng 3000):** Xây dựng bằng `Node.js` + `Express` + CSDL file phẳng (`data.json`) + `Multer` (để xử lý upload ảnh vào máy tính). 

---

## 🌟 Các Chức Năng Cốt Lõi (Core Features)

### 1. Định Danh Toàn Cầu (Global Identity) - `IdentityModal.tsx`
Người dùng lần đầu vào App sẽ gặp một màn hình xác nhận Danh Tính. Bảng chọn đã tích hợp sẵn 7 cái tên của nhóm Hảo Hán. Chỉ cần click chọn, danh tính sẽ lưu vào `localStorage ('travel_user')` và tự động gắn tên bạn vào Mọi Tin nhắn và Hình ảnh được tải lên.

### 2. Trang Tổng Quan (Dashboard) - `Dashboard.tsx`
Khung cảnh vũ trụ "Quyển sổ". Ở đây sẽ hiện các Hành Trình đã và đang đi dưới dạng các Card Glassmorphism có gắn Ảnh Bìa thực tế.
- **Tạo Chuyến Đi Mới:** Tính năng bọc trong `CreateTripModal.tsx`. Cho phép chọn Tên, Ngày, Màu Chủ Đạo và tải lên `Cover Image` qua chuẩn gửi `FormData`.

### 3. Không Gian Kỷ Niệm Tách Biệt (Trip Component)
Mỗi chuyến đi (Vd: `/trips/mu-cang-chai` hoặc `/trips/tam-chuc-legacy`) là một khoảng trời riêng.
Mã màu chủ đạo của chuyến đi đó sẽ được tiêm thẳng vào biến CSS Variable root (`--trip-primary`) khiến toàn bộ trang web tự đổi màu (Adaptive Theme) ăn khớp với màu chuyến đi.

### 4. Thanh Công Cụ Điều Hướng Nổi (Floating TripDock) - `TripDock.tsx`
Loại bỏ hệ thống Menu rập khuôn kiểu cũ. Dự án dùng một thanh Menu Nổi tĩnh (như MacOS Dock) nằm ở đáy màn hình. Cung cấp phím tắt tức thời mở các tính năng: *Bản Đồ*, *Chat*, và *Thư Viện Ảnh*.

### 5. Bản Đồ Hành Trình (Interactive Map) - `MapModal.tsx`
Một mạng lưới Vector SVG siêu xịn với hiệu ứng vẽ đường nét (Line-drawing animation) theo chuỗi Tuyến Tính (Timeline). Các điểm dừng chân (Checkpoints) sẽ được định nghĩa theo ID riêng của từng chuyến đi.

### 6. Kênh Thảo Luận Thời Gian Thực (Real-time Chat) - `ChatDrawer.tsx`
Một khung Chat Drawer mở ngang từ mép phải màn hình.
- **Công nghệ SSE (Server-Sent Events):** Không dùng Websocket cồng kềnh, không dùng Polling delay. Dự án dùng công nghệ SSE 1 chiều từ Server Node.js bắn về Client, cho phép mọi tin nhắn hiện ra ngay lập tức với **Độ trễ 0s**.
- Có hỗ trợ Xoá Tin Nhắn Của Chính Mình (`Trash2`). Giao diện tự động cuộn xuống tin nhắn mới nhất.

### 7. Thư Viện Cảnh Sắc (Photo Gallery) - `PhotoGalleryModal.tsx`
Bố cục Ảnh xếp gạch (Masonry Layout) tối đa không gian hiển thị ảnh.
- **Siêu Nén Ảnh Ở Máy Khách (Native Image Auto-Compression):** Logic nén ảnh nằm ở `src/lib/imageCompression.ts`. Ép phần cứng trình duyệt dùng API `HTMLCanvasElement` để nén tệp ảnh (dù 5MB hay 10MB) xuống `JPG` cỡ ~300KB TRƯỚC KHI chuyển về Server lưu trữ, giúp trang web load siêu lẹ.
- **Up Hàng Loạt:** Hỗ trợ kéo thả/chọn đa tệp (`<input multiple>`). Chuyển gói tin dạng mảng `File[]` thông qua `FormData`.
- **Tương tác Xã Hội:** 
  - Thả tim ảnh (Like button - `Heart`).
  - Xoá ảnh rác do chính mình up (Kèm lệnh truy quét `fs.unlinkSync` ở Server để xoá file vật lý).

---

## 📂 Kiến Trúc Dữ Liệu File Định Tuyến (Database Schema: `data.json`)
Server lưu toàn bộ dữ liệu vào `data.json` theo dạng cục bộ với bộ bọc sau:

```json
{
  "trips": [
    { "id": "...", "title": "...", "date": "...", "color": "...", "bg": "...", "coverUrl": "/uploads/..." }
  ],
  "messages": {
    "TRIP_ID_HERE": [
      { "id": "...", "author": "Nam", "content": "Tin nhắn...", "timestamp": "ISO_DateString" }
    ]
  },
  "photos": {
    "TRIP_ID_HERE": [
      { "id": "...", "url": "/uploads/...", "title": "Ảnh", "author": "Tuyển", "likes": ["Nam", "Thu"], "timestamp": "..." }
    ]
  }
}
```

---

## 🛠 Hướng Dẫn Phát Triển Cho AI Cấp Giới Thiệu (For Future AI Agents)

Gửi tới các AI đồng nghiệp nếu bạn được giao tiếp quản dự án này trong tương lai:

1. **Rule Cốt Lõi:** Hãy ưu tiên thiết kế trải nghiệm người dùng tối đa (Giao diện Dark Mode trong suốt với `glassmorphism`). **KHÔNG ĐƯỢC** làm rối Layout hiện tại bằng cách đập bỏ CSS hay thêm các khối màu Solid thô kệch.
2. **Quản Lý Biến Thể:** Các tuỳ chỉnh liên quan CSS như `--trip-primary`, `--trip-bg` và `--accent` cần được bám sát để giao diện luôn đồng nhất.
3. **Local Backend:** Các API luôn nằm gọn trong file `/server.js`. Phía Frontend gọi API qua bộ SDK nằm tại `/src/lib/api.ts`. Bất cứ API nào thêm mới đều phải làm đều ở 2 file này.
4. **Tuyệt đối không:** Dùng các thư viện bên thứ 3 cồng kềnh cho những tác vụ cơ bản. Dự án chuộng việc can thiệp bằng sức mạnh "Trình Duyệt Thuần Ký" (Vanilla Web API) như: `Canvas` để làm Ảnh nén, `EventSource` để làm Chat mượt, thay đổi root style để Dark theme, v.v..
