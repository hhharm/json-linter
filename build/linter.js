// const warning = require("./json/warning-test");
// const title = require("./json/title-test");
// const grid = require("./json/grid-test");

module.exports = {
    lint: lint
};

const WARNING_ERRORS = {
    TEXT_SIZES_SHOULD_BE_EQUAL: {
        code: "WARNING.TEXT_SIZES_SHOULD_BE_EQUAL",
        error: "Тексты в блоке warning должны быть одного размера",
    },
    INVALID_BUTTON_SIZE: {
        code: "INVALID_BUTTON_SIZE",
        error: "Кнопки в блоке warning должны быть на один размер больше размера текста"
    },
    INVALID_BUTTON_POSITION: {
        code: "INVALID_BUTTON_POSITION",
        error: "В блоке warning кнопка не может размещаться перед placeholder"
    },
    INVALID_PLACEHOLDER_SIZE: {
        code: "INVALID_PLACEHOLDER_SIZE",
        error: "Placeholder в блоке warning может быть только размера s, m и l"
    }
};
const TEXT_ERRORS = {
    SEVERAL_H1: {
        code: "SEVERAL_H1",
        error: "На странице может быть только один заголовок первого уровня"
    },
    INVALID_H2_POSITION: {
        code: "INVALID_H2_POSITION",
        error: "Заголовок второго уровня не может идти перед заголовком первого уровня"
    },
    INVALID_H3_POSITION: {
        code: "INVALID_H3_POSITION",
        error: "Заголовок третьего уровня не может идти перед заголовком второго уровня"
    },
};
const GRID_ERRORS = {
    TOO_MUCH_MARKETING_BLOCKS: {
        code: "TOO_MUCH_MARKETING_BLOCKS",
        error: "Маркетинговые блоки не могут занимать больше половины от всех колонок блока grid"
    }
};
const ALLOWED_PLACEHOLDER_SIZES = ["s", "m", "l"];
const SIZES = ["s", "m", "l", "xl", "xxl"];

const GRID_FRACTION_BLOCK_TYPE = {
    info: ["payment", "warning", "product", "history", "cover", "collect", "articles", "subscribtion", "event"],
    market: ["commercial", "offer"]
};

/** @docs get error start and end. Currently is mocked **/
function getLocation(node, errorCode) {
    return {
        "start": {"column": 1, "line": 1},
        "end": {"column": 2, "line": 22}
    };
}

/** @docs validated simple blocks such as text, button, placeholder. Put all found in "errors".
 * extraInfo is [key: string]->any map that helps to understand node context */
function validatePlainNode(node, errors, extraInfo) {
    if (node.block) {
        switch (node.block) {
            case "text": {
                if (!!extraInfo.warning && node.mods && extraInfo.textSize !== node.mods.size) {
                    errors.push({
                        ...WARNING_ERRORS.TEXT_SIZES_SHOULD_BE_EQUAL,
                        location: getLocation(node, WARNING_ERRORS.TEXT_SIZES_SHOULD_BE_EQUAL.code)
                    });
                }
                if (node.mods && node.mods.type === "h1") {
                    if (extraInfo.foundTitle) {
                        errors.push({
                            ...TEXT_ERRORS.SEVERAL_H1,
                            location: getLocation(node, TEXT_ERRORS.SEVERAL_H1.code)
                        });
                    } else {
                        extraInfo.foundTitle = true;
                    }
                }

                //TODO: TITLE H2 AND H3
                break;
            }
            case "button": {
                if (!!extraInfo.warning && node.mods && node.mods.size && extraInfo.buttonSize !== node.mods.size) {
                    errors.push({
                        ...WARNING_ERRORS.INVALID_BUTTON_SIZE,
                        location: getLocation(node, WARNING_ERRORS.INVALID_BUTTON_SIZE.code)
                    });
                }
                //TODO: WARNING.BUTTON POSITION
                //10*p + 100*s
                break;
            }
            case "placeholder": {
                if (!!extraInfo.warning && node.mods && !ALLOWED_PLACEHOLDER_SIZES.includes(node.mods.size)) {
                    errors.push({
                        ...WARNING_ERRORS.INVALID_PLACEHOLDER_SIZE,
                        location: getLocation(node, WARNING_ERRORS.INVALID_PLACEHOLDER_SIZE.code)
                    });
                }
            }
        }
    }
}

/** @docs looks for the first "text" occurrence in the warning. Returns [textSize, buttonSize] or [undefined, undefined] */
function getTextAndButtonSize(item) {
    //todo: remove recursion
    let textSize, buttonSize;
    for (let contentKey in item.content) {
        if (item.content[contentKey].block === "text") {
            const textSize = item.content[contentKey].mods.size;
            const sizeIndex = SIZES.indexOf(textSize) + 1;
            //todo: what if xxl?
            if (sizeIndex === SIZES.length) {
                return [textSize, textSize];
            }
            return [textSize, SIZES[sizeIndex]];
        }
        if (item.content[contentKey].content) {
            [textSize, buttonSize] = getTextAndButtonSize(item.content[contentKey]);
        }
    }
    return [textSize, buttonSize];
}

/** @docs validate complex node types */
function validateNode(node, errors, extraInfo, queue) {
    const type = node.block;
    const content = node.content;
    switch (type) {
        case "warning": {
            //todo: move logic getTextAndButtonSize to getPositions loop
            const [textSize, buttonSize] = getTextAndButtonSize(node);
            const warningInfo = {...extraInfo, warning: true, textSize: textSize, buttonSize: buttonSize};
            const warningContentPositions = extraInfo.positions[node.position];
            if (warningContentPositions.placeholders.length) {
                const placeholderPosition = warningContentPositions.placeholders[0];
                const placeholderDepth = placeholderPosition.length;
                warningContentPositions.buttons.forEach(buttonPosition => {
                    let faulty;
                    faulty = buttonPosition.some((value, index) =>
                        placeholderDepth >= index && value < placeholderPosition[index]);

                    faulty && errors.push({
                        ...WARNING_ERRORS.INVALID_BUTTON_POSITION,
                        location: getLocation(buttonPosition, WARNING_ERRORS.INVALID_BUTTON_POSITION.code)
                    });
                })
            }
            content && content.forEach(subnode => {
                validatePlainNode(subnode, errors, warningInfo);
                if (subnode.content) {
                    subnode.content.forEach(contentNode => queue.push({node: contentNode, info: warningInfo}));
                }
            });
            break;
        }
        case "grid": {
            if (node.elem === undefined) {
                let gridColumns = node.mods["m-columns"];
                let marketingSum = 0;
                for (let index in node.content) {
                    let element = node.content[index];
                    //todo: remove dirty hack with content[0]
                    if (GRID_FRACTION_BLOCK_TYPE.market.includes(element.content[0].block)) {
                        marketingSum += element.elemMods["m-col"];
                    }
                }
                if (gridColumns / 2 < marketingSum) {
                    errors.push({
                        ...GRID_ERRORS.TOO_MUCH_MARKETING_BLOCKS,
                        location: getLocation(node, GRID_ERRORS.TOO_MUCH_MARKETING_BLOCKS)
                    });
                }
            }
            if (node.content) {
                node.content.forEach(contentNode => queue.push({node: contentNode, info: extraInfo}));
            }
            break;
        }
        default:
            validatePlainNode(node, errors, extraInfo);
            if (node.content) {
                node.content.forEach(contentNode => queue.push({node: contentNode, info: extraInfo}));
            }
    }
}

/** @docs checks rule that h2 cannot be before h1 and h3 cannot be before h2. Put all found errors into errors */
function validateTitles(object, positions, errors) {
    //validation h2
    const h1position = positions.h1.length && positions.h1[0];
    if (h1position) {
        const h1positionDepth = h1position && h1position.length;
        //all elements of h1 should be less or equal to any h2 element
        positions.h2.forEach(titlePosition => {
            const faulty = titlePosition.some((value, index) => h1positionDepth >= index && value < h1position[index]
            );
            faulty && errors.push({
                ...TEXT_ERRORS.INVALID_H2_POSITION,
                location: getLocation(titlePosition, TEXT_ERRORS.INVALID_H2_POSITION.code)
            });
        })
    }
    if (positions.h2.length) {
        positions.h3.forEach(titlePosition => {
            let faulty;
            for (let h2index = 0; h2index < positions.h2.length; h2index++) {
                let tmpH2 = positions.h2[h2index];
                const h2positionDepth = tmpH2.length;
                faulty = titlePosition.some((value, index) => h2positionDepth >= index && value < tmpH2[index]);
                if (faulty) {
                    break;
                }
            }
            faulty && errors.push({
                ...TEXT_ERRORS.INVALID_H3_POSITION,
                location: getLocation(titlePosition, TEXT_ERRORS.INVALID_H3_POSITION.code)
            });
        })
    }
}

/** @docs loop through json object and adds position property to each node. position format is [0, 1, 2...]
 * returns positions of watched elements in format {
 *      "h1": [<h1 positions>], "h2": [<h2 positions>], "h3": [<h3 positions>],
 *      warnings: {<warning position>: {buttons: [<buttons positions>], placeholders: [<placeholders positions>]}}
 * }*/
function addPositionToNodes(object) {
    const queue = [{self: object, inWarning: false}];
    const elemPositions = {"h1": [], "h2": [], "h3": []};
    object.position = [0];
    let node, queueElem;
    while (queue.length) {
        queueElem = queue.shift();
        node = queueElem.self;
        if (node.content) {
            for (let elemIndex in node.content) {
                node.content[elemIndex].position = [...node.position, +elemIndex];
                queue.push({
                    self: node.content[elemIndex], inWarning: queueElem.inWarning ||
                        node.block === "warning" && node.position
                });
            }
        }
        switch (node.block) {
            case "text": {
                if (node.mods && node.mods.type) {
                    elemPositions[node.mods.type].push(node.position);
                }
                break;
            }
            case "warning": {
                elemPositions[node.position] = {buttons: [], placeholders: []};
                break;
            }
            case "button": {
                if (queueElem.inWarning) {
                    elemPositions[queueElem.inWarning].buttons.push(node.position);
                }
                break;
            }
            case "placeholder": {
                if (queueElem.inWarning) {
                    elemPositions[queueElem.inWarning].placeholders.push(node.position);
                }
                break;
            }
        }
    }
    console.log(JSON.stringify(elemPositions));
    return elemPositions;
}

/** @docs main validation function. Input: object: Object, contains parsed json object. Returns array with errors */
function validateJson(object) {
    const errors = [];
    const elemPositions = addPositionToNodes(object);
    const nodeQueue = [{node: object, info: {positions: elemPositions}}];
    validateTitles(object, elemPositions, errors);
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
        console.log("coudn't parse");
        return [];
    }
    return validateJson(json);
}

// lint(grid.twoMiddleMarket);