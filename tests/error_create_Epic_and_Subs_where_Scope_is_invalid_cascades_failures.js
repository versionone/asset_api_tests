"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asset_api_helper_1 = require("../lib/asset-api-helper");
const documenter_1 = require("../lib/documenter");
const commands = [
    {
        type: 'yaml',
        payload: `
AssetType: Epic
Scope: Scope:9999
Name: My Epic on a Scope that DOES NOT EXIST which will produce a cascade of four failures!
Subs:
- AssetType: Story
  Name: My Story
  Children:
  - AssetType: Test
    Name: My Test
  - AssetType: Task
    Name: My Task
`
    },
    {
        type: 'json',
        payload: `
{
  "AssetType": "Epic",
  "Scope": "Scope:9999",
  "Name": "My Epic on a Scope that DOES NOT EXIST which will produce a cascade of four failures!",
  "Subs": [
    {
      "AssetType": "Story",
      "Name": "My Story",
      "Children": [
        {
          "AssetType": "Test",
          "Name": "My Test"
        },
        {
          "AssetType": "Task",
          "Name": "My Task"
        }
      ]
    }
  ]
}
`
    }
];
for (const command of commands) {
    const doc = documenter_1.default();
    doc.exampleName('bulk/error_cascading_failures');
    const title = 'Error: Cascading failures when creating a hierarchy of assets';
    asset_api_helper_1.test(`${title} (${command.type})`, async (t) => {
        doc.title(title);
        doc.type(command.type);
        doc.description("Demonstrates how the API will return a cascade of failures when attempting to create a nested hierarchy of assets. In this case, because the request specifies an invalid Scope on a top-level Epic, four total failure messages get produced. The failure messages can be modified and resubmitted to the API to create the original request's assets with the correct hierarchical relationships.");
        const res = await asset_api_helper_1.assetApiPost(command.payload, command.type);
        t.is(res.status, 200, "Expected 200 OK");
        const verifyExpectation = {
            "commands": [
                {
                    "@epic": {
                        "AssetType": "Epic",
                        "Scope": "Scope:9999",
                        "Name": "My Epic on a Scope that DOES NOT EXIST which will produce a cascade of four failures!"
                    },
                    "error": {
                        "message": "Violation'Invalid'Epic.Scope",
                        "sourceCommandIndex": 0
                    }
                },
                {
                    "@story": {
                        "AssetType": "Story",
                        "Name": "My Story",
                        "#ContextOid": "@epic"
                    },
                    "error": {
                        "message": "Invalid OID token: @epic",
                        "sourceCommandIndex": 0
                    }
                },
                {
                    "@test": {
                        "AssetType": "Test",
                        "Name": "My Test",
                        "#ContextOid": "@story"
                    },
                    "error": {
                        "message": "Invalid OID token: @story",
                        "sourceCommandIndex": 0
                    }
                },
                {
                    "@task": {
                        "AssetType": "Task",
                        "Name": "My Task",
                        "#ContextOid": "@story"
                    },
                    "error": {
                        "message": "Invalid OID token: @story",
                        "sourceCommandIndex": 0
                    }
                }
            ],
            "count": 4
        };
        const actual = res.data.commandFailures;
        t.is(actual.count, 4, "Expected 4 failures");
        const aliasIndex = 0;
        // Carefully compare variant and invariant parts
        const nixStackTrace = error => { if (error.hasOwnProperty("stackTrace"))
            delete error.stackTrace; };
        const epicIndex = 0;
        const epicActualAll = actual.commands[epicIndex];
        const epicExpectDetails = verifyExpectation.commands[epicIndex]["@epic"];
        const epicExpectError = verifyExpectation.commands[epicIndex].error;
        const epicKey = Object.keys(epicActualAll)[aliasIndex];
        const epicActualDetails = epicActualAll[epicKey];
        const epicActualError = epicActualAll.error;
        nixStackTrace(epicActualError);
        t.deepEqual(epicExpectDetails, epicActualDetails);
        t.deepEqual(epicExpectError, epicActualError);
        // Story
        const storyIndex = 1;
        const storyActualAll = actual.commands[1];
        const storyExpectDetails = verifyExpectation.commands[storyIndex]["@story"];
        const storyExpectError = verifyExpectation.commands[storyIndex].error;
        storyExpectError.message = storyExpectError.message.replace("@epic", epicKey);
        const storyKey = Object.keys(storyActualAll)[aliasIndex];
        const storyActualDetails = storyActualAll[storyKey];
        storyExpectDetails["#ContextOid"] = epicKey;
        const storyActualError = storyActualAll.error;
        nixStackTrace(storyActualError);
        t.deepEqual(storyExpectDetails, storyActualDetails);
        t.deepEqual(storyExpectError, storyActualError);
        // Test
        const testIndex = 2;
        const testActualAll = actual.commands[testIndex];
        const testExpectDetails = verifyExpectation.commands[testIndex]["@test"];
        const testExpectError = verifyExpectation.commands[testIndex].error;
        testExpectError.message = testExpectError.message.replace("@story", storyKey);
        const testKey = Object.keys(testActualAll)[aliasIndex];
        const testActualDetails = testActualAll[testKey];
        testExpectDetails["#ContextOid"] = storyKey;
        const testActualError = testActualAll.error;
        nixStackTrace(testActualError);
        t.deepEqual(testExpectDetails, testActualDetails);
        t.deepEqual(testExpectError, testActualError);
        // Task
        const taskIndex = 3;
        const taskActualAll = actual.commands[taskIndex];
        const taskExpectDetails = verifyExpectation.commands[taskIndex]["@task"];
        const taskExpectError = verifyExpectation.commands[taskIndex].error;
        taskExpectError.message = taskExpectError.message.replace("@story", storyKey);
        const taskKey = Object.keys(taskActualAll)[aliasIndex];
        const taskActualDetails = taskActualAll[taskKey];
        taskExpectDetails["#ContextOid"] = storyKey;
        const taskActualError = taskActualAll.error;
        nixStackTrace(taskActualError);
        t.deepEqual(taskExpectDetails, taskActualDetails);
        t.deepEqual(taskExpectError, taskActualError);
        doc.request({ payload: command.payload, responseObject: res, responseObservations: [
                "Notice that objects returned in the `commandFailures.commands` property are in the form of complete commands. In this example, you could edit the `Scope` value to point to an legitimate Scope and resubmit either the original payload that had the nested assets, or simply submit the array of four commands in the failure details. Since the descendant commands have been auto-aliased by the server and linearized, they will get processed properly by reference when resubmitted. The special `#ContextOid` keys that the server generated tell the server how to relate the descendant assets back to original hierarchy from the source command.",
                "Also notice that each failure has a `sourceCommandIndex` property that identifies a zero-based index of the command that generated this error from your original payload. Because our original payload contained nested assets, each of these commands has `0` for this value."
            ] });
        doc.emit();
    });
}
//# sourceMappingURL=error_create_Epic_and_Subs_where_Scope_is_invalid_cascades_failures.js.map