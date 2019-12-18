import {test, assetApiPost} from '../lib/asset-api-helper';

const commands =
[
  {
    type: 'yaml',
    payload:  `
AssetType: Story
Name: Story should exist
Scope: Scope:0
`
  },
  {
    type: 'json',
    payload: `
[
  {
    "AssetType": "Story",
    "Name": "Story should exist",
    "Scope": "Scope:0"
  }
]`
  }
];

for(const command of commands) {
    test(`Query for multiple result sets using independent queries when only one returns matches (${command.type})`, async t => {
        let res = await assetApiPost(command.payload, command.type);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsCreated.count, 1, "Expected 1 created assets");

        const [story1OidToken] = res.data.assetsCreated.oidTokens;

        const query = `
from: ${story1OidToken}
---
from: Story
where:
 Name: There really shouldn't be a story with this name in the system (unless someone makes one, in which case I really detest them for that)
`;

        const verifyExpectation = {
            results: [
                [
                    {
                        "_oid": story1OidToken
                    }
                ],
                []
            ],
            count: 2
        };

        const verfication = await assetApiPost(query);
        t.deepEqual(verfication.data.queryResult, verifyExpectation);
    });
}