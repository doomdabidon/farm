const fs = require('fs');
console.time('start');
const data1 = fs.readFileSync('lesson2/1.png');
const data2 = fs.readFileSync('lesson2/2.djvu');
const data3 = fs.readFileSync('lesson2/3.pdf');
const data4 = fs.readFileSync('lesson2/4.txt');
const data5 = fs.readFileSync('lesson2/5.pdf');
const data6 = fs.readFileSync('lesson2/6.pdf');
const data7 = fs.readFileSync('lesson2/7.jpg');
const data8 = fs.readFileSync('lesson2/8.pdf');

console.log(
data1.byteLength +
data2.byteLength +
data3.byteLength +
data4.byteLength +
data5.byteLength +
data6.byteLength +
data7.byteLength +
data8.byteLength
);

console.timeEnd('start');
