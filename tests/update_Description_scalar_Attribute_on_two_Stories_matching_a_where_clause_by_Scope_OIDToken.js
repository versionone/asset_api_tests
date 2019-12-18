"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asset_api_helper_1 = require("../lib/asset-api-helper");
const types = ['yaml', 'json'];
for (const type of types) {
    asset_api_helper_1.test(`Update Description scalar Attribute on two Stories matching a where clause by Scope OIDToken (${type})`, async (t) => {
        const setupCommand = `
AssetType: Scope
Name: Test - Update Description scalar Scope
Parent: Scope:0
BeginDate: ${new Date().toJSON()}
Workitems:
- AssetType: Story
  Name: First Story
  Description: First Story Description
- AssetType: Story
  Name: Second Story
  Description: Second Story Description
`;
        let res = await asset_api_helper_1.assetApiPost(setupCommand);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsCreated.count, 3, "Expected 3 Assets to be created");
        const [scopeOidToken, firstStoryOidToken, secondStoryOidToken] = res.data.assetsCreated.oidTokens;
        const commands = {
            yaml: `
from: Story
where:
 Scope: ${scopeOidToken}
update:
 Description: Now I have just the same boring description
`,
            json: `
{
    "from": "Story",
    "where": {
        "Scope": "${scopeOidToken}"
    },
    "update": {
        "Description": "Now I have just the same boring description"
    }
}
`
        };
        const payload = commands[type];
        res = await asset_api_helper_1.assetApiPost(payload, type);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsModified.count, 2, "Expected 2 Assets to be modified");
        const query = `
from: Story
where:
 Scope: ${scopeOidToken}
select:
- Name
- Description
`;
        const verifyExpectation = [[
                {
                    "_oid": firstStoryOidToken,
                    "Name": "First Story",
                    "Description": "Now I have just the same boring description"
                },
                {
                    "_oid": secondStoryOidToken,
                    "Name": "Second Story",
                    "Description": "Now I have just the same boring description"
                }
            ]];
        const verfication = await asset_api_helper_1.assetApiPost(query);
        t.deepEqual(verfication.data.queryResult.results, verifyExpectation);
    });
}
//# sourceMappingURL=update_Description_scalar_Attribute_on_two_Stories_matching_a_where_clause_by_Scope_OIDToken.js.map