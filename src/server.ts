import app from './app';
import config from './config/app.config';

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
  console.log(`API available at http://localhost:${PORT}/api`);
});