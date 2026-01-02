const express = require('express');
const mongoose = require('mongoose');
const app = express();

// 🟢 SỬA TẠI ĐÂY: Sử dụng biến môi trường để Render đọc được link Atlas
// Nếu chạy ở máy local mà không có biến môi trường, nó sẽ dùng link mặc định phía sau
// Đoạn code kết nối sau khi đã thay password
const mongoURI = "mongodb+srv://huongvip2442_db_user:PnU8gu5tUgUC0zZg@cluster0.cpdx366.mongodb.net/smartlearn?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
    .then(() => console.log("✅ Kết nối MongoDB thành công!"))
    .catch(err => {
        console.error("❌ Lỗi kết nối chi tiết:", err);
        // In ra link đang kết nối để em dễ kiểm tra (không nên dùng khi chạy thực tế lâu dài)
        console.log("Link đang dùng là:", mongoURI);
    });

// Định nghĩa cấu trúc dữ liệu
const Activity = mongoose.model('Activity', new mongoose.Schema({
    student_id: String,
    campus_code: String,
    views: Number,
    score: Number
}), 'activities');

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    try {
        const total = await Activity.countDocuments();
        const stats = await Activity.aggregate([{ $group: { _id: '$campus_code', count: { $sum: 1 } } }]);
        const recent = await Activity.find().limit(10);
        
        res.render('index', { total, stats, recent });
    } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
        res.send("Đang đợi dữ liệu hoặc hệ thống đang đồng bộ...");
    }
});

// 🟢 SỬA TẠI ĐÂY: Render yêu cầu server chạy trên cổng được cấp phát (process.env.PORT)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`🚀 Web đang chạy tại cổng: ${PORT}`));
