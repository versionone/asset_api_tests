import {test, assetApiPost} from '../lib/asset-api-helper';

const commands =
[
  {
    type: 'yaml',
    payload: `
"@story":
 AssetType: Story
 Name: New Story
 Scope: Scope:0
---
from: "@story"
select:
- Name
- Number
`
  },
  {
    type: 'json',
    payload: `
[
  {
    "@story": {
      "AssetType": "Story",
      "Name": "New Story",
      "Scope": "Scope:0"
    }
  },
  {
    "from": "@story",
    "select": [
      "Name",
      "Number"
    ]
  }
]
`
  }
];

for(const command of commands) {
    test(`Query can refer to user-supplied aliases (${command.type})`, async t => {
        let res = await assetApiPost(command.payload, command.type);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsCreated.count, 1, "Expected 1 Asset to be created");
        t.is(res.data.queryResult.count, 1);
        t.is(res.data.queryResult.results[0].length, 1, "Expected 1 Asset returned in the result set");

        const [storyOidToken] = res.data.assetsCreated.oidTokens;
        const story = res.data.queryResult.results[0][0];

        t.is(story.Name, "New Story");
        t.is(story._oid, storyOidToken);
        t.true(story.Number.startsWith("S-"), "Expected story.Number to start with 'S-'");
    });
}