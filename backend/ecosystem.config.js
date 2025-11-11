// backend/ecosystem.config.js
module.exports = {
  apps: [{
    name: 'herbai-backend',
    script: './server.js',
    instances: 1, // Use 1 for starters, can change to 'max' later
    exec_mode: 'fork', // Use 'cluster' when you have multiple instances
    env: {
      NODE_ENV: 'development',
      PORT: 5000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    // Log files
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    
    // Auto-restart settings
    autorestart: true,
    watch: false, // Set to true for development auto-restart
    max_memory_restart: '1G',
    
    // Graceful start/shutdown
    kill_timeout: 5000,
    listen_timeout: 3000,
    
    // Monitoring
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss'
  }]
};