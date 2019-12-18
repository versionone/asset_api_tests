import {test, assetApiPost} from '../lib/asset-api-helper';

const types = ['yaml', 'json'];

for(const type of types) {
    test(`Update Name Text scalar Attribute on two Stories, replacing one exact match string with another by OIDToken (${type})`, async t => {
        const setupCommand = `
AssetType: Scope
Name: Test - Update Name Text scalar Attribute on two Stories with find and replace Scope
Parent: Scope:0
BeginDate: ${new Date().toJSON()}
Workitems:
- AssetType: Story
  Name: Product-To-Be-Named-Later is a marketing approved product name!
- AssetType: Story
  Name: Product-To-Be-Named-Later is for math wizards who want to do their calculations in the cloud.
`
        let res = await assetApiPost(setupCommand);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsCreated.count, 3, "Expected 3 Assets to be created");
        const [scopeOidToken, firstStoryOidToken, secondStoryOidToken] = res.data.assetsCreated.oidTokens;

// TODO: don't hardcode the Member:1040
        const commands = {
            yaml: `
from: Story
where:
 Scope: ${scopeOidToken}
update:
 Name:
  find: Product-To-Be-Named-Later
  replace: Awesum.ly
`,
            json: `
{
    "from": "Story",
    "where": {
        "Scope": "${scopeOidToken}"
    },
    "update": {
        "Name": {
            "find": "Product-To-Be-Named-Later",
            "replace": "Awesum.ly"
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
- Name
`
        const verifyExpectation = [[
            {
                "_oid": firstStoryOidToken,
                "Name": "Awesum.ly is a marketing approved product name!"
            },
            {
                "_oid": secondStoryOidToken,
                "Name": "Awesum.ly is for math wizards who want to do their calculations in the cloud."
            }            
        ]];

        const verfication = await assetApiPost(query);
        t.deepEqual(verfication.data.queryResult.results, verifyExpectation);
    });
}