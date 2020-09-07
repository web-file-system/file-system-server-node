const Koa = require("koa");
const KoaBody = require("koa-body");
const mount = require("koa-mount");
const URL = require("url");
const cors = require("@koa/cors");
const { readDirAndFile } = require("./util/readUtil");
const { deleteDirOrFile } = require("./util/deleteUtil");
const { zip, unzip } = require("./util/zipUtil");
const { copyDirOrFile } = require("./util/copyUtil");
const { uploadFile, downloadFile } = require("./util/fileUtil");
const { newDir } = require("./util/dirUtil");
const { renameFileOrDir } = require("./util/renameUtil");

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
        const url = URL.parse(request.url);
        const pathname = url.pathname;

        const queryObj = request.body;
        // console.log("queryObj:", queryObj);

        if (pathname === "/list") {
            const { path } = queryObj;
            return readDirAndFile(path)
                .then((result) => {
                    response.body = result;
                })
                .catch((error) => {
                    response.body = error;
                });
        } else if (pathname === "/delete") {
            return deleteDirOrFile(queryObj)
                .then((result) => {
                    response.body = result;
                })
                .catch((error) => {
                    response.body = error;
                });
        } else if (pathname === "/zip") {
            // console.log("queryObj:", queryObj);

            const { path, type } = queryObj;
            return zip({ input: path, type })
                .then((result) => {
                    response.body = result;
                })
                .catch((error) => {
                    response.body = error;
                });
        } else if (pathname === "/unzip") {
            // console.log("queryObj:", queryObj);
            const { path } = queryObj;
            return unzip({
                input: path,
                output: `${path.slice(0, path.length - 4)}`,
            })
                .then((result) => {
                    response.body = result;
                })
                .catch((error) => {
                    response.body = error;
                });
        } else if (pathname === "/copy") {
            const { path, type } = queryObj;
            return copyDirOrFile({ path, type })
                .then((result) => {
                    response.body = result;
                })
                .catch((error) => {
                    response.body = error;
                });
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
