module.exports = {
    wrongTextSizeJson: `{
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
}`,
    buttonsWrongSizeJson: `{
    "block": "warning",
    "content": [
        { "block": "placeholder", "mods": { "size": "m" } },
        { "block": "placeholder", "mods": { "size": "l" } },
        { "block": "button", "mods": { "size": "m" } },
        { "elem": "content",
            "content": [
                { "block": "button", "mods": { "size": "xl" } },
                { "block": "text", "mods": { "size": "l"} },
                { "block": "button", "mods": { "size": "s" } }
            ]
        }
    ]
}`,
    placeholderSizeJson: `{
    "block": "warning",
    "content": [
        { "block": "placeholder", "mods": { "size": "m" } },
        { "elem": "content",
            "content": [
                { "block": "text", "mods": { "size": "l"} },
                { "block": "placeholder", "mods": { "size": "xl" } },
                { "block": "button", "mods": { "size": "xl" } }
            ]
        }
    ]
}`, wrongButtonPosition1: `{
    "block": "warning",
    "content": [
        { "block": "button", "mods": { "size": "m" } },
        { "block": "placeholder", "mods": { "size": "m" } },
        { "elem": "content",
            "content": [
                { "block": "button", "mods": { "size": "m" } },
                { "block": "text", "mods": { "size": "s","type": "h2" } }
            ]
        }]}`, wrongButtonPosition2: `{
    "block": "warning",
    "content": [
        { "block": "button", "mods": { "size": "xl" } },
        { "elem": "content",
            "content": [
                { "block": "placeholder", "mods": { "size": "m" } },
                { "block": "button", "mods": { "size": "xl" } },
                { "block": "text", "mods": { "size": "l","type": "h1" } },
                { "block": "button", "mods": { "size": "xl" } }
            ]
        }]}`,
    wrongButtonPosition3: `{
  "block": "warning",
  "content": [
    {
      "elem": "content",
      "content": [
        {
          "block": "button",
          "mods": {
            "size": "xl"
          }
        }
      ]
    },
    {
      "block": "placeholder",
      "mods": {
        "size": "m"
      }
    },
    {
      "block": "text",
      "mods": {
        "size": "l",
        "type": "h1"
      }
    }
  ]
}`,
};