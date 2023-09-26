
const os = require('os')
console.log(`free memory in ${(os.freemem()/1024/1024/1024).toFixed(2)} GB`);
console.log(`total memory in ${(os.totalmem()/1024/1024/1024).toFixed(2)} GB`);

console.log(`version ${os.version()}`);
console.log(`CPU ${os.cpus()}`);


