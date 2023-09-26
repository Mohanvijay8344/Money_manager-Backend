const fs = require('fs')

const quote = "Mohan is a bad boy"

// fs.appendFile("./backup/Mohan-15",  "\n" + data, (err) => {
//     if(err){
//         console.log("Error");
//     }
//     else{
//         console.log("Overwrited Successfull");
//     }
// })

for (let i = process.argv[3]; i <= process.argv[2]; i++) {
    fs.unlink(`./backup/Mohan-${i}`, (err) => {
        console.log("deleting completed");
    })
}
