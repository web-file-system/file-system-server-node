const FS = require("fs/promises");
const {
    SuccessCode,
    SuccessMessage,
    FailCode,
    FailMessage,
} = require("./ResponseUtil");

function newDir(ctx) {
    const request = ctx.request;
    const response = ctx.response;
    const queryObj = request.body;
    const { path, name } = queryObj;

    if (path === undefined) {
        const data = {
            code: FailCode,
            message: "缺少 path 参数",
        };
        response.body = data;
    } else if (name === undefined) {
        const data = {
            code: FailCode,
            message: "缺少 name 数据",
        };
        response.body = data;
    } else {
        console.log("mkdir0", `${path}/${name}`);

        return FS.mkdir(`${path}/${name}`)
            .then(() => {
                console.log("mkdir1", `${path}/${name}`);
                const data = {
                    code: SuccessCode,
                    message: SuccessMessage,
                };
                response.body = data;
            })
            .catch((error) => {
                console.log("error:".error);
                const data = {
                    code: FailCode,
                    message: FailMessage,
                };
                response.body = data;
            });
    }
}

module.exports = {
    newDir,
};
