"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asset_api_helper_1 = require("../lib/asset-api-helper");
const commands = [
    {
        type: 'yaml',
        payload: `
AssetType: Story
Name: My Story
Scope: Scope:0
`
    },
    {
        type: 'json',
        payload: `
{
  "AssetType": "Story",
  "Name": "My Story",
  "Scope": "Scope:0"
}
`
    }
];
for (const command of commands) {
    asset_api_helper_1.test(`Create single Story with Scope referenced by OidToken (${command.type})`, async (t) => {
        const res = await asset_api_helper_1.assetApiPost(command.payload, command.type);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsCreated.count, 1, "Expected 1 Asset to be created");
        const [assetOidToken] = res.data.assetsCreated.oidTokens;
        const query = `
from: ${assetOidToken}
select:
- Name
- Scope.ID`;
        const verifyExpectation = [[{
                    "_oid": assetOidToken,
                    "Name": "My Story",
                    "Scope.ID": {
                        "_oid": "Scope:0"
                    }
                }]];
        const verfication = await asset_api_helper_1.assetApiPost(query);
        t.deepEqual(verfication.data.queryResult.results, verifyExpectation);
    });
}
//# sourceMappingURL=create_single_Story_with_Scope_referenced_by_OidToken.js.map