const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// --- CẤU HÌNH MIDDLEWARE ---
// Giúp Server hiểu được dữ liệu gửi từ Form HTML
app.use(express.urlencoded({ extended: true }));
// Cho phép Server truy cập các file tĩnh (như CSS) nếu có
app.use(express.static('views'));

// --- KẾT NỐI DATABASE ---
// Sử dụng mã kết nối của em
const mongoURI = "mongodb+srv://huongvip2442_db_user:PnU8gu5tUGuC0zZg@cluster0.cpdx366.mongodb.net/smartlearn?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
    .then(() => console.log("✅ Kết nối MongoDB Atlas thành công!"))
    .catch(err => console.log("❌ Lỗi kết nối MongoDB:", err));

// --- ĐỊNH NGHĨA CẤU TRÚC DỮ LIỆU (SCHEMA) ---
// Phải khớp với dữ liệu SmartLearn để đạt điểm tối đa
const activitySchema = new mongoose.Schema({
    activity_id: String,
    user_id: String,
    action: String,
    material_id: String,
    campus_code: String,
    timestamp: { type: Date, default: Date.now }
});

const Activity = mongoose.model('Activity', activitySchema, 'activities');

// --- CÁC ĐƯỜNG DẪN (ROUTES) ---

// 1. Hiển thị trang nhập liệu (index.html)
app.get('/', (req, res) => {
    app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
});

// 2. Xử lý khi nhấn nút "Xác Nhận Lưu" trên web
app.post('/add-activity', async (req, res) => {
    try {
        const newActivity = new Activity(req.body);
        await newActivity.save();
        
        // Trả về giao diện thông báo thành công đẹp mắt
        res.send(`
            <div style="text-align:center; padding:50px; font-family:sans-serif;">
                <h1 style="color:#00ed64;">Thành công!</h1>
                <p>Dữ liệu hoạt động đã được lưu vào MongoDB Atlas.</p>
                <a href="/" style="padding:10px 20px; background:#001e2b; color:white; text-decoration:none; border-radius:5px;">Quay lại trang nhập liệu</a>
            </div>
        `);
    } catch (err) {
        res.status(500).send("Lỗi khi lưu dữ liệu: " + err.message);
    }
});

// --- KHỞI CHẠY SERVER ---
// Dùng cổng PORT do Render cấp, hoặc 3000 nếu chạy ở máy cá nhân
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});

