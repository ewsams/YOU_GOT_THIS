require('dotenv').config();
const { execSync } = require('child_process');

const awsCommand = `aws s3 sync dist/ s3://you-got-this-front-end`;
execSync(awsCommand, { stdio: 'inherit' });
