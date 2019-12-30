import {test, assetApiPost} from '../lib/asset-api-helper';

const types = ['yaml', 'json'];

for(const type of types) {
    test(`Execute Undelete Operation upon deleted Story (${type})`, async t => {
        const setupCommand = `
AssetType: Scope
Name: Test - Execute Undelete upon Story Scope
Parent: Scope:0
BeginDate: ${new Date().toJSON()}
Workitems:
- AssetType: Story
  Name: I will be deleted and undeleted
`
        let res = await assetApiPost(setupCommand);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsCreated.count, 2, "Expected 2 Assets to be created");
        const [scopeOidToken, storyOidToken] = res.data.assetsCreated.oidTokens;

        const commands = {
            yaml: `
from: Story
where:
 Scope: ${scopeOidToken}
execute: Delete
`,
            json: `
{
    "from": "Story",
    "where": {
        "Scope": "${scopeOidToken}"
    },
    "execute": "Delete"
}
`
        };

        let payload = commands[type];

        res = await assetApiPost(payload, type);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsOperatedOn.count, 1, "Expected 1 Asset to be operated upon");

        let query = `
from: Story
where:
 Scope: ${scopeOidToken}
 IsDeleted: true
`
        const verifyExpectation = [
            [
                {
                    "_oid": storyOidToken
                }
            ]
        ];

        let verfication = await assetApiPost(query);
        t.deepEqual(verfication.data.queryResult.results, verifyExpectation);

        const undeleteCommands = {
            yaml: `
from : ${storyOidToken}
where:
 IsDeleted: true
execute: Undelete
`,
            json: `
{
    "from": "${storyOidToken}",
    "where": {
        "IsDeleted": true
    },
    "execute": "Undelete"
}
`
        };
        
        payload = undeleteCommands[type];
        
        res = await assetApiPost(payload, type);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsOperatedOn.count, 1, "Expected 1 Asset to be operated upon");

        query = `
from: ${storyOidToken}
`;
        verfication = await assetApiPost(query);
        t.deepEqual(verfication.data.queryResult.results, verifyExpectation);
    });
}