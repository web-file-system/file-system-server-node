const Koa = require("koa");
const KoaBody = require("koa-body");
const mount = require("koa-mount");
const URL = require("url");
const cors = require("@koa/cors");
const _ = require("lodash");
const responseTemplate = require("./util/responseTemplate");
const { readDirAndFile } = require("./util/readUtil");
const { deleteDir, deleteFile } = require("./util/deleteUtil");
const { zip, unzip } = require("./util/gzipUtil");
const { copyFile, copyDir } = require("./util/copyUtil");
const { uploadFile, downloadFile } = require("./util/fileUtil");
const { newDir } = require("./util/dirUtil");
const { renameFileOrDir } = require("./util/renameUtil");
const { GetResponse } = require("./util/ResponseUtil");

const app = new Koa();

app.use(
    KoaBody({
        multipart: true,
        formidable: {
            maxFileSize: 200 * 1024 * 1024,
        },
    })
);

app.use(cors());

app.use(
    mount("/favicon.ico", (ctx) => {
        ctx.status = 200;
    })
);
app.use(
    mount("/api", async (ctx, next) => {
        const request = ctx.request;
        const response = ctx.response;
        // console.log("request:", request);
        // console.log("request-body:", request.body);

        const url = URL.parse(request.url);
        const pathname = url.pathname;

        const queryObj = request.body;
        // console.log("queryObj:", queryObj);

        if (pathname === "/list") {
            const { path } = queryObj;
            if (path === undefined) {
                response.body = GetResponse({
                    success: false,
                    message: "缺少 path 参数",
                });
            } else {
                const files = await readDirAndFile(path);
                response.body = GetResponse({ success: true, data: files });
            }
        } else if (pathname === "/delete") {
            const { path, type } = queryObj;
            if (path === undefined) {
                response.body = GetResponse({
                    success: false,
                    message: "缺少 path 参数",
                });
            } else {
                if (type === "file") {
                    //file
                    return deleteFile(path)
                        .then((result) => {
                            response.body = result;
                        })
                        .catch((error) => {
                            response.body = error;
                        });
                } else {
                    //dir
                    return deleteDir(path)
                        .then((result) => {
                            response.body = result;
                        })
                        .catch((error) => {
                            response.body = error;
                        });
                }
            }
        } else if (pathname === "/zip") {
            // console.log("queryObj:", queryObj);

            const { path } = queryObj;
            if (path === undefined) {
                response.body = GetResponse({
                    success: false,
                    message: "缺少 path 参数",
                });
            } else {
                return zip(path)
                    .then((result) => {
                        response.body = result;
                    })
                    .catch((error) => {
                        response.body = error;
                    });
            }
        } else if (pathname === "/unzip") {
            // console.log("queryObj:", queryObj);

            const { path } = queryObj;
            if (path === undefined || _.endsWith(path, ".zip") === false) {
                response.body = GetResponse({
                    success: false,
                    message: "缺少 path 参数",
                });
            } else {
                return unzip(path, `${path.slice(0, path.length - 4)}`)
                    .then((result) => {
                        response.body = result;
                    })
                    .catch((error) => {
                        response.body = error;
                    });
            }
        } else if (pathname === "/copy") {
            const { path, type } = queryObj;
            if (path === undefined) {
                response.body = GetResponse({
                    success: false,
                    message: "缺少 path 参数",
                });
            } else {
                if (type === "file") {
                    //file
                    return copyFile(path)
                        .then((result) => {
                            response.body = result;
                        })
                        .catch((error) => {
                            response.body = error;
                        });
                } else {
                    //dir
                    return copyDir(path)
                        .then((result) => {
                            response.body = result;
                        })
                        .catch((error) => {
                            response.body = error;
                        });
                }
            }
        } else if (pathname === "/download") {
            return downloadFile(ctx);
        } else if (pathname === "/upload") {
            uploadFile(ctx);
        } else if (pathname === "/newDir") {
            return newDir(ctx);
        } else if (pathname === "/rename") {
            return renameFileOrDir(ctx);
        }
    })
);

app.listen(80);
