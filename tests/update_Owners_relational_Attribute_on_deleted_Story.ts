import {test, assetApiPost} from '../lib/asset-api-helper';

const types = ['yaml', 'json'];

for(const type of types) {
    test(`Update Owners relational Attribute on deleted Story (${type})`, async t => {
        const setupCommand = `
AssetType: Scope
Name: Test - Update Owners on deleted Story Scope
Parent: Scope:0
BeginDate: ${new Date().toJSON()}
Workitems:
- AssetType: Story
  Name: I will be deleted and then updated
`
        let res = await assetApiPost(setupCommand);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsCreated.count, 2, "Expected 2 Assets to be created");
        const [scopeOidToken, storyOidToken] = res.data.assetsCreated.oidTokens;

        const commands = {
            yaml: `
from: ${storyOidToken}
execute: Delete
`,
            json: `
{
    "from": "${storyOidToken}",
    "execute": "Delete"
}
`
        };

        let payload = commands[type];

        res = await assetApiPost(payload, type);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsOperatedOn.count, 1, "Expected 1 Asset to be operated upon");

        const updateCommands = {
            yaml: `
from : ${storyOidToken}
where:
 IsDeleted: true
update:
 Owners: Member:20
`,
            json: `
{
    "from": "${storyOidToken}",
    "where": {
        "IsDeleted": true
    },
    "update": {
        "Owners": "Member:20"
    }
}
`
        };
        
        payload = updateCommands[type];
        
        res = await assetApiPost(payload, type);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsModified.count, 1, "Expected 1 Asset to be modified");

        const query = `
from: Story
where:
 Scope: ${scopeOidToken}
 IsDeleted: true
select:
- Owners
`
        const verifyExpectation = [
            [
                {
                    "_oid": storyOidToken,
                    "Owners":[{
                        "_oid": "Member:20"
                    }]
                }
            ]
        ];

        const verfication = await assetApiPost(query);
        t.deepEqual(verfication.data.queryResult.results, verifyExpectation);
    });
}