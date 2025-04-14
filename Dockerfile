# Bước 1: Sử dụng image cơ bản Node.js từ Docker Hub
FROM node:18

# Bước 2: Thiết lập thư mục làm việc
WORKDIR /app

# Bước 3: Sao chép package.json và package-lock.json (hoặc yarn.lock) vào container
COPY package*.json ./

# Bước 4: Cài đặt các dependencies
RUN npm install

# Bước 5: Sao chép toàn bộ mã nguồn vào container
COPY . .

# Bước 6: Expose cổng mà ứng dụng sẽ lắng nghe
EXPOSE 3000

# Bước 7: Chạy ứng dụng khi container khởi động
CMD ["npm", "run", "start"]
