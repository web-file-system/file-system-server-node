const SuccessCode = 1;
const SuccessMessage = "请求成功";

const FailCode = 0;
const FailMessage = "请求失败";

const CanNotAccess = "不可访问";

function GetResponse({ success, message, data }) {
    if (success === true) {
        return {
            code: SuccessCode,
            message: message === undefined ? SuccessMessage : message,
            data: data === undefined ? "暂无data" : data,
        };
    } else {
        return {
            code: FailCode,
            message: message === undefined ? FailMessage : message,
            data: data === undefined ? "暂无data" : data,
        };
    }
}
module.exports = {
    SuccessCode,
    SuccessMessage,
    FailCode,
    FailMessage,
    CanNotAccess,
    GetResponse,
};
