import {test, assetApiPost} from '../lib/asset-api-helper';

const commands = 
[
  {
    type: 'yaml',
    payload:  `
AssetType: Story
Name: Story 1
Scope: Scope:0
---
AssetType: Story
Name: Story 2
Scope: Scope:0
---
AssetType: Story
Name: Story 3
Scope: Scope:0
`
  },
  {
    type: 'json',
    payload: `
[
  {
    "AssetType": "Story",
    "Name": "Story 1",
    "Scope": "Scope:0"
  },
  {
    "AssetType": "Story",
    "Name": "Story 2",
    "Scope": "Scope:0"
  },
  {
    "AssetType": "Story",
    "Name": "Story 3",
    "Scope": "Scope:0"
  }
]`
  }
];

for(const command of commands) {
    test(`Query for multiple result sets using independent queries when all return matches (${command.type})`, async t => {
        let res = await assetApiPost(command.payload, command.type);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsCreated.count, 3, "Expected 3 created assets");

        const [story1OidToken, story2OidToken, story3OidToken] = res.data.assetsCreated.oidTokens;

        const query = `
from: ${story1OidToken}
---
from: ${story2OidToken}
---
from: ${story3OidToken}
`;
        
        const verifyExpectation = {
            results: [
                [
                    {
                        "_oid": story1OidToken
                    }
                ],
                [
                    {
                        "_oid": story2OidToken
                    }
                ],
                [
                    {
                        "_oid": story3OidToken
                    }
                ]
            ],
            count: 3
        };
        
        const verfication = await assetApiPost(query);
        t.deepEqual(verfication.data.queryResult, verifyExpectation);
    });
}