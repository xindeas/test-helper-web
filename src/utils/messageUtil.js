import {Message} from "element-ui";

class messageUtil extends Message {
    constructor() {
        super();
    }
}

/**
 * 保证同一条消息只弹一次
 */
['success', 'warning', 'info', 'error'].forEach(type => {
    messageUtil[type] = options => {
        if (typeof options === 'string') {
            options = {
                message: options
            };
        }
        let arr = document.getElementsByClassName('el-message')
        for (const item of arr) {
            const contents = item.getElementsByClassName('el-message__content')
            console.log(contents, contents[0].innerHTML, options.message)
            if (contents && contents.length > 0 && contents[0].innerHTML === options.message) {
                item['__vue__'].$parent.close();
            }
        }
        options.type = type;
        return Message(options);
    };
});

export default messageUtil
