import app from './app';
import config from './config/app.config';

// Start server
const PORT = parseInt(config.port.toString(), 10);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
  console.log(`API available at http://0.0.0.0:${PORT}/api`);
});