import {test, assetApiPost} from '../lib/asset-api-helper';

const commands = [
  {
    type: 'yaml',
    payload: `
config: counts-only
---
from: Request
where:
 Name: This really shouldn't exist, thus it should return no matches. However, if it does, then this test will fail and it will be pretty obvious as to why!
execute: Delete
`
  },
  {
    type: 'json',
    payload: `
[
  {
    "config": "counts-only"
  },
  {
    "from": "Request",
    "where": {
      "Name": "This really shouldn't exist, thus it should return no matches. However, if it does, then this test will fail and it will be pretty obvious as to why!"
    },
    "execute": "Delete"
  }
]
`
  }];

for(const command of commands) {
    test(`Config counts-only for execute operation on Asset (${command.type})`, async t => {
      const res = await assetApiPost(command.payload, command.type);
      t.is(res.status, 200, "Expected 200 OK");
      const verification = {
        count: 0
      };
      t.deepEqual(res.data.assetsModified, verification);
    });
}