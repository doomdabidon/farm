import { createWriteStream } from "fs";


function fileUploadMiddleware(req, res, next) {
    const bodyBuffer = Buffer.from(req.body)
    let fileStartIndex = 0;
    let fileEndIndex = 0;

    for (let i = 0; i < bodyBuffer.length; i++) {
        if (bodyBuffer[i - 3] == 13 && bodyBuffer[i - 2] == 10 && bodyBuffer[i - 1] == 13 && bodyBuffer[i] == 10) {
            fileStartIndex = i;
            break;
        }
    }

    for (let i = bodyBuffer.length - 1; i < bodyBuffer.length; i--) {
        if (bodyBuffer[i] == 13 && bodyBuffer[i + 1] == 10) {
            fileEndIndex = i;
            break;
        }
    }

    const headers = bodyBuffer.subarray(0, fileStartIndex).toString()
    const fileName = headers.match(new RegExp('filename="(.*?)"'))[1]

    req.file = fileName

    const ws = createWriteStream(`${import.meta.dirname}/public/${fileName}`)
    ws.write(bodyBuffer.subarray(fileStartIndex + 1, fileEndIndex))
    ws.end()
    next()
}

export { fileUploadMiddleware }