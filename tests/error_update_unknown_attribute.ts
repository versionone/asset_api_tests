import {test, assetApiPost} from '../lib/asset-api-helper';

const commands = [
  {
      type: 'yaml',
      payload: `
from: Scope:0
update:
  MuddleBubble: BubbleMuddle
`
  },
  {
      type: 'json',
      payload: `
{
  "from": "Scope:0",
  "update": {
    "MuddleBubble": "BubbleMuddle"
  }
}
`
  }
];

for(const command of commands) {
    test(`Error: Update Unknown Attribute (${command.type})`, async t => {
      const res = await assetApiPost(command.payload, command.type);
      t.is(res.status, 200, "Expected 200 OK");
      const verifyExpectation =
      {
        "commands": [
          {
            "@update": {
              "oid": "Scope:0",
              "update": {
                "MuddleBubble": {
                  "add": [
                    "BubbleMuddle"
                  ],
                  "remove": []
                }
              }
            },
            "error": {
              "message": "Unknown AttributeDefinition: Scope.MuddleBubble",
              "sourceCommandIndex": 0
            }
          }
        ],
        "count": 1
      };

      const actual = res.data.commandFailures;
      t.is(actual.count, 1, "Expected 1 failure");
      
      const aliasIndex = 0;
      // Carefully compare variant and invariant parts
      const nixStackTrace = error => { if (error.hasOwnProperty("stackTrace")) delete error.stackTrace; }

      const updateIndex = 0;
      const updateActualAll  = actual.commands[updateIndex];
      const updateExpectDetails = verifyExpectation.commands[updateIndex]["@update"];
      const updateExpectError = verifyExpectation.commands[updateIndex].error;
      const updateKey = Object.keys(updateActualAll)[aliasIndex];
      const updateActualDetails = updateActualAll[updateKey];
      const updateActualError = updateActualAll.error;
      nixStackTrace(updateActualError);
      t.deepEqual(updateExpectDetails, updateActualDetails);
      t.deepEqual(updateExpectError, updateActualError);
    });
}