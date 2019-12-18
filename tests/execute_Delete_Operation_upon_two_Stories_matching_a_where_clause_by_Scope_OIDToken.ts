import {test, assetApiPost} from '../lib/asset-api-helper';

const types = ['yaml', 'json'];

for(const type of types) {
    test(`Execute Delete Operation upon two Stories matching a where clause by Scope OIDToken (${type})`, async t => {
        const setupCommand = `
AssetType: Scope
Name: Test - Execute Delete Operation Scope
Parent: Scope:0
BeginDate: ${new Date().toJSON()}
Workitems:
- AssetType: Story
  Name: I will be deleted
- AssetType: Story
  Name: I will also be deleted
`
        let res = await assetApiPost(setupCommand);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsCreated.count, 3, "Expected 3 Assets to be created");
        const [scopeOidToken] = res.data.assetsCreated.oidTokens;

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

        const payload = commands[type];

        res = await assetApiPost(payload, type);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsOperatedOn.count, 2, "Expected 2 Assets to be operated upon");

        const query = `
from: Story
where:
 Scope: ${scopeOidToken}
`
        const verifyExpectation = [[]];

        const verfication = await assetApiPost(query);
        t.deepEqual(verfication.data.queryResult.results, verifyExpectation);
    });
}