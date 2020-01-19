module.exports = {
    oneBigMarket: `{
   "block": "grid",
   "mods": {
       "m-columns": "10"
   },
   "content": [
       {
           "block": "grid",
           "elem": "fraction",
           "elemMods": {
               "m-col": "2"
           },
           "content": [
               {
                   "block": "payment"
               }
           ]
       },
       {
           "block": "grid",
           "elem": "fraction",
           "elemMods": {
               "m-col": "8"
           },
           "content": [
               {
                   "block": "offer"
               }
           ]
       }
   ]}`,
    twoMiddleMarket: `{
   "block": "grid",
   "mods": {
       "m-columns": "10"
   },
   "content": [
       {
           "block": "grid",
           "elem": "fraction",
           "elemMods": {
               "m-col": "4"
           },
           "content": [
               {
                   "block": "payment"
               }
           ]
       },
       {
           "block": "grid",
           "elem": "fraction",
           "elemMods": {
               "m-col": "4"
           },
           "content": [
               {
                   "block": "offer"
               }
           ]
       },
       {
           "block": "grid",
           "elem": "fraction",
           "elemMods": {
               "m-col": "2"
           },
           "content": [
               {
                   "block": "commercial"
               }
           ]
       }
   ]}`,
    oneBigMarketWithInnerError: `{
   "block": "grid",
   "mods": {
       "m-columns": "10"
   },
   "content": [
       {
           "block": "grid",
           "elem": "fraction",
           "elemMods": {
               "m-col": "2"
           },
           "content": [
               {
                   "block": "payment",
                   "content": [
                        { "block": "button", "mods": { "size": "xl" } },
                        { "block": "button", "mods": { "size": "s" } }
                    ]
               }
           ]
       },
       {
           "block": "grid",
           "elem": "fraction",
           "elemMods": {
               "m-col": "8"
           },
           "content": [
               {
                   "block": "offer",
                   "content": [
                        { "block": "button", "mods": { "size": "xl" } },
                        { "block": "text", "mods": { "size": "l","type": "h1" } },
                        { "block": "text", "mods": { "size": "l","type": "h1" } },
                        { "block": "text", "mods": { "size": "m","type": "h2" } },
                        { "block": "button", "mods": { "size": "s" } }
                    ]
               }
           ]
       }
   ]}`,
};