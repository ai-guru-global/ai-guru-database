import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(process.cwd(), 'public')));
app.use('/src', express.static(path.join(process.cwd(), 'src')));
app.use('/node_modules', express.static(path.join(process.cwd(), 'node_modules')));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(process.cwd(), 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});