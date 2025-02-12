const fs = require('fs').promises;

const main = async () => {
    console.time('start');
    const file1 = fs.readFile('lesson2/1.png');
    const file2 = fs.readFile('lesson2/2.djvu');
    const file3 = fs.readFile('lesson2/3.pdf');
    const file4 = fs.readFile('lesson2/4.txt');
    const file5 = fs.readFile('lesson2/5.pdf');
    const file6 = fs.readFile('lesson2/6.pdf');
    const file7 = fs.readFile('lesson2/7.jpg');
    const file8 = fs.readFile('lesson2/8.pdf');

    const [
        data1,
        data2,
        data3,
        data4,
        data5,
        data6,
        data7,
        data8
    ] = await Promise.all([
        file1,
        file2,
        file3,
        file4,
        file5,
        file6,
        file7,
        file8,
    ])
    console.timeEnd('start');


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
}

main().then()

