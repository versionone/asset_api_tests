import {test, assetApiPost} from '../lib/asset-api-helper';

const types = ['yaml', 'json'];

for(const type of types) {
    test(`Update Owners relational Attribute on single Story, adding and removing owners with object context pointing to arrays by OIDToken (${type})`, async t => {
        const setupCommand = `
from: Story
where:
 Scope.Name: Owners add & remove by array
execute: Delete
---
from: Scope
where:
 Name: Owners add & remove by array
execute: Delete
---
from: Member
filter: ["Name='User6','User7'"]
execute: Delete
---
AssetType: Scope
Name: Owners add & remove by array
Parent: Scope:0
BeginDate: ${new Date().toJSON()}
---
AssetType: Member
Name: User6
Password: User6
Nickname: User6
Username: User6
DefaultRole: Role.Name'Project Admin
Scopes: Owners add & remove by array
---
AssetType: Member
Name: User7
Password: User7
Nickname: User7
Username: User7
DefaultRole: Role.Name'Project Admin
Scopes: Owners add & remove by array
---
AssetType: Story
Name: I need to drop one of these Owners and add another!
Scope: Owners add & remove by array
Owners:
 from: Member
 filter: ["Name='Administrator','User6'"]
`;
        let res = await assetApiPost(setupCommand);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsCreated.count, 4, "Expected 4 Assets to be created");
        const [scopeOidToken, member1OidToken, member2OidToken, storyOidToken] = res.data.assetsCreated.oidTokens;

// TODO: don't hardcode the Member:1040 or Member:2071!
        const commands = {
            yaml: `
from: ${storyOidToken}
update:
 Owners:
  remove:
  - Member:20
  add:
  - ${member2OidToken}
`,
            json: `
{
    "from": "${storyOidToken}",
    "update": {
        "Owners": {
            "remove": [
                "Member:20"
            ],
            "add": [
                "${member2OidToken}"
            ]
        }
    }
}
`
        };

        const payload = commands[type];

        res = await assetApiPost(payload, type);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsModified.count, 1, "Expected 1 Assets to be modified");

        const query = `
from: ${storyOidToken}
select:
- Owners
`
        const verifyExpectation = [[
            {
                "_oid": storyOidToken,
                "Owners": [{
                        "_oid": member1OidToken
                    },
                    {
                        "_oid": member2OidToken
                    }
                ]
            }
        ]];

        const verfication = await assetApiPost(query);
        t.deepEqual(verfication.data.queryResult.results, verifyExpectation);
    });
}