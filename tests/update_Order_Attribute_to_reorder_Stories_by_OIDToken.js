"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asset_api_helper_1 = require("../lib/asset-api-helper");
const types = ['yaml', 'json'];
const scopeName = 'Reorder Stories';
for (const type of types) {
    asset_api_helper_1.test(`Update Order Attribute on Story, removing one of two owners by OIDToken (${type})`, async (t) => {
        const setupCommand = `
from: Story
where:
    Scope.Name: ${scopeName}
execute: Delete
---
from: Scope
where:
    Name: ${scopeName}
execute: Delete
---
AssetType: Scope
Name: ${scopeName}
Parent: Scope:0
BeginDate: ${new Date().toJSON()}
---
AssetType: Story
Name: Story A
Scope: ${scopeName}
---
AssetType: Story
Name: Story B
Scope: ${scopeName}
---
AssetType: Story
Name: Story C
Scope: ${scopeName}
---
AssetType: Story
Name: Story D
Scope: ${scopeName}
            `;
        let res;
        try {
            res = await asset_api_helper_1.assetApiPost(setupCommand);
        }
        catch (e) {
            console.log(e.config.data);
            t.fail(e.response.data);
        }
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsCreated.count, 5, "Expected 5 Assets to be created");
        const [scopeOidToken, storyAOidToken, storyBOidToken, storyCOidToken, storyDOidToken] = res.data.assetsCreated.oidTokens;
        // move B before A
        const commands = {
            yaml: `
from: ${storyBOidToken}
update:
 Order:
  Before: ${storyAOidToken}
`,
            json: `
{
    "from": "${storyBOidToken}",
    "update": {
        "Order": {
            "Before": "${storyAOidToken}"
        }
    }
}
`
        };
        const payload = commands[type];
        try {
            res = await asset_api_helper_1.assetApiPost(payload, type);
        }
        catch (e) {
            t.fail(`problem with request ${e.config.data}`);
        }
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsModified.count, 1, "Expected 1 Assets to be modified");
        // move C after D
        const commands2 = {
            yaml: `
from: ${storyCOidToken}
update:
    Order:
        After: ${storyDOidToken}
`,
            json: `
{
    "from": "${storyCOidToken}",
    "update": {
        "Order": {
            "After": "${storyDOidToken}"
        }
    }
}
`
        };
        const payload2 = commands2[type];
        try {
            res = await asset_api_helper_1.assetApiPost(payload2, type);
        }
        catch (e) {
            t.fail(`problem with request ${e.config.data}`);
        }
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsModified.count, 1, "Expected 1 Assets to be modified");
        const query = `
from: Story
where:
 Scope: ${scopeOidToken}
sort:
- +Order
`;
        const verifyExpectation = [[
                {
                    "_oid": storyBOidToken
                },
                {
                    "_oid": storyAOidToken
                },
                {
                    "_oid": storyDOidToken
                },
                {
                    "_oid": storyCOidToken
                }
            ]];
        try {
            const verfication = await asset_api_helper_1.assetApiPost(query);
            t.deepEqual(verfication.data.queryResult.results, verifyExpectation);
        }
        catch (e) {
            t.fail(e);
        }
    });
}
//# sourceMappingURL=update_Order_Attribute_to_reorder_Stories_by_OIDToken.js.map