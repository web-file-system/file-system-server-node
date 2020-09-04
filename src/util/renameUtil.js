const FS = require("fs/promises");
const {
    SuccessCode,
    SuccessMessage,
    FailCode,
    FailMessage,
} = require("./ResponseUtil");

function renameFileOrDir(ctx) {
    const request = ctx.request;
    const response = ctx.response;
    const queryObj = request.body;
    const { path, name, type } = queryObj;

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
    } else if (type === undefined) {
        const data = {
            code: FailCode,
            message: "缺少 type 数据",
        };
        response.body = data;
    } else {
        console.log("rename0", `${path}/${name}`);
        let newPath = null;
        if (type === "file") {
            const paths = path.split("/");
            newPath = `${paths.slice(0, paths.length - 1).join("/")}/${name}`;
        } else {
            const paths = path.split("/");
            newPath = `${paths.slice(0, paths.length - 1).join("/")}/${name}`;
        }

        return FS.rename(`${path}`, newPath)
            .then(() => {
                console.log("rename1", `${path}/${name}`);
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
    renameFileOrDir,
};
