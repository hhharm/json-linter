module.exports = {
    severalH1: `{
        "content": [
                { "block": "button", "mods": { "size": "xl" } },
                { "block": "text", "mods": { "size": "l","type": "h1" } },
                { "block": "text", "mods": { "size": "l","type": "h1" } },
                { "block": "text", "mods": { "size": "m","type": "h2" } },
                { "block": "button", "mods": { "size": "s" } }
            ]
    }`,
    wrongH2Position: `{
  "content": [
    {
      "block": "someblock",
      "content": [
        {
          "block": "text",
          "mods": {
            "type": "h2"
          }
        }
      ]
    },
    {
      "block": "text",
      "mods": {
        "type": "h1"
      }
    }
  ]
}`,
    wrongH3Position: `{"content": [
  {
    "block": "text",
    "mods": {
      "type": "h3"
    }
  },
  {
    "block": "text",
    "mods": {
      "type": "h2"
    }
  }
]}`
};