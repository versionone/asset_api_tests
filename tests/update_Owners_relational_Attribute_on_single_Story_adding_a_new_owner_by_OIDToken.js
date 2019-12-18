"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asset_api_helper_1 = require("../lib/asset-api-helper");
const types = ['yaml', 'json'];
for (const type of types) {
    asset_api_helper_1.test(`Update Owners relational Attribute on single Story, adding a new owner by OIDToken (${type})`, async (t) => {
        const setupCommand = `
AssetType: Scope
Name: Test - Update Owners relational Attribute Scope
Parent: Scope:0
BeginDate: ${new Date().toJSON()}
Workitems:
- AssetType: Story
  Name: I need an Owner!
`;
        let res = await asset_api_helper_1.assetApiPost(setupCommand);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsCreated.count, 2, "Expected 2 Assets to be created");
        const [scopeOidToken, firstStoryOidToken] = res.data.assetsCreated.oidTokens;
        const commands = {
            yaml: `
from: ${firstStoryOidToken}
update:
 Owners: Member:20
`,
            json: `
{
    "from": "${firstStoryOidToken}",
    "update": {
        "Owners": "Member:20"
    }
}
`
        };
        const payload = commands[type];
        res = await asset_api_helper_1.assetApiPost(payload, type);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsModified.count, 1, "Expected 1 Assets to be modified");
        const query = `
from: ${firstStoryOidToken}
select:
- Owners
`;
        const verifyExpectation = [[
                {
                    "_oid": firstStoryOidToken,
                    "Owners": [{
                            "_oid": "Member:20"
                        }]
                }
            ]];
        const verfication = await asset_api_helper_1.assetApiPost(query);
        t.deepEqual(verfication.data.queryResult.results, verifyExpectation);
    });
}
//# sourceMappingURL=update_Owners_relational_Attribute_on_single_Story_adding_a_new_owner_by_OIDToken.js.map