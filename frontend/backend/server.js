const path = require('path');

// ... kode lainnya ...

// Tambahkan ini sebelum definisi route
app.use(express.static(path.join(__dirname, '../build')));

// Tambahkan ini setelah semua definisi route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// ... kode lainnya ...