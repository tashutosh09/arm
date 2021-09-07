var fs = require('fs');
export const Config = JSON.parse(fs.readFileSync(process.argv.slice(2)[0], 'utf8'));