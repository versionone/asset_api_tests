import {test, assetApiPost} from '../lib/asset-api-helper';

const types = ['yaml', 'json'];

for(const type of types) {
    test(`Update Description LongText scalar Attribute on two Defects, replacing one exact match string with another by OIDToken (${type})`, async t => {
        const setupCommand = `
AssetType: Scope
Name: Test - Update Description LongText scalar Attribute on two Defects with find and replace Scope
Parent: Scope:0
BeginDate: ${new Date().toJSON()}
Workitems:
- AssetType: Defect
  Name: Defect 1
  Description: The Cog is busted in spot 1.
- AssetType: Defect
  Name: Defect 2
  Description: The Cog is also busted in spot 2.
`
        let res = await assetApiPost(setupCommand);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsCreated.count, 3, "Expected 3 Assets to be created");
        const [scopeOidToken, firstDefectOidToken, secondDefectOidToken] = res.data.assetsCreated.oidTokens;

// TODO: don't hardcode the Member:1040
        const commands = {
            yaml: `
from: Defect
where:
 Scope: ${scopeOidToken}
update:
 Description:
  find: Cog
  replace: Sprocket
`,
            json: `
{
    "from": "Defect",
    "where": {
        "Scope": "${scopeOidToken}"
    },
    "update": {
        "Description": {
            "find": "Cog",
            "replace": "Sprocket"
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
from: Defect
where:
 Scope: ${scopeOidToken}
select:
- Description
`
        const verifyExpectation = [[
            {
                "_oid": firstDefectOidToken,
                "Description": "The Sprocket is busted in spot 1."
            },
            {
                "_oid": secondDefectOidToken,
                "Description": "The Sprocket is also busted in spot 2."
            }
        ]];

        const verfication = await assetApiPost(query);
        t.deepEqual(verfication.data.queryResult.results, verifyExpectation);
    });
}