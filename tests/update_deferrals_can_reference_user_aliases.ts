import {test, assetApiPost} from '../lib/asset-api-helper';

const commands = [
    {
      type: 'yaml',
      payload: `
AssetType: Story
Name: New Story
Scope: Scope:0
Children:
- "@task":
   AssetType: Task
   Name: Do it now
---
from: "@task"
select:
- Name
- Parent
---  
"@update":
 from: "@task"
 update:
  Name: It is done!
---
from: "@task"
select:
- Name
- Parent
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
        "@task": {
          "AssetType": "Task",
          "Name": "Do it now"
        }
      }
    ]
  },
  {
    "from": "@task",
    "select": [
      "Name",
      "Parent"
    ]
  },
  {
    "@update": {
      "from": "@task",
      "update": {
        "Name": "It is done!"
      }
    }
  },
  {
    "from": "@task",
    "select": [
      "Name",
      "Parent"
    ]
  }
]`
}];

for(const command of commands) {
    test(`Update deferrals can reference user-supplied aliases (${command.type})`, async t => {

        let res = await assetApiPost(command.payload, command.type);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsCreated.count, 2, "Expected 2 Assets to be created");
        const [storyOidToken, taskOidToken] = res.data.assetsCreated.oidTokens;

        t.is(res.data.assetsModified.count, 1);
        t.is(res.data.assetsModified.oidTokens[0], taskOidToken);

        const queryResultExpectation =  {
            results: [
                [
                    {
                        "_oid": `${taskOidToken}`,
                        "Name": "Do it now",
                        "Parent": {
                            "_oid": `${storyOidToken}`
                        }
                    }
                ],
                [
                    {
                        "_oid": `${taskOidToken}`,
                        "Name": "It is done!",
                        "Parent": {
                            "_oid": `${storyOidToken}`
                        }
                    }
                ]
            ],
            count: 2
        };

        t.deepEqual(res.data.queryResult, queryResultExpectation);
    });
}