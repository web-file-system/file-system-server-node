const Koa = require("koa");
const KoaBody = require("koa-body");
const mount = require("koa-mount");
const URL = require("url");
const responseTemplate = require("./util/responseTemplate");
const cors = require("@koa/cors");
const readDir = require("./util/readUtil");
const deleteUtil = require("./util/deleteUtil");
const { zip, unzip } = require("./util/gzipUtil");
const { copyFile, copyDir } = require("./util/copyUtil");
const KoaSend = require("koa-send");
const Querystring = require("querystring");
const FS = require("fs");
const { uploadFile } = require("./util/uploadUtil");
const _ = require("lodash");

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
    mount("/api", async (ctx) => {
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
                responseTemplate.fail.message = "缺少 path 参数";
                response.body = responseTemplate.fail;
            } else {
                const files = await readDir.readDirAndFile(path);
                // console.log("files2", files);
                responseTemplate.success.data = files;
                response.body = responseTemplate.success;
            }
        } else if (pathname === "/root") {
            const { path } = queryObj;
            if (path === undefined) {
                responseTemplate.fail.message = "缺少 path 参数";
                response.body = responseTemplate.fail;
            } else {
                const files = await readDir.readDir(path);
                responseTemplate.success.data = files;
                response.body = responseTemplate.success;
            }
        } else if (pathname === "/delete") {
            const { path, type } = queryObj;
            if (path === undefined) {
                responseTemplate.fail.message = "缺少 path 参数";
                response.body = responseTemplate.fail;
            } else {
                if (type === "file") {
                    //file
                    return deleteUtil
                        .deleteFile(path)
                        .then((result) => {
                            response.body = result;
                        })
                        .catch((error) => {
                            response.body = error;
                        });
                } else {
                    //dir
                    return deleteUtil
                        .deleteDir(path)
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
                responseTemplate.fail.message = "缺少 path 参数";
                response.body = responseTemplate.fail;
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
                responseTemplate.fail.message = "缺少 path 参数";
                response.body = responseTemplate.fail;
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
                responseTemplate.fail.message = "缺少 path 参数";
                response.body = responseTemplate.fail;
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
            // 从路径中解析参数
            const { path, name } = Querystring.decode(url.query);

            if (path === undefined) {
                responseTemplate.fail.message = "缺少 path 参数";
                response.body = responseTemplate.fail;
            } else {
                ctx.attachment(name);

                const paths = path.split("/");
                const root = paths.slice(0, paths.length - 1).join("/");

                await KoaSend(ctx, name, { root: root });
            }
        } else if (pathname === "/upload") {
            uploadFile(ctx);
        }
    })
);

app.listen(80);

console.log("__dirname:", __dirname);
