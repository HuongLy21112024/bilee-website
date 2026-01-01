const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Kết nối tới cụm MongoDB của em trong Docker
const mongoURI = 'mongodb://mongodb_trungtam:27017,mongodb_danang:27018,mongodb_hcm:27019/smartlearn?replicaSet=rs0&readPreference=primaryPreferred&serverSelectionTimeoutMS=5000';

mongoose.connect(mongoURI)
    .then(() => console.log("✅ Đã kết nối tới cụm MongoDB Phân Tán thành công!"))
    .catch(err => console.error("❌ Lỗi kết nối:", err));

// Định nghĩa cấu trúc dữ liệu để Web có thể đọc được
const Activity = mongoose.model('Activity', new mongoose.Schema({
    student_id: String,
    campus_code: String,
    views: Number,
    score: Number
}), 'activities');

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    try {
        // Lấy dữ liệu thật từ MongoDB để đưa lên Web
        const total = await Activity.countDocuments();
        const stats = await Activity.aggregate([{ $group: { _id: '$campus_code', count: { $sum: 1 } } }]);
        const recent = await Activity.find().limit(10);
        
        res.render('index', { total, stats, recent });
    } catch (err) {
        res.send("Đang đợi dữ liệu hoặc hệ thống đang đồng bộ...");
    }
});

app.listen(3000, () => console.log("🚀 Web đang chạy tại: http://localhost:3000"));