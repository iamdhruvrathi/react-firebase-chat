const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
    api_key: import.meta.env.CLOUDINARY_API_KEY,
    api_secret: import.meta.env.CLOUDINARY_SECRET_KEY,
});

app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        res.json({ url: result.secure_url });
    } catch (error) {
        res.status(500).json({ error: 'Upload failed' });
    }
});

const uploadToBackend = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
    });

    const data = await res.json();
    return data.url;
};
