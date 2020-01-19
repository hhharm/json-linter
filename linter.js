module.exports = {
    lint: lint
};


const WARNING_ERRORS = {
    TEXT_SIZES_SHOULD_BE_EQUAL: {
        "code": "WARNING.TEXT_SIZES_SHOULD_BE_EQUAL",
        "error": "Тексты в блоке warning должны быть одного размера",
    },
    INVALID_BUTTON_SIZE: "INVALID_BUTTON_SIZE",
    INVALID_BUTTON_POSITION: "INVALID_BUTTON_POSITION",
    INVALID_PLACEHOLDER_SIZE: "INVALID_PLACEHOLDER_SIZE"
};

function getLocation(node, errorCode) {
    return {
        "start": {"column": 1, "line": 1},
        "end": {"column": 2, "line": 22}
    };
}

function validatePlainNode(node, errors, extraInfo) {
    if (extraInfo && !!extraInfo.warning && node.block && node.block === "text" && node.mods && node.mods.size &&
        extraInfo.textSize !== node.mods.size) {
        if (extraInfo.textSize === undefined) {
            extraInfo.textSize = node.mods.size;
        } else {
            errors.push({
                ...WARNING_ERRORS.TEXT_SIZES_SHOULD_BE_EQUAL,
                location: getLocation(node, WARNING_ERRORS.TEXT_SIZES_SHOULD_BE_EQUAL.code)
            });
        }
    }
}

function validateNode(node, errors, extraInfo, queue) {
    //todo: what if undefined?
    const type = node.block;
    const content = node.content;
    switch (type) {
        case "warning": {
            let textSize;
            const warningInfo = {warning: true};
            content && content.forEach(subnode => {
                validatePlainNode(subnode, errors, warningInfo);
                if (subnode.content) {
                    subnode.content.forEach(contentNode => queue.push({node: contentNode, info: warningInfo}));
                }
            });
            break;
        }
        default:
            validatePlainNode(node, errors, extraInfo);
            if (node.content) {
                node.content.forEach(contentNode => queue.push({node: contentNode, info: extraInfo}));
            }
    }
}

function validateJson(object) {
    const errors = [];
    const nodeQueue = [{node: object, info: undefined}];
    while (nodeQueue.length) {
        const element = nodeQueue.shift();
        validateNode(element.node, errors, element.info, nodeQueue);
    }
    return errors;
}

function lint(string) {
    let json;
    try {
        json = JSON.parse(string);
    } catch (e) {
        return [];
    }
    return validateJson(json);
}


const jsonFromDescription = `{
    "block": "warning",
    "content": [
        {
            "block": "placeholder",
            "mods": { "size": "m" }
        },
        {
            "elem": "content",
            "content": [
                {
                    "block": "text",
                    "mods": { "size": "m" }
                },
                {
                    "block": "text",
                    "mods": { "size": "l" }
                }
            ]
        }
    ]
}`;

// lint(jsonFromDescription);