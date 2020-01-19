const assert = require("chai").assert;
const expect = require("chai").expect;
const lint = require("./linter").lint;
const warning = require("./json/warning-test");
const title = require("./json/title-test");
const grid = require("./json/grid-test");

const json = `{
    "block": "warning",
    "content": [
        { "block": "button", "mods": { "size": "m" } },
        { "block": "placeholder", "mods": { "size": "m" } },
        { "block": "placeholder", "mods": { "size": "xl" } },
        { "elem": "content",
            "content": [
                { "block": "button", "mods": { "size": "xl" } },
                { "block": "text", "mods": { "size": "m","type": "h2" } },
                { "block": "text", "mods": { "size": "l","type": "h1" } },
                { "block": "text", "mods": { "size": "l","type": "h1" } },
                { "block": "button", "mods": { "size": "s" } }
            ]
        },
        { "block": "grid", "mods": { "m-columns": "10" },
            "content": [
                { "block": "grid", "elem": "fraction", "elemMods": { "m-col": "8" },
                    "content": [{ "block": "payment" }]
                },
                { "block": "grid", "elem": "fraction", "elemMods": { "m-col": "2" },
                    "content": [{ "block": "offer" }]
                }
            ]
        },
        { "block": "grid", "mods": { "m-columns": "10" },
            "content": [
                { "block": "grid", "elem": "fraction", "elemMods": { "m-col": "2" },
                    "content": [{ "block": "payment" }]
                },
                { "block": "grid", "elem": "fraction", "elemMods": { "m-col": "8" },
                    "content": [{ "block": "offer" }]
                }
            ]
        }
    ]
}`;

describe("test case 1, warning", function () {
    it("invalid json", function () {
        assert.equal(lint("asdas").toString(), "");
    });

    it("text blocks of different size", () => {
        expect(lint(warning.wrongTextSizeJson)).to.deep.equal([
            {
                "code": "WARNING.TEXT_SIZES_SHOULD_BE_EQUAL",
                "error": "Тексты в блоке warning должны быть одного размера",
                "location": {
                    "start": {"column": 1, "line": 1},
                    "end": {"column": 2, "line": 22}
                }
            }
        ]);
    });

    it("button size is wrong", () => {
        expect(lint(warning.buttonsWrongSizeJson)).to.deep.equal([
            {
                code: "INVALID_BUTTON_SIZE",
                error: "Кнопки в блоке warning должны быть на один размер больше размера текста",
                location: {
                    "start": {"column": 1, "line": 1},
                    "end": {"column": 2, "line": 22}
                }
            },
            {
                code: "INVALID_BUTTON_SIZE",
                error: "Кнопки в блоке warning должны быть на один размер больше размера текста",
                location: {
                    "start": {"column": 1, "line": 1},
                    "end": {"column": 2, "line": 22}
                }
            }
        ]);
    });

    it("button before placeholder, simple case", () => {
        expect(lint(warning.wrongButtonPosition1)).to.deep.equal([
            {
                code: "INVALID_BUTTON_POSITION",
                error: "В блоке warning кнопка не может размещаться перед placeholder",
                location: {
                    "start": {"column": 1, "line": 1},
                    "end": {"column": 2, "line": 22}
                }
            }
        ]);
    });

    it("button before placeholder, placeholder is sinked", () => {
        expect(lint(warning.wrongButtonPosition2)).to.deep.equal([
            {
                code: "INVALID_BUTTON_POSITION",
                error: "В блоке warning кнопка не может размещаться перед placeholder",
                location: {
                    "start": {"column": 1, "line": 1},
                    "end": {"column": 2, "line": 22}
                }
            }
        ]);
    });
    it("button before placeholder, placeholder is on higher level but below", () => {
        expect(lint(warning.wrongButtonPosition3)).to.deep.equal([
            {
                code: "INVALID_BUTTON_POSITION",
                error: "В блоке warning кнопка не может размещаться перед placeholder",
                location: {
                    "start": {"column": 1, "line": 1},
                    "end": {"column": 2, "line": 22}
                }
            }
        ]);
    });
    it("placeholder size is wrong", () => {
        expect(lint(warning.placeholderSizeJson)).to.deep.equal([
            {
                code: "INVALID_PLACEHOLDER_SIZE",
                error: "Placeholder в блоке warning может быть только размера s, m и l",
                location: {
                    "start": {"column": 1, "line": 1},
                    "end": {"column": 2, "line": 22}
                }
            }
        ]);
    });
});

describe("test case 2, titles", function () {
    it("several h1", () => {
        expect(lint(title.severalH1)).to.deep.equal([
            {
                code: "SEVERAL_H1",
                error: "На странице может быть только один заголовок первого уровня",
                "location": {
                    "start": {"column": 1, "line": 1},
                    "end": {"column": 2, "line": 22}
                }
            }
        ]);
    });
    it("h2 before h1", () => {
        expect(lint(title.wrongH2Position)).to.deep.equal([
            {
                code:  "INVALID_H2_POSITION",
                error: "Заголовок второго уровня не может идти перед заголовком первого уровня",
                "location": {
                    "start": {"column": 1, "line": 1},
                    "end": {"column": 2, "line": 22}
                }
            }
        ]);
    });
    it("h3 before h2", () => {
        expect(lint(title.wrongH3Position)).to.deep.equal([
            {
                code: "INVALID_H3_POSITION",
                error: "Заголовок третьего уровня не может идти перед заголовком второго уровня",
                "location": {
                    "start": {"column": 1, "line": 1},
                    "end": {"column": 2, "line": 22}
                }
            }
        ]);
    });
});
describe("test case 3, grid", function () {
    it("one big marketing", () => {
        expect(lint(grid.oneBigMarket)).to.deep.equal([
            {
                code: "TOO_MUCH_MARKETING_BLOCKS",
                error: "Маркетинговые блоки не могут занимать больше половины от всех колонок блока grid",
                "location": {
                    "start": {"column": 1, "line": 1},
                    "end": {"column": 2, "line": 22}
                }
            }
        ]);
    });
    it("two marketing that are less than half but their sum is bigger", () => {
        expect(lint(grid.twoMiddleMarket)).to.deep.equal([
            {
                code: "TOO_MUCH_MARKETING_BLOCKS",
                error: "Маркетинговые блоки не могут занимать больше половины от всех колонок блока grid",
                "location": {
                    "start": {"column": 1, "line": 1},
                    "end": {"column": 2, "line": 22}
                }
            }
        ]);
    });
    it("one marketing and internal error", () => {
        expect(lint(grid.oneBigMarketWithInnerError)).to.deep.equal([
            {
                code: "TOO_MUCH_MARKETING_BLOCKS",
                error: "Маркетинговые блоки не могут занимать больше половины от всех колонок блока grid",
                "location": {
                    "start": {"column": 1, "line": 1},
                    "end": {"column": 2, "line": 22}
                }
            },
            {
                code: "SEVERAL_H1",
                error: "На странице может быть только один заголовок первого уровня",
                "location": {
                    "start": {"column": 1, "line": 1},
                    "end": {"column": 2, "line": 22}
                }
            },
        ]);
    });
});







