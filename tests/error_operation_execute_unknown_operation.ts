import {test, assetApiPost} from '../lib/asset-api-helper';
import documenter from '../lib/documenter';

const commands = [
  {
      type: 'yaml',
      payload: `
from: Scope:0
execute: NonexistentOperation
`
  },
  {
      type: 'json',
      payload: `
{
  "from": "Scope:0",
  "execute": "NonexistentOperation"
}
`
  }
];

for(const command of commands) {
    const doc = documenter();
    doc.exampleName(`bulk/error_invoke_unknown_operation`);
    const title = 'Error: Invoke unknown operation';
    test(`${title} (${command.type})`, async t => {
      doc.title(title);
      doc.type(command.type);
      doc.description("Demonstrates how the API will return a failure when you attempt to invoke an unknown operation on an asset.");
      const res = await assetApiPost(command.payload, command.type);
      t.is(res.status, 200, "Expected 200 OK");
      const verifyExpectation =
      {
        "commands": [
          {
            "@op": {
              "oid": "Scope:0",
              "execute": {
                "op": "NonexistentOperation",
                "args": {}
              }
            },
            "error": {
              "message": "Unknown Operation 'Scope.NonexistentOperation'",
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

      const opIndex = 0;
      const opActualAll  = actual.commands[opIndex];
      const opExpectDetails = verifyExpectation.commands[opIndex]["@op"];
      const opExpectError = verifyExpectation.commands[opIndex].error;
      const opKey = Object.keys(opActualAll)[aliasIndex];
      const opActualDetails = opActualAll[opKey];
      const opActualError = opActualAll.error;
      nixStackTrace(opActualError);
      t.deepEqual(opExpectDetails, opActualDetails);
      t.deepEqual(opExpectError, opActualError);

      doc.request({ payload: command.payload, responseObject: res, responseObservations : [
        "Notice that object returned in the `commandFailures.commands` property is in the form of a complete command. In this example, you could correct the operation name to reference a legitimate operation that exists on the Scope asset type."
      ]});
      doc.emit();
    });
}