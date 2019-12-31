import {test, assetApiPost} from '../lib/asset-api-helper';

const commands = [
    {
      type: 'yaml',
      payload: `
AssetType: Story
Name: New Story
Scope: Scope:0
Children:
- "@test":
   AssetType: Test
   Name: Will be Closed before the request is finished
---
from: "@test"
select:
- Name
- Parent
- AssetState
---  
"@inactivate":
 from: "@test"
 execute: Inactivate
---
from: "@test"
select:
- Name
- Parent
- AssetState
`},
    {
     type: 'json',
     payload: `
[
  {
    "AssetType": "Story",
    "Name": "New Story",
    "Scope": "Scope:0",
    "Children": [
      {
        "@test": {
          "AssetType": "Test",
          "Name": "Will be Closed before the request is finished"
        }
      }
    ]
  },
  {
    "from": "@test",
    "select": [
      "Name",
      "Parent",
      "AssetState"
    ]
  },
  {
    "@inactivate": {
      "from": "@test",
      "execute": "Inactivate"
    }
  },
  {
    "from": "@test",
    "select": [
      "Name",
      "Parent",
      "AssetState"
    ]
  }
]`
}];

for(const command of commands) {
    test(`Execute deferrals can reference user-supplied aliases (${command.type})`, async t => {

        let res = await assetApiPost(command.payload, command.type);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsCreated.count, 2, "Expected 2 Assets to be created");
        const [storyOidToken, testOidToken] = res.data.assetsCreated.oidTokens;

        t.is(res.data.assetsOperatedOn.count, 1);
        t.is(res.data.assetsOperatedOn.oidTokens[0], testOidToken);

        const queryResultExpectation =  {
          results: [
            [
              {
                "_oid": `${testOidToken}`,
                "Name": "Will be Closed before the request is finished",
                "Parent": {
                  "_oid": `${storyOidToken}`
                },
                "AssetState": "Active"
              }
            ],
            [
              {
                "_oid": `${testOidToken}`,
                "Name": "Will be Closed before the request is finished",
                "Parent": {
                  "_oid": `${storyOidToken}`
                },
                "AssetState": "Closed"
              }
            ]
          ],
          count: 2
        };

        t.deepEqual(res.data.queryResult, queryResultExpectation);
    });
}