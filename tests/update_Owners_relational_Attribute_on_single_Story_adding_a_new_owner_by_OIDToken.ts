import {test, assetApiPost} from '../lib/asset-api-helper';

const types = ['yaml', 'json'];

for(const type of types) {
    test(`Update Owners relational Attribute on single Story, adding a new owner by OIDToken (${type})`, async t => {
        const setupCommand = `
AssetType: Scope
Name: Test - Update Owners relational Attribute Scope
Parent: Scope:0
BeginDate: ${new Date().toJSON()}
Workitems:
- AssetType: Story
  Name: I need an Owner!
`
        let res = await assetApiPost(setupCommand);
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

        res = await assetApiPost(payload, type);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsModified.count, 1, "Expected 1 Assets to be modified");

        const query = `
from: ${firstStoryOidToken}
select:
- Owners
`
        const verifyExpectation = [[
            {
                "_oid": firstStoryOidToken,
                "Owners": [{
                    "_oid": "Member:20"
                }]
            }
        ]];

        const verfication = await assetApiPost(query);
        t.deepEqual(verfication.data.queryResult.results, verifyExpectation);
    });
}