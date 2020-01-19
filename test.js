const assert = require("chai").assert;
const expect = require("chai").expect;
const lint = require("./linter").lint;

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

describe("test case 1, simple cases", function () {
    it("invalid json", function () {
        assert.equal(lint("asdas").toString(), "");
    });

    it("json from task description", () => {
        expect(lint(jsonFromDescription)).to.deep.equal([
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
});






