"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asset_api_helper_1 = require("../lib/asset-api-helper");
const commands = [
    {
        type: 'yaml',
        payload: `
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
for (const command of commands) {
    asset_api_helper_1.test(`Query for multiple result sets using independent queries when only one returns matches (${command.type})`, async (t) => {
        let res = await asset_api_helper_1.assetApiPost(command.payload, command.type);
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
        const verfication = await asset_api_helper_1.assetApiPost(query);
        t.deepEqual(verfication.data.queryResult, verifyExpectation);
    });
}
//# sourceMappingURL=query_for_multiple_result_sets_using_independent_queries_when_only_one_returns_matches.js.map