# Vũ Điệu Trật Tự (Order Dance)

Chào mừng bạn đến với "Vũ Điệu Trật Tự"! Đây là một trò chơi giải đố logic được xây dựng bằng Next.js, nơi bạn sẽ vận dụng tư duy lập trình để điều khiển nhân vật vượt qua thử thách.



## Giới thiệu

Trong "Vũ Điệu Trật Tự", bạn không điều khiển nhân vật trực tiếp. Thay vào đó, bạn sẽ tạo ra một kịch bản (script) bao gồm một chuỗi các lệnh di chuyển. Mục tiêu của bạn là lập trình "vũ điệu" hoàn hảo để đưa nhân vật đến đích mà không va chạm với kẻ địch.

## Luật chơi

### Mục tiêu
- **Thắng:** Đưa nhân vật (hình tam giác màu xanh) đến ô đích (hình tròn màu xanh lá).
- **Thua:** Va chạm với kẻ địch (hình vuông màu đỏ).

### Tính điểm
- Bạn bắt đầu với **1000 điểm**.
- Mỗi lệnh bạn thêm vào kịch bản sẽ trừ đi **10 điểm**.
- Kịch bản càng ngắn gọn và hiệu quả, điểm số cuối cùng của bạn càng cao. Hãy cố gắng tìm ra lời giải tối ưu nhất!

### Kẻ địch
- Các kẻ địch di chuyển theo một quy luật (pattern) được lập trình sẵn và lặp lại sau mỗi bước đi của bạn. Hãy quan sát và tính toán đường đi của chúng để né tránh.

## Cách chơi

1.  **Thêm lệnh:** Sử dụng "Bảng Lập Trình" ở bên phải. Nhấn vào các nút lệnh (`Tiến`, `Lùi`, `Rẽ Trái`, `Rẽ Phải`, `Dừng`) để thêm chúng vào kịch bản của bạn.
2.  **Sắp xếp kịch bản:** Bạn có thể kéo và thả các lệnh trong danh sách để thay đổi thứ tự thực hiện.
3.  **Thực thi:** Khi đã sẵn sàng, nhấn nút **"Chạy Vũ Điệu"**. Nhân vật sẽ bắt đầu di chuyển theo đúng kịch bản bạn đã tạo.
4.  **Làm lại:**
    - **"Xóa Script":** Xóa tất cả các lệnh trong kịch bản hiện tại.
    - **"Chơi Lại":** Đặt lại toàn bộ màn chơi, bao gồm vị trí nhân vật, kẻ địch và xóa kịch bản.

## Cài đặt & Chạy dự án

Dự án này được xây dựng trên nền tảng Next.js.

### Yêu cầu
- [Node.js](https://nodejs.org/) (phiên bản 18.x trở lên)
- [npm](https://www.npmjs.com/) hoặc [yarn](https://yarnpkg.com/)

### Các bước cài đặt

1.  **Clone repository:**
    ```bash
    git clone https://github.com/your-username/order-dance.git
    cd order-dance
    ```

2.  **Cài đặt các dependency:**
    ```bash
    npm install
    ```
    hoặc
    ```bash
    yarn install
    ```

3.  **Chạy ứng dụng ở chế độ development:**
    ```bash
    npm run dev
    ```
    hoặc
    ```bash
    yarn dev
    ```

4.  Mở trình duyệt và truy cập `http://localhost:9002` để bắt đầu chơi.

Chúc bạn có những giờ phút giải trí vui vẻ và rèn luyện tư duy lập trình hiệu quả!
