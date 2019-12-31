import {test, assetApiPost} from '../lib/asset-api-helper';

const commands = [
  {
    type: 'yaml',
    payload: `
config: counts-only
---
AssetType: Story
Scope: Scope:0
Name: My Story
Children:
- AssetType: Test
  Name: My Test
`},
  {
    type: 'json',
    payload: `
[
  {
    "config": "counts-only"
  },
  {
    "AssetType": "Story",
    "Scope": "Scope:0",
    "Name": "My Story",
    "Children": [
      {
        "AssetType": "Test",
        "Name": "My Test"
      }
    ]
  }
]
`
  }];

for(const command of commands) {
    test(`Config counts-only for create Assets (${command.type})`, async t => {
      const res = await assetApiPost(command.payload, command.type);
      t.is(res.status, 200, "Expected 200 OK");
      const verification = {
        count: 2
      };
      t.deepEqual(res.data.assetsCreated, verification);
    });
}