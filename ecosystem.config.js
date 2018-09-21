module.exports = {
  apps : [{
    name: 'eth-service-client',
    script: 'bin/www',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'vadmin',
      host : '192.168.23.193',
      ref  : 'origin/master',
      repo : 'git@192.168.2.210:repository2/eth-service-client',
      path : '/home/vadmin/workspace_ethereum/eth-service-client',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
