import {test, assetApiPost} from '../lib/asset-api-helper';

const commands = 
[
  {
    type: 'yaml',
    payload:  `
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

for(const command of commands) {
    test(`Query for multiple result sets using independent queries when none returns matches (${command.type})`, async t => {
        let res = await assetApiPost(command.payload, command.type);
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