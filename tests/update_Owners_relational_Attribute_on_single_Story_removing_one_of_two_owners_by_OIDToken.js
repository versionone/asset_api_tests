"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asset_api_helper_1 = require("../lib/asset-api-helper");
const types = ['yaml', 'json'];
for (const type of types) {
    asset_api_helper_1.test(`Update Owners relational Attribute on single Story, removing one of two owners by OIDToken (${type})`, async (t) => {
        const setupCommand = `
from: Story
where:
 Scope.Name: Remove one owner
execute: Delete
---
from: Scope
where:
 Name: Remove one owner
execute: Delete
---
from: Member
where:
 Name: User2
execute: Delete
---
AssetType: Scope
Name: Remove one owner
Parent: Scope:0
BeginDate: ${new Date().toJSON()}
---
AssetType: Member
Name: User2
Password: User2
Nickname: User2
Username: User2
DefaultRole: Role.Name'Project Admin
Scopes: Remove one owner
---
AssetType: Story
Name: I need to drop one of these Owners!
Scope: Remove one owner
Owners:
 from: Member
 filter: ["Name='Administrator','User2'"]
`;
        let res = await asset_api_helper_1.assetApiPost(setupCommand);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsCreated.count, 3, "Expected 3 Assets to be created");
        const [scopeOidToken, memberOidToken, firstStoryOidToken] = res.data.assetsCreated.oidTokens;
        // TODO: don't hardcode the Member:1040
        const commands = {
            yaml: `
from: ${firstStoryOidToken}
update:
 Owners:
  'Member:20': remove
`,
            json: `
{
    "from": "${firstStoryOidToken}",
    "update": {
        "Owners": {
            "Member:20": "remove"
        }
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
                    "Owners": [{
                            "_oid": memberOidToken
                        }
                    ],
                    "_oid": firstStoryOidToken
                }
            ]];
        const verfication = await asset_api_helper_1.assetApiPost(query);
        t.deepEqual(verfication.data.queryResult.results, verifyExpectation);
    });
}
//# sourceMappingURL=update_Owners_relational_Attribute_on_single_Story_removing_one_of_two_owners_by_OIDToken.js.map