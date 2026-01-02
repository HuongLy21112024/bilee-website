const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// --- MIDDLEWARE ---
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Cần thiết để xử lý API JSON

// --- KẾT NỐI DATABASE ---
const mongoURI = "mongodb+srv://huongvip2442_db_user:PnU8gu5tUGuC0zZg@cluster0.cpdx366.mongodb.net/smartlearn?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
    .then(() => console.log("✅ Kết nối MongoDB thành công!"))
    .catch(err => console.error("❌ Lỗi kết nối:", err));

// --- SCHEMA & MODEL ---
const activitySchema = new mongoose.Schema({
    activity_id: String,
    user_id: String,
    action: String,
    material_id: String,
    campus_code: String,
    timestamp: { type: Date, default: Date.now }
});
activitySchema.index({ user_id: 1 }); // Tạo chỉ mục cho user_id để tìm kiếm nhanh hơn
activitySchema.index({ campus_code: 1 }); // Tạo chỉ mục cho campus_code để thống kê nhanh hơn
const Activity = mongoose.model('Activity', activitySchema, 'activities');

// --- ROUTES ---

// A. Giao diện chính
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// B. CREATE: Thêm mới
app.post('/add-activity', async (req, res) => {
    try {
        const newAct = new Activity(req.body);
        await newAct.save();
        res.redirect('/'); // Lưu xong tải lại trang
    } catch (err) { res.status(500).send(err.message); }
});

// C. READ: API lấy danh sách hoạt động (Để hiển thị lên bảng)
app.get('/api/activities', async (req, res) => {
    const data = await Activity.find().sort({ timestamp: -1 });
    res.json(data);
});

// D. AGGREGATION: API Thống kê theo Campus
app.get('/api/stats', async (req, res) => {
    const stats = await Activity.aggregate([
        { $group: { _id: "$campus_code", count: { $sum: 1 } } }
    ]);
    res.json(stats);
});

// E. DELETE: Xóa hoạt động
app.get('/delete/:id', async (req, res) => {
    await Activity.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


