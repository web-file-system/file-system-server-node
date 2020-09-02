const { createGzip } = require("zlib");
const { pipeline } = require("stream");
const { createReadStream, createWriteStream } = require("fs");
const { promisify } = require("util");
const pipe = promisify(pipeline);
const FS = require("fs/promises");
const {
    SuccessCode,
    SuccessMessage,
    FailCode,
    FailMessage,
} = require("./ResponseUtil").default;

function zip(input, output) {
    return new Promise((resolve, reject) => {
        FS.access(input)
            .then(() => {
                // 可访问
                const gzip = createGzip();
                const source = createReadStream(input);
                const destination = createWriteStream(output);
                pipe(source, gzip, destination)
                    .then(() => {
                        const res = {
                            code: SuccessCode,
                            message: SuccessMessage,
                        };
                        resolve(res);
                    })
                    .catch(() => {
                        const error = {
                            code: FailCode,
                            message: FailMessage,
                        };
                        reject(error);
                    });
            })
            .catch(() => {
                // 不可访问
                const error = {
                    code: FailCode,
                    message: FailMessage,
                };
                reject(error);
            });
    });
}

exports.default = {
    zip,
};
