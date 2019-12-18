import {test, assetApiPost} from '../lib/asset-api-helper';

const types = ['yaml', 'json'];

for(const type of types) {
    test(`Update Owners relational Attribute on two Stories, adding two new owners by OIDToken (${type})`, async t => {
        const setupCommand = `
from: Story
where:
 Scope.Name: Owners find and replace
execute: Delete
---
from: Scope
where:
 Name: Owners find and replace
execute: Delete
---
from: Member
where:
 Name: User1
execute: Delete
---
AssetType: Scope
Name: Owners find and replace
Parent: Scope:0
BeginDate: ${new Date().toJSON()}
Workitems:
- AssetType: Story
  Name: I have one owner, but want another
  Owners: Member:20
- AssetType: Story
  Name: I have the same owner, and want the same different owner
  Owners: Member:20
---
AssetType: Member
Name: User1
Password: User1
Nickname: User1
Username: User1
DefaultRole: Role.Name'Project Admin
Scopes: Owners find and replace
`
        let res = await assetApiPost(setupCommand);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsCreated.count, 4, "Expected 4 Assets to be created");
        const [scopeOidToken, firstStoryOidToken, secondStoryOidToken, memberOidToken] = res.data.assetsCreated.oidTokens;

// TODO: don't hardcode the Member:1040
        const commands = {
            yaml: `
from: Story
where:
 Scope: ${scopeOidToken}
update:
 Owners:
  find: Member:20
  replace: ${memberOidToken}
`,
            json: `
{
  "from": "Story",
  "where": {
    "Scope": "${scopeOidToken}"
  },
  "update": {
    "Owners": {
      "find": "Member:20",
      "replace": "${memberOidToken}"
     }
  }
}
`
        };

        const payload = commands[type];

        res = await assetApiPost(payload, type);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsModified.count, 2, "Expected 2 Assets to be modified");

        const query = `
from: Story
where:
 Scope: ${scopeOidToken}
select:
- Owners
`
        const verifyExpectation = [[
            {
                "_oid": firstStoryOidToken,
                "Owners": [{
                        "_oid": memberOidToken
                    }
                ]
            },
            {
                "_oid": secondStoryOidToken,
                "Owners": [{
                        "_oid": memberOidToken
                    }
                ]
            }
        ]];

        const verfication = await assetApiPost(query);
        t.deepEqual(verfication.data.queryResult.results, verifyExpectation);
    });
}