"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asset_api_helper_1 = require("../lib/asset-api-helper");
const types = ['yaml', 'json'];
for (const type of types) {
    asset_api_helper_1.test(`Update Epic, changing its Subs relation by adding Story references via subquery (${type})`, async (t) => {
        const setupCommand = `
from: Scope:0
update:
 Workitems:
 - AssetType: Epic
   Name: Epic with Subs to be removed
   Subs:
   - AssetType: Story
     Name: Story 1 to be removed from its Epic
   - AssetType: Story
     Name: Story 2 to be removed from its Epic
   - AssetType: Story
     Name: Story 3 to be removed from its Epic
`;
        let res = await asset_api_helper_1.assetApiPost(setupCommand);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsCreated.count, 4, "Expected 4 Assets to be created");
        const [epicOidToken, story1OidToken, story2OidToken, story3OidToken] = res.data.assetsCreated.oidTokens;
        const commands = {
            yaml: `
from: ${epicOidToken}
update:
 Subs:
  remove:
   from: Story
   filter:
   - Super='${epicOidToken}'
`,
            json: `
{
  "from": "${epicOidToken}",
  "update": {
    "Subs": {
      "remove": {
        "from": "Story",
        "filter": [
          "Super='${epicOidToken}'"
        ]
      }
    }
  }
}`
        };
        const payload = commands[type];
        res = await asset_api_helper_1.assetApiPost(payload, type);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsModified.count, 1, "Expected 1 Assets to be modified");
        const query = `
from: ${epicOidToken}
select:
- Name
- Subs
`;
        const verifyExpectation = [[
                {
                    "Name": "Epic with Subs to be removed",
                    "Subs": [],
                    "_oid": `${epicOidToken}`
                }
            ]];
        const verfication = await asset_api_helper_1.assetApiPost(query);
        t.deepEqual(verfication.data.queryResult.results, verifyExpectation);
    });
}
//# sourceMappingURL=update_Epic_Subs_relation_by_removing_Story_references_via_subquery.js.map