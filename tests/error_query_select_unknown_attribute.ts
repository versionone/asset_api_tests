import {test, assetApiPost} from '../lib/asset-api-helper';
import documenter from '../lib/documenter';

const commands = [
  {
      type: 'yaml',
      payload: `
"@user-alias":
  from: Scope
  select:
  - MuddleBubble
`
  },
  {
      type: 'json',
      payload: `
{
  "@user-alias": {
    "from": "Scope",
    "select": [
      "MuddleBubble"
    ]
  }
}
`
  }
];

for(const command of commands) {
    const doc = documenter();  
    doc.exampleName(`bulk/error_query_select_unknown_attribute`);
    const title = 'Error: Query select unknown attribute';
    doc.title(title);
    doc.type(command.type);
    doc.description("Demonstrates how the API will return a failure when you attempt to invoke an unknown attribute definition on an asset.");
    test(`${title} (${command.type})`, async t => {
      const res = await assetApiPost(command.payload, command.type);
      t.is(res.status, 200, "Expected 200 OK");
      const verifyExpectation =
      {
        "commands": [
          {
            "@user-alias": {
              "from": "Scope",
              "select": [
                "MuddleBubble"
              ]
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
      const nixStackTrace = error => { if (error.hasOwnProperty("stackTrace")) delete error.stackTrace; }
      nixStackTrace(actual.commands[0].error);
      t.deepEqual(actual, verifyExpectation);

      doc.request({ payload: command.payload, responseObject: res, responseObservations : [
        "Notice that object returned in the `commandFailures.commands` property is in the form of a complete command. In this example, you could correct the selected attribute name to reference a legitimate attribute that exists on the Scope asset type."
      ]});
      doc.emit();
    });
}