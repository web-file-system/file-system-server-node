const FS = require("fs");

const {
    SuccessCode,
    SuccessMessage,
    FailCode,
    FailMessage,
} = require("./ResponseUtil");

function uploadFile(ctx) {
    const request = ctx.request;
    const response = ctx.response;

    const queryObj = request.body;
    const { path } = queryObj;
    const file = request.files.file;

    if (path === undefined) {
        responseTemplate.fail.message = "缺少 path 参数";
        response.body = responseTemplate.fail;
    } else if (file === undefined) {
        responseTemplate.fail.message = "缺少 file 数据";
        response.body = responseTemplate.fail;
    } else {
        try {
            //创建写入流
            const writeStream = FS.createWriteStream(`${path}/${file.name}`);
            //创建读取流
            const readStream = FS.createReadStream(file.path);
            // 写入
            readStream.pipe(writeStream);
            // 返回数据
            const data = {
                code: SuccessCode,
                message: SuccessMessage,
            };
            response.body = data;
        } catch (error) {
            console.log("error:".error);
            const data = {
                code: FailCode,
                message: FailMessage,
            };
            response.body = data;
        }
    }
}

module.exports = {
    uploadFile,
};
