"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asset_api_helper_1 = require("../lib/asset-api-helper");
const commands = [
    {
        type: 'yaml',
        payload: `
from: Story
where:
 Name: There really shouldn't be a Story with this name in the system (unless someone makes one, in which case I really detest them for that)
---
from: Defect
where:
 Name: There really shouldn't be a Defect with this name in the system (unless someone makes one, in which case I really detest them for that)
`
    },
    {
        type: 'json',
        payload: `
[
  {
    "from": "Story",
    "where": {
      "Name": "There really shouldn't be a Story with this name in the system (unless someone makes one, in which case I really detest them for that)"
    }
  },
  {
    "from": "Defect",
    "where": {
      "Name": "There really shouldn't be a Defect with this name in the system (unless someone makes one, in which case I really detest them for that)"
    }
  }
]`
    }
];
for (const command of commands) {
    asset_api_helper_1.test(`Query for multiple result sets using independent queries when none returns matches (${command.type})`, async (t) => {
        let res = await asset_api_helper_1.assetApiPost(command.payload, command.type);
        t.is(res.status, 200, "Expected 200 OK");
        const verifyExpectation = {
            results: [
                [],
                []
            ],
            count: 2
        };
        t.deepEqual(res.data.queryResult, verifyExpectation);
    });
}
//# sourceMappingURL=query_for_multiple_result_sets_using_independent_queries_when_none_returns_matches.js.map