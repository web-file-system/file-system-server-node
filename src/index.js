const Koa = require("koa");
const mount = require("koa-mount");
const URL = require("url");
const responseTemplate = require("./util/responseTemplate");
const bodyParser = require("koa-bodyparser");

const app = new Koa();

const cors = require("@koa/cors");
const readDir = require("./util/readUtil").default;
const deleteUtil = require("./util/deleteUtil").default;

app.use(bodyParser());

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
        console.log("queryObj:", queryObj);

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
                let error;
                if (type === "file") {
                    //file
                    error = await deleteUtil.deleteFile(path);
                } else {
                    //dir
                    error = await deleteUtil.deleteDir(path);
                }

                if (error !== true) {
                    responseTemplate.fail.data = error;
                    response.body = responseTemplate.fail;
                } else {
                    responseTemplate.success.data = null;
                    response.body = responseTemplate.success;
                }
            }
        }
    })
);

app.listen(80);

console.log("__dirname:", __dirname);
