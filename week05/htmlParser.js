var cssParser = require('./cssParser');
const toyLayout = require('./layout');

const EOF = Symbol("EOF");
{/* <head>
    <title>Main</title>
    <style>
    </style>
</head> */}
let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;

let stack = [{ type: "document", children: [] }];



function emit(token) {

    let top = stack[stack.length - 1];

    if (token.type === 'starTag') {
        let element = {
            type: "element",
            children: [],
            attributes: []
        }

        element.tagName = token.tagName;
        Object.keys(token).filter(key => key != "type" && key != "tagName").forEach(
            (key) => {
                element.attributes.push({
                    name: key,
                    value: token[key]
                })
            }
        );

        // 我们假设css都在head 中
        cssParser.computeCSS(stack, element);

        top.children.push(element);
        // element.parent = top;

        if (!token.isSelfClosing) {
            stack.push(element)
        }
        currentTextNode = null;
    } else if (token.type === 'endTag') {
        if (top.tagName != token.tagName) {
            throw new Error('start tag and end tag not same');
        } else {
            // 添加CSS rule
            if (top.tagName === 'style') {
                cssParser.addCSSRules(top.children[0].content);
            }

            toyLayout(top);
            stack.pop();
        }
        currentTextNode = null;
    } else if (token.type === 'text') {
        if (currentTextNode == null) {
            currentTextNode = {
                type: "text",
                content: ""
            }
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;

    }
    // console.log(token);
}

function data(c) {
    if (c == '<') {
        return tagOpen;
    } else if (c == EOF) {
        emit({
            type: "EOF"
        });
        return;
    } else {
        emit({
            type: "text",
            content: c
        });
        // emit(currentToken);
        // 文本节点
        return data;
    }
}

// <title>Main  </title>
function tagOpen(c) {
    // </title>
    if (c == '/') {
        return endTagOpen;
    }
    else if (c.match(/^[a-zA-Z]$/)) {
        // 1. < div
        // 2. < div />
        currentToken = {
            type: "starTag",
            tagName: ""
        };
        return tagName(c);
    } else {
        return;
    }
}


// 1. <title>
// 2. </title>
function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "endTag",
            tagName: ""
        };
        return tagName(c);
    } else if (c == '>') {
        // invalid
    } else if (c == EOF) {
        //invalid
    } else {

    }
}

// </title class="">
// <title class="">
function tagName(c) {
    if (c.match(/^[\n\t\f ]$/)) {
        return beforeAttributeName;
    } else if (c == '/') {
        // <title/>
        return selfClosingStartTag;
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken.tagName += c;
        return tagName;
    } else if (c == '>') {
        // 下一个标签
        emit(currentToken);
        return data;
    }
}

// // <title class="ddd">
function beforeAttributeName(c) {
    if (c.match(/^[\n\t\f ]$/)) {
        return beforeAttributeName;
    } else if (c == '/' || c == '>' || c == EOF) {
        // 回到读取标签的步骤
        return afterAttributeName(c);
    } else if (c == '=') {
        // return beforeAttributeName
    } else {
        currentAttribute = {
            name: "",
            value: ""
        }
        // 找到attribute的启动字符
        return attributeName(c);
    }
}


function attributeName(c) {
    if (c.match(/^[\n\t\f ]$/) || c == '/' || c == '>' || c == EOF) {
        //<title c >
        //<title c/>
        //<title c>
        // 读取attribute结束
        return afterAttributeName(c);
    } else if (c == '=') {
        // 读取attribute value
        return beforeAttributeValue;
    } else {
        // 这里其实需要check非法字符
        currentAttribute.name += c;
        return attributeName;
    }
}

function beforeAttributeValue(c) {
    if (c.match(/^[\n\t\f ]$/) || c == '/' || c == '>' || c == EOF) {
        //<title c= >
        //<title c=/>
        //<title c=>
        return beforeAttributeValue
    } else if (c == '\"') {
        return doubleQuoteAttributeValue;
    } else if (c == '\'') {
        return singleQuoteAttributeValue;
    } else if (c == '>') {
        // 非法
    } else {
        return unquotedAttributeValue(c);
    }
}

function doubleQuoteAttributeValue(c) {
    //<title class="ddd">
    if (c == '\"') {
        // 一直等到单引号的结束
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (c == EOF || c == '\u0000') {

        // 这里需要check非法字符
    } else {
        currentAttribute.value += c;
        return doubleQuoteAttributeValue;
    }
}
function singleQuoteAttributeValue(c) {
    //<title class="ddd">
    if (c == '\'') {
        // 一直等到单引号的结束
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (c == EOF) {

    } else {
        currentAttribute.value += c;
        return singleQuoteAttributeValue;
    }
}

//<div test="dd"x=""></div>
function afterQuotedAttributeValue(c) {
    //<title class="ddd">
    if (c.match(/^[\n\t\f ]$/)) {
        return beforeAttributeName;
    } else if (c == "/") {
        return selfClosingStartTag;

    } else if (c == ">") {
        return beforeAttributeName(c);

    } else if (c == EOF) {

    } else {
        // error
    }
}
function unquotedAttributeValue(c) {
    //<title class="ddd">
    if (c.match(/^[\n\t\f ]$/)) {
        // 一直等到单引号的结束
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    } else if (c == ">") {
        return beforeAttributeName(c);

    } else if (c == EOF) {

    } else {
        currentAttribute.value += c;
        return unquotedAttributeValue;
    }
}
function afterAttributeName(c) {

    if (c.match(/^[\n\t\f ]$/) || c == '/' || c == '>' || c == EOF) {
        return tagName(c);
    }

}

//  <div/>
function selfClosingStartTag(c) {
    if (c == '>') {
        // 读取下一个标签
        currentToken.isSelfClosing = true;
        emit(currentToken);
        return data;
    } else {
        // error
    }
}



// 1. 处理开始标签，结束标签，自封闭标签
//  1.1 加入业务逻辑，找到标签token
//  1.2 处理属性
module.exports.parseHTML = function parseHTML(html) {
    // console.log("in parseHTML ", html);

    let state = data;
    for (const c of html) {
        state = state(c);
    }

    state = state(EOF);
    return stack[0]
    // console.log(stack[0]);
}