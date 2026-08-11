const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '.')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function getPatchedHTML(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  // Fix old large banner image → correct 600px image
  html = html.replace(
    /https:\/\/files\.manuscdn\.com\/[^"]*noGehyQRvpgAqtLx\.png/g,
    'https://files.manuscdn.com/user_upload_by_module/session_file/310519663742383821/UVrfoDInbxuUxlJH.png'
  );
  // Fix width:100% → proper centered sizing
  html = html.replace(
    /style="width:100%; display:block; border-radius:0; box-shadow:none;"/g,
    'style="display:block; width:min(90%, 600px); height:auto; margin:0 auto; border-radius:0; box-shadow:none;"'
  );
  return html;
}

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.get('/', (req, res) => {
  try {
    const html = getPatchedHTML(path.join(__dirname, 'index.html'));
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.send(html);
  } catch (e) {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

app.get('/privacy-policy', (req, res) => {
  res.sendFile(path.join(__dirname, 'privacy-policy.html'));
});

app.get('/terms', (req, res) => {
  res.sendFile(path.join(__dirname, 'terms.html'));
});

app.get('/vision', (req, res) => {
  res.sendFile(path.join(__dirname, 'vision.html'));
});

app.get('/team', (req, res) => {
  res.sendFile(path.join(__dirname, 'team.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
