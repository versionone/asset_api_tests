VersionOne’s Bulk API, or the `api/asset` endpoint, makes it easy to create, update, or invoke operations on one or more assets with a single HTTP request using JSON or YAML. It builds upon the SQL-like syntax originally available in the query.v1 endpoint.

# Basic capabilities and usage

The next several sections will provide sample requests and responses for each of the Bulk API's basic capabilities shown in this diagram:

![image](https://user-images.githubusercontent.com/1863005/71534131-877f6780-28ca-11ea-9790-5c528942be5c.png)

For a video walkthrough of these capabilities and usage, see this screen video: https://www.youtube.com/watch?v=1NiP8cUTwKA&feature=youtu.be

## Access the /api/asset endpoint via API Console

API Console helps you use the `api/asset` endpoint. Load it at `ApiConsole.mvc` from any VersionOne instance, such as `http://localhost/VersionOne.Web/ApiConsole.mvc` if you are running locally.

![image](https://user-images.githubusercontent.com/1863005/71534189-07a5cd00-28cb-11ea-8729-9e6db308fabc.png)

## Create a single asset

### Request

```json
{
  "AssetType": "Story",
  "Scope": "Scope:0",
  "Name": "First Story"
}
```

### Response

```json
{
  "assetsCreated": {
    "oidTokens": [
      "Story:1585"
    ],
    "count": 1
  },
  "assetsModified": {
    "oidTokens": [],
    "count": 0
  },
  "assetsOperatedOn": {
    "oidTokens": [],
    "count": 0
  },
  "commandFailures": {
    "commands": [],
    "count": 0
  },
  "queryResult": {
    "results": [],
    "count": -1
  }
}
```

## Create multiple assets

### Request

```json
[
  {
    "AssetType": "Story",
    "Scope": "Scope:0",
    "Name": "Second Story"
  },
  {
    "AssetType": "Story",
    "Scope": "Scope:0",
    "Name": "Third Story"
  },
  {
    "AssetType": "Defect",
    "Scope": "Scope:0",
    "Name": "First Defect"
  }
]
```

### Response

```json
{
  "assetsCreated": {
    "oidTokens": [
      "Story:1586",
      "Story:1587",
      "Defect:1588"
    ],
    "count": 3
  },
  "assetsModified": {
    "oidTokens": [],
    "count": 0
  },
  "assetsOperatedOn": {
    "oidTokens": [],
    "count": 0
  },
  "commandFailures": {
    "commands": [],
    "count": 0
  },
  "queryResult": {
    "results": [],
    "count": -1
  }
}
```

## Create a hierarchy of assets 

### Request

```json
{
  "AssetType": "Epic",
  "Scope": "Scope:0",
  "Name": "Epic with Subs",
  "Category": "Epic",
  "Subs": [
    {
      "AssetType": "Epic",
      "Name": "Feature Epic",
      "Category": "Feature",
      "Subs": [
        {
          "AssetType": "Story",
          "Name": "Feature Story 1",
          "Children": [
            {
              "AssetType": "Task",
              "Name": "Code the feature"
            },
            {
              "AssetType": "Test",
              "Name": "Test the feature"
            }
          ]
        }
      ]
    }
  ]
}
```

### Response

```json
{
  "assetsCreated": {
    "oidTokens": [
      "Epic:1589",
      "Epic:1590",
      "Story:1591",
      "Task:1592",
      "Test:1593"
    ],
    "count": 5
  },
  "assetsModified": {
    "oidTokens": [],
    "count": 0
  },
  "assetsOperatedOn": {
    "oidTokens": [],
    "count": 0
  },
  "commandFailures": {
    "commands": [],
    "count": 0
  },
  "queryResult": {
    "results": [],
    "count": -1
  }
}
```

## Update a single asset

### Request

```json
{
  "from": "Story:1585",
  "update": {
    "Name": "Update members",
    "Description": "Given I am an admin, when I open a member's profile, I can edit fields."
  }
}
```

### Response

```json
{
  "assetsCreated": {
    "oidTokens": [],
    "count": 0
  },
  "assetsModified": {
    "oidTokens": [
      "Story:1585"
    ],
    "count": 1
  },
  "assetsOperatedOn": {
    "oidTokens": [],
    "count": 0
  },
  "commandFailures": {
    "commands": [],
    "count": 0
  },
  "queryResult": {
    "results": [],
    "count": -1
  }
}
```

## Update assets matching a query

### Request

```json
{
  "from": "Workitem",
  "where": {
    "Parent": "Story:1591"
  },
  "update": {
    "Owners": [
      "Member:20",
      "Member:1575"
    ]
  }
}
```

### Response

```json
{
  "assetsCreated": {
    "oidTokens": [],
    "count": 0
  },
  "assetsModified": {
    "oidTokens": [
      "Task:1592",
      "Test:1593"
    ],
    "count": 2
  },
  "assetsOperatedOn": {
    "oidTokens": [],
    "count": 0
  },
  "commandFailures": {
    "commands": [],
    "count": 0
  },
  "queryResult": {
    "results": [],
    "count": -1
  }
}
```

## Invoke operation on a single asset

### Request

```json
{
  "from": "Task:1022",
  "execute": "Delete"
}
```

### Response

```json
{
  "assetsCreated": {
    "oidTokens": [],
    "count": 0
  },
  "assetsModified": {
    "oidTokens": [],
    "count": 0
  },
  "assetsOperatedOn": {
    "oidTokens": [
      "Task:1592"
    ],
    "count": 1
  },
  "commandFailures": {
    "commands": [],
    "count": 0
  },
  "queryResult": {
    "results": [],
    "count": -1
  }
}
```
## Invoke an operation on assets matching query

### Request

```json
{
  "from": "Workitem",
  "where": {
    "Parent": "Story:1591"
  },
  "execute": "Delete"
}
```

### Response 
```json
{
  "assetsCreated": {
    "oidTokens": [],
    "count": 0
  },
  "assetsModified": {
    "oidTokens": [],
    "count": 0
  },
  "assetsOperatedOn": {
    "oidTokens": [
      "Task:1592",
      "Test:1593"
    ],
    "count": 2
  },
  "commandFailures": {
    "commands": [],
    "count": 0
  },
  "queryResult": {
    "results": [],
    "count": -1
  }
}
```

## Use aliases in requests

### Request

```json
[
  {
    "@story": {
      "AssetType": "Story",
      "Scope": "Scope:0",
      "Name": "Story Time"
    }
  },
  {
    "AssetType": "Test",
    "Parent": "@story",
    "Name": "Test Time"
  }
]
```

### Response

```json
{
  "assetsCreated": {
    "oidTokens": [
      "Story:1594",
      "Test:1595"
    ],
    "count": 2
  },
  "assetsModified": {
    "oidTokens": [],
    "count": 0
  },
  "assetsOperatedOn": {
    "oidTokens": [],
    "count": 0
  },
  "commandFailures": {
    "commands": [],
    "count": 0
  },
  "queryResult": {
    "results": [],
    "count": -1
  }
}
```

## Preview request actions without changing anything in the database

To preview what a request will do without actually triggering the behavior, post your request to `/api/asset?previewOnly=true`. For example, if you're running at `http://localhost/VersionOne.Web` you would post to `http://localhost/VersionOne.Web/api/asset?previewOnly=true`.

### Request

```json
{
  "AssetType": "Story",
  "Scope": "Scope:0",
  "Name": "Story Time",
  "Children": [
    {
      "AssetType": "Test",
      "Name": "Test Time"
    }
  ]
}
```

### Response

The response in this case shows you what the system will ultimately do if you send the same content to `api/asset` without the `?previewOnly=true` parameter. Note that you can also send the content that this request sent you to `api/asset` and it will execute through to completion. This is useful if you'd like to preview the results and modify some of the items by hand before submitting for processing.

```json
[
  {
    "@ffa2169f-bd6b-44d2-9cca-05c37a725dfd$auto-aliased": {
      "AssetType": "Story",
      "Scope": "Scope:0",
      "Name": "Story Time"
    }
  },
  {
    "@31e11be0-525c-4ee1-9002-4e6ee4453641$auto-aliased": {
      "AssetType": "Test",
      "Name": "Test Time",
      "#ContextOid": "@ffa2169f-bd6b-44d2-9cca-05c37a725dfd$auto-aliased"
    }
  }
]
```

## Reissue partially-failed requests

Sometimes a request has the potential to produce partial success and thus partial failure. In these cases, the system will return a response that indicates what succeeded and what failed. The failure messages are formatted in such a way that you can manually modify them, or construct automated processes that know how to respond appropriately.

### Request

Given a request like what follows where there is a misspelled OID token in one item but not the other:

```json
[
  {
    "AssetType": "Task",
    "Parent": "Story:1591",
    "Name": "Task Time"
  },
  {
    "AssetType": "Test",
    "Parent": "Stor:1591",
    "Name": "Test Time"
  }
]
```

### Response

Then we will get back a response indicating the success and the failure:

```json
{
  "assetsCreated": {
    "oidTokens": [
      "Task:1596"
    ],
    "count": 1
  },
  "assetsModified": {
    "oidTokens": [],
    "count": 0
  },
  "assetsOperatedOn": {
    "oidTokens": [],
    "count": 0
  },
  "commandFailures": {
    "commands": [
      {
        "@06b3bf9a-8906-4376-9bf6-672ced28b350$auto-aliased": {
          "AssetType": "Test",
          "Parent": "Stor:1591",
          "Name": "Test Time"
        },
        "error": {
          "message": "Resolution'Unresolved'Test.Parent'Workitem",
          "sourceCommandIndex": 1
        }
      }
    ],
    "count": 1
  },
  "queryResult": {
    "results": [],
    "count": -1
  }
}
```

Now, while we can modify our original content to remove the item that already succeeded and correct the misspelled OID token, we can also simply copy the content of the `commandFailures.commands` array in its entirety, including the system's auto-alias and even the `error` property ,and just correct the misspelled OID token and post it back to `api/asset`. This is helpful when the failures occur after a larger or more complicated request that would be more tedious to excise from the original payload.

### Request

```json
[
  {
    "@06b3bf9a-8906-4376-9bf6-672ced28b350$auto-aliased": {
      "AssetType": "Test",
      "Parent": "Story:1591",
      "Name": "Test Time"
    },
    "error": {
      "message": "Resolution'Unresolved'Test.Parent'Workitem",
      "sourceCommandIndex": 1
    }
  }
]
```

### Response

```json
{
  "assetsCreated": {
    "oidTokens": [
      "Test:1598"
    ],
    "count": 1
  },
  "assetsModified": {
    "oidTokens": [],
    "count": 0
  },
  "assetsOperatedOn": {
    "oidTokens": [],
    "count": 0
  },
  "commandFailures": {
    "commands": [],
    "count": 0
  },
  "queryResult": {
    "results": [],
    "count": -1
  }
}
```
## Issue single query

To use a more complex sample for a single query, lets think back to our create a hierarchy of assets example. This request produced a highest-level Epic with OID token `Epic:1589`, we can issue a query to return the created hierarchy of assets like this:

### Request

```json
{
  "from": "Epic:1589",
  "select": [
    "Name",
    {
      "from": "Subs",
      "select": [
        "Name",
        {
          "from": "Subs",
          "select": [
            "Name",
            {
              "from": "Children",
              "select": [
                "Name"
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### Response

```json
{
  "requestId": "a44dc9d9-1f9a-4678-93a9-c5c1be65226b",
  "createdDate": "2019-12-27T23:10:22.3540429Z",
  "completedDate": "2019-12-27T23:10:22.4425759Z",
  "duration": "00:00:00.0885330",
  "durationSeconds": 0.088533,
  "complete": true,
  "processing": false,
  "assetsCreated": {
    "oidTokens": [],
    "count": 0
  },
  "assetsModified": {
    "oidTokens": [],
    "count": 0
  },
  "assetsOperatedOn": {
    "oidTokens": [],
    "count": 0
  },
  "commandFailures": {
    "commands": [],
    "count": 0
  },
  "queryResult": {
    "results": [
      [
        {
          "_oid": "Epic:1589",
          "Name": "Epic with Subs",
          "Subs": [
            {
              "_oid": "Epic:1590",
              "Name": "Feature Epic",
              "Subs": [
                {
                  "_oid": "Story:1591",
                  "Name": "Feature Story 1",
                  "Children": [
                    {
                      "_oid": "Task:1596",
                      "Name": "Task Time"
                    },
                    {
                      "_oid": "Test:1598",
                      "Name": "Test Time"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    ],
    "count": 1
  }
}
```
In the above response, the `"count": 1` property refers to the fact that there is just one result set. It's not referring to the single top-level epic in the result set.

## Issue multiple queries

Suppose we wanted to send a request to query for Workitems that have at least one owner and also for Workitems specifically owned by the Administrator user. We can do that with two queries in the same request like this:

### Request

```json
[
  {
    "from": "Workitem",
    "filter": [
      "Owners.@Count>'0'"
    ],
    "select": [
      "Owners"
    ]
  },
  {
    "from": "Member:20",
    "select": [
      "Name",
      {
        "from": "OwnedWorkitems",
        "select": [
          "Name"
        ]
      }
    ]
  }
]
```

### Response

```json
{
  "assetsCreated": {
    "oidTokens": [],
    "count": 0
  },
  "assetsModified": {
    "oidTokens": [],
    "count": 0
  },
  "assetsOperatedOn": {
    "oidTokens": [],
    "count": 0
  },
  "commandFailures": {
    "commands": [],
    "count": 0
  },
  "queryResult": {
    "results": [
      [
        {
          "_oid": "Story:1214",
          "Owners": [
            {
              "_oid": "Member:20"
            },
            {
              "_oid": "Member:1215"
            }
          ]
        },
        {
          "_oid": "Story:1231",
          "Owners": [
            {
              "_oid": "Member:1229"
            },
            {
              "_oid": "Member:1230"
            }
          ]
        },
        {
          "_oid": "Story:1233",
          "Owners": [
            {
              "_oid": "Member:20"
            }
          ]
        },
        {
          "_oid": "Story:1235",
          "Owners": [
            {
              "_oid": "Member:20"
            }
          ]
        },
        {
          "_oid": "Task:1489",
          "Owners": [
            {
              "_oid": "Member:1575"
            }
          ]
        }
      ],
      [
        {
          "_oid": "Member:20",
          "Name": "Administrator",
          "OwnedWorkitems": [
            {
              "_oid": "Story:1214",
              "Name": "I need an Owner!"
            },
            {
              "_oid": "Story:1233",
              "Name": "I need an Owner!"
            },
            {
              "_oid": "Story:1235",
              "Name": "I need an Owner!"
            }
          ]
        }
      ]
    ],
    "count": 2
  }
}
```

We see in this response that a number of the items from the first result set have nothing to do with `Member:20`, the Administrator, but that all of the items contained in the second result set also appear in the first result set. And, the `"count": 2` property tells us that the response contains two result sets. This is helpful since sometimes a query can return an empty set, but it's useful to know that the system did attempt to make the query.

# Advanced capabilities and aliases

Whenever we issue a request to the Bulk API endpoint at `api/asset`, the server fulfills our request in two phases. The first phase is projection and the second phase is processing. The result of the projection phase is a mapping of keys and values where the keys are aliases and the values are the specific commands resulting from our request.

## Stopping requests after the projection phase to view the projection result

We can stop the request handling just short of the processing phase by supplying the `?previewOnly=true` query string parameter. That is, we will post requests to `http://localhost/VersionOne.Web/api/asset?previewOnly=true` instead of just to `http://localhost/VersionOne.Web/api/asset`.

## Simple example of auto-aliasing

Given that we send the following request to the API to create a single new Story:

```json
{
  "AssetType": "Story",
  "Scope": "Scope:0",
  "Name": "My Story"
}
```
Then the projection phase generates a result like this:

```json
[
  {
    "@e630d6f8-5b95-44b7-8d30-3632549a0121$auto-aliased": {
      "AssetType": "Story",
      "Scope": "Scope:0",
      "Name": "My Story"
    }
  }
]
```
### Observations

* The single JSON object input is transformed into a one-item JSON array whose item is a wrapper object with a single property that points to an object containing the original properties and values that our request contained.
* The property name in the wrapper object is a guid suffixed by `$auto-aliased`. This suffix tells the system that we did not supply our own alias, but rather that the system did the job for us.
* If you were to copy the projection phase result's content and send that in a new request to `/api/asset`, it would work exactly as if you had posted your original content to `/api/asset` without the `?previewOnly=true` parameter. That is, due to the fact that you would then be sending user-aliased content, the system will essentially forward each item from your request unchanged through to the processing phase. This can be useful if you'd like to project a large number of updates or operation invocations with a query specification, but have the luxury of inspecting each one manually with the ability to remove some changes before sending the finite list back to the server for processing.

## Simple example of user-aliasing to get back a Story number

As we just saw, the system will auto-alias the commands within our request if we do not supply a user-alias. So, how do we supply a user-alias, and, more importantly, why would we want to?

Suppose we want to generate the same Story as before, but we want to know not just the OID Token of the newly created Story, but also the system-generated Story number. We can format our request like this to supply a user-supplied alias:

```json
{
  "@story": {
    "AssetType": "Story",
    "Scope": "Scope:0",
    "Name": "My Story"
  }
}
```
The projection phase will generate a result like this:

```json
[
  {
    "@story": {
      "AssetType": "Story",
      "Scope": "Scope:0",
      "Name": "My Story"
    }
  }
]
```
This time, the alias is the exact same value that we sent the system, rather than a guid with the special `$auto-aliased` suffix.

Of course, that doesn't quite get us as far as we want to have the system return the Story number for us. We need to also specify a query within our request, like this:

```json
[
 {
  "@story": {
    "AssetType": "Story",
    "Scope": "Scope:0",
    "Name": "My Story"
  }
 },
 {
  "from": "@story",
  "select": 
  [
   "Number"
  ]
 }
]
```

The projection phase will generate a result like this:

```json
[
  {
    "@story": {
      "AssetType": "Story",
      "Scope": "Scope:0",
      "Name": "My Story"
    }
  },
  {
    "@3f30e52f-6276-4b24-8fbd-eb7ceb8461b1": {
      "from": "@story",
      "select": [
        "Number"
      ]
    }
  }
]
```

And, the processing phase will ultimately produce a response payload like this:

```json
{
  "assetsCreated": {
    "oidTokens": [
      "Story:1466"
    ],
    "count": 1
  },
  "assetsModified": {
    "oidTokens": [],
    "count": 0
  },
  "assetsOperatedOn": {
    "oidTokens": [],
    "count": 0
  },
  "commandFailures": {
    "commands": [],
    "count": 0
  },
  "queryResult": {
    "results": [
      [
        {
          "_oid": "Story:1466",
          "Number": "S-01134"
        }
      ]
    ],
    "count": 1
  }
}
```

### Observations
* The array contains two objects now, both of which still contain one property pointing to the original object from our request.
* This time, the projection has both our user-supplied alias, `@story`, and one auto-aliased command, the query. 
* The reason that the auto-alias lacks the `$auto-aliased` suffix is that the suffix is only necessary in the case of auto-aliased asset create commands.
* The response `queryResult` property contains a single result-set, since we included a single query in our request, which properly includes the `Number` attribute from the newly created Story asset.

## Request hierarchy flattening 

So far, we've seen how the system processes API requests in two phases: projection, and processing. And, we've seen how the system will auto-alias the commands and queries within our requests, but also how it will honor user-supplied aliases that we specify within our requests.

But, we've only seen how this applies to flat requests. Let's look at a how the system transforms requests with hierarchical asset creation commands into a flat list of auto-aliased commands.

Given this request to create a Story with two hierarchically specified Task children:

```json
{
  "AssetType": "Story",
  "Scope": "Scope:0",
  "Name": "My Story with Children",
  "Children": [
    {
      "AssetType": "Task",
      "Name": "Task 1"
    },
    {
      "AssetType": "Task",
      "Name": "Test 2"
    }
  ]
}
```

The projection phase creates a flattened list like this:

```json
[
  {
    "@0f4bcf21-0f0f-4668-a7ee-a4db84f593bb$auto-aliased": {
      "AssetType": "Story",
      "Scope": "Scope:0",
      "Name": "My Story with Children"
    }
  },
  {
    "@17afb273-11ae-4942-bf46-6fd14eda3472$auto-aliased": {
      "AssetType": "Task",
      "Name": "Task 1 (already done!)",
      "#ContextOid": "@0f4bcf21-0f0f-4668-a7ee-a4db84f593bb$auto-aliased"
    }
  },
  {
    "@9d182825-e5d4-4bbc-99d4-591e8133e087$auto-aliased": {
      "AssetType": "Task",
      "Name": "Test 2 (still todo)",
      "#ContextOid": "@0f4bcf21-0f0f-4668-a7ee-a4db84f593bb$auto-aliased"
    }
  }
]
```

And, the processing phase produces a response payload like this:

```json
{
  "assetsCreated": {
    "oidTokens": [
      "Story:1467",
      "Task:1468",
      "Task:1469"
    ],
    "count": 3
  },
  "assetsModified": {
    "oidTokens": [],
    "count": 0
  },
  "assetsOperatedOn": {
    "oidTokens": [],
    "count": 0
  },
  "commandFailures": {
    "commands": [],
    "count": 0
  },
  "queryResult": {
    "results": [],
    "count": -1
  }
}
```

### Observations
* The auto-aliased Story command looks similar to what we've seen before.
* The two auto-aliased commands for the Task assets have been taken out of the hierarchy and appear in the same order that we originally specified following the Story's command.
* Each of the Task commands has a special system-generated `#ContextOid` property which points to the alias of the containing asset. Thus, since the Story's command alias is `@0f4bcf21-0f0f-4668-a7ee-a4db84f593bb$auto-aliased`, the `#ContextOid` for both of the Task commands is also `@0f4bcf21-0f0f-4668-a7ee-a4db84f593bb$auto-aliased`. 
 * During the processing phase, the system replaces the alias with the newly generated OID Token for the containing Asset, and uses that as the Context within which the contained asset will be created.
* The response contains the OID Tokens of the three newly created assets in the order that we specified them.

## Hierarchical user-aliases

Now that we've seen what happens with auto-aliasing for hierarchical asset creation commands, let's look at how we can supply user-aliases within hierarchies and how we can query for the Task Number of the newly created Tasks.

Given a request like this:

```json
{
  "AssetType": "Story",
  "Scope": "Scope:0",
  "Name": "My Story with Children",
  "Children": [
    {
      "@task1": {
        "AssetType": "Task",
        "Name": "Task 1"
      }
    },
    {
      "@task2": {
        "AssetType": "Task",
        "Name": "Test 2"
      }
    }
  ]
}
```

The projection phase produces a result like this:

```json
[
  {
    "@8f49972e-e9ce-4465-8d6e-4dc91671d0fb$auto-aliased": {
      "AssetType": "Story",
      "Scope": "Scope:0",
      "Name": "My Story with Children"
    }
  },
  {
    "@task1": {
      "AssetType": "Task",
      "Name": "Task 1",
      "#ContextOid": "@8f49972e-e9ce-4465-8d6e-4dc91671d0fb$auto-aliased"
    }
  },
  {
    "@task2": {
      "AssetType": "Task",
      "Name": "Test 2",
      "#ContextOid": "@8f49972e-e9ce-4465-8d6e-4dc91671d0fb$auto-aliased"
    }
  }
]
``` 
### Observations
* The Story's command is auto-aliased as previous examples.
* The Task commands use our user-supplied aliases, but still correctly specify the auto-alias of the Story for the `#ContextOid` property.

We can modify the request to select the Task Numbers like this:

```json
[
  {
    "AssetType": "Story",
    "Scope": "Scope:0",
    "Name": "My Story with Children",
    "Children": [
      {
        "@task1": {
          "AssetType": "Task",
          "Name": "Task 1"
        }
      },
      {
        "@task2": {
          "AssetType": "Task",
          "Name": "Test 2"
        }
      }
    ]
  },
  {
    "from": "@task1",
    "select": [
      "Number"
    ]
  },
  {
    "from": "@task2",
    "select": [
      "Number"
    ]
  }
]
```

This produces a response like so:

```json
{
  "assetsCreated": {
    "oidTokens": [
      "Story:1482",
      "Task:1483",
      "Task:1484"
    ],
    "count": 3
  },
  "assetsModified": {
    "oidTokens": [],
    "count": 0
  },
  "assetsOperatedOn": {
    "oidTokens": [],
    "count": 0
  },
  "commandFailures": {
    "commands": [],
    "count": 0
  },
  "queryResult": {
    "results": [
      [
        {
          "_oid": "Task:1483",
          "Number": "TK-01020"
        }
      ],
      [
        {
          "_oid": "Task:1484",
          "Number": "TK-01021"
        }
      ]
    ],
    "count": 2
  }
}
```

Note, however, you can achieve the same result in a simpler way if you supply a user-alias for only the Story rather than both of the Tasks:

```json
[
  {
    "@story": {
      "AssetType": "Story",
      "Scope": "Scope:0",
      "Name": "My Story with Children",
      "Children": [
        {
          "AssetType": "Task",
          "Name": "Task 1"
        },
        {
          "AssetType": "Task",
          "Name": "Test 2"
        }
      ]
    }
  },
  {
    "from": "@story",
    "select": [
      {
        "from": "Children:Task",
        "select": [
          "Number"
        ]
      }
    ]
  }
]
```

This produces a response like so:

```json
{
  "assetsCreated": {
    "oidTokens": [
      "Story:1488",
      "Task:1489",
      "Task:1490"
    ],
    "count": 3
  },
  "assetsModified": {
    "oidTokens": [],
    "count": 0
  },
  "assetsOperatedOn": {
    "oidTokens": [],
    "count": 0
  },
  "commandFailures": {
    "commands": [],
    "count": 0
  },
  "queryResult": {
    "results": [
      [
        {
          "_oid": "Story:1488",
          "Children:Task": [
            {
              "_oid": "Task:1489",
              "Number": "TK-01024"
            },
            {
              "_oid": "Task:1490",
              "Number": "TK-01025"
            }
          ]
        }
      ]
    ],
    "count": 1
  }
}
```

## Update command projections on scalar or single-value relation attributes

So far, we've only examined projection and processing for asset creation commands. Let's examine the projection phase result of an update command now:

Given we have send a request to update the Description attribute of the two Task assets we just created to indicate that we still have to fill them out in detail after speaking with Andre Agile:

```json
{
  "from": "Task",
  "where": {
    "Parent": "Story:1488"
  },
  "update": {
    "Description": "TODO -- get details from Andre Agile"
  }
}
```

Then the projection phase produces a result like this:

```json
[
  {
    "@293837a5-26a1-4311-947d-f70cb500fe62": {
      "oid": "Task:1489",
      "update": {
        "Description": {
          "add": [
            "TODO -- get details from Andre Agile"
          ],
          "remove": []
        }
      }
    }
  },
  {
    "@7c75e089-d8bf-4892-8c07-1d647d3cca44": {
      "oid": "Task:1490",
      "update": {
        "Description": {
          "add": [
            "TODO -- get details from Andre Agile"
          ],
          "remove": []
        }
      }
    }
  }
]
```

And the processing phase produces a response like this:

```json
{
  "assetsCreated": {
    "oidTokens": [],
    "count": 0
  },
  "assetsModified": {
    "oidTokens": [
      "Task:1489",
      "Task:1490"
    ],
    "count": 2
  },
  "assetsOperatedOn": {
    "oidTokens": [],
    "count": 0
  },
  "commandFailures": {
    "commands": [],
    "count": 0
  },
  "queryResult": {
    "results": [],
    "count": -1
  }
}
```
### Observations

* The format of the projection phase result may seem odd, given that we know the Description attribute is a scalar. This syntax represents the simplest way for the system to tell itself that **some change** must be made to a target attribute. During the processing phase, the system determines whether it's really targeting a single-value-relation, multi-value-relation, or just a scalar, and applies the `In Progress` value appropriately as needed.
* The result would be identical if we target a single-value relation. For example if we were to update the Status to `In Progress`, using the monickered string value rather than an OID Token, the result would look like this: 
```json
[
  {
    "@293837a5-26a1-4311-947d-f70cb500fe62": {
      "oid": "Task:1489",
      "update": {
        "Status": {
          "add": [
            "In Progress"
          ],
          "remove": []
        }
      }
    }
  },
  {
    "@7c75e089-d8bf-4892-8c07-1d647d3cca44": {
      "oid": "Task:1490",
      "update": {
        "Status": {
          "add": [
            "In Progress"
          ],
          "remove": []
        }
      }
    }
  }
]
``` 
* Supposing we wanted to update just one of the Task assets, but change both the Status and Description attributes, then our request and projection result would look like this:
 
   **Request**

   ```json
   {
     "from": "Task:1489",
     "update": {
       "Description": "TODO -- get details from Andre Agile",
       "Status": "In Progress"
     }
   }
   ```
   **Projection result**
   
   ```json
   [
     {
      "@526e8128-41be-44ef-8401-bb3bd19b03ef": {
        "oid": "Task:1489",
        "update": {
         "Description": {
           "add": [
            "TODO -- get details from Andre Agile"
           ],
           "remove": []
         },
         "Status": {
           "add": [
            "In Progress"
           ],
           "remove": []
         }
        }
      }
     }
   ]
   ```
## Update command projections on multi-value relations

When it comes to updating multi-value relations, there are several syntax alternatives that make it convenient. Each of them result in similar projection phase results, wherein the `add` and `remove` array properties take on their ultimate purpose.

If we wanted modify `Task:1489` from previous examples to have a single owner, then the projection result would look much like we've already seen, and we can use a variety of syntax alternatives to make it convenient. Each of the following produces the same projection result and processing response:

### Implicit single-add with scalar

```json
{
  "from": "Task:1489",
  "update": {
    "Owners": "Member:20"
  }
}
```
### Implicit single-add with array

```json
{
  "from": "Task:1489",
  "update": {
    "Owners": [
      "Member:20"
    ]
  }
}
```
### Explicit single-add with object scalar

```json
{
  "from": "Task:1489",
  "update": {
    "Owners": {
      "add": "Member:20"
    }
  }
}
```

### Explicit single-add with object array

```json
{
  "from": "Task:1489",
  "update": {
    "Owners": {
      "add": [
        "Member:20"
      ]
    }
  }
}
```

### Explicit single-add with object keys:

```json
{
  "from": "Task:1489",
  "update": {
    "Owners": {
      "Member:20": "add"
    }
  }
}
```

Each of the above produces a projection result like this:

```json
[
  {
    "@bd9598ad-66af-4cec-b03e-bf273d91bfb5": {
      "oid": "Task:1489",
      "update": {
        "Owners": {
          "add": [
            "Member:20"
          ],
          "remove": []
        }
      }
    }
  }
]
```

If we want to add multiple members in a single request, variations on a subset of the above will work for us:

### Implicit multi-add with array

```json
{
  "from": "Task:1489",
  "update": {
    "Owners": [
      "Member:20",
      "Member:1575"
    ]
  }
}
```
### Explicit multi-add with object array:

```json
{
  "from": "Task:1489",
  "update": {
    "Owners": {
      "add": [
        "Member:20",
        "Member:1575"
      ]
    }
  }
}
```

### Explicit multi-add with object keys:

```json
{
  "from": "Task:1489",
  "update": {
    "Owners": {
      "Member:20": "add",
      "Member:1575": "add"
    }
  }
}
```

Each of the above produces a projection result like this:

```json
[
  {
    "@b7790693-b722-4675-b9c5-b9b6c45a52c3": {
      "oid": "Task:1489",
      "update": {
        "Owners": {
          "add": [
            "Member:20",
            "Member:15475"
          ],
          "remove": []
        }
      }
    }
  }
]
```

Now, let's say our Task asset already has the Administrator and Andre Agile as owners, and we want to remove Administrator. We can issue a request using a variety of approaches like above, substituting the action `remove` instead of `add`. Here's the simplest way:

## Explicit single-remove with object scalar

```json
{
  "from": "Task:1489",
  "update": {
    "Owners": {
      "remove": "Member:20"
    }
  }
}
```

We can also, naturally, issue a request that has both add and remove actions with a variety of syntax alternatives. Here are two of the most useful and easiest approaches:

## Explicit add and remove with object scalar

```json
{
  "from": "Task:1489",
  "update": {
    "Owners": {
      "remove": "Member:20",
      "add": "Member:1575"
    }
  }
}
```

### Explicit add and remove with object keys:

```json
{
  "from": "Task:1489",
  "update": {
    "Owners": {
      "Member:20": "remove",
      "Member:1575": "add"
    }
  }
}
```

Each of the above produces a projection result like this:

```json
[
  {
    "@ca414bbc-8dc5-41ef-9626-244b80145059": {
      "oid": "Task:1489",
      "update": {
        "Owners": {
          "add": [
            "Member:1575"
          ],
          "remove": [
            "Member:20"
          ]
        }
      }
    }
  }
]
```

## Using find and replace to swap one multi-value relation reference with another

Additionally, let's suppose we want to do a more broad change wherein we replace all instances of `Member:20` with `Member:1575` across a number of candidate assets. We can use the `find` and `replace` syntax to accomplish this in a way that ensures we only replace one with the other, but do not assign `Member:1575` where there is not a pre-existing assignment of `Member:20`. Here's how:

```json
{
  "from": "Task",
  "where": {
    "Parent": "Story:1488"
  },
  "update": {
    "Owners": {
      "find": "Member:20",
      "replace": "Member:1575"
    }
  }
}
```

This produces a projection result like this:

```json
[
  {
    "@33e9c481-29c7-4639-bb92-739be91f3da7": {
      "oid": "Task:1489",
      "update": {
        "Owners": {
          "find": "Member:20",
          "replace": "Member:1575"
        }
      }
    }
  },
  {
    "@e3991edc-106e-4d5a-947d-e0421e250faa": {
      "oid": "Task:1490",
      "update": {
        "Owners": {
          "find": "Member:20",
          "replace": "Member:1575"
        }
      }
    }
  }
]
```
In the above case, given that `Task:1490` does not have `Member:20` assigned, the result will be that only `Task:1489` now has `Member:1575` in its Owners attribute while the other one remains ownerless.

## Deferring execute operation projections until the processing phase

If you'd like to have the system wait until the actually processing phase to project the target assets to update, you can do this by wrapping your execute operation command inside of a user-alias. This is helpful when, for example you need to create a new asset and also invoke an operation on it within a single request. Note that you could also invoke an update upon it using an alias to create a deferral, though that might be less useful than invoking an operation.

Given we want to create a new Story that has a couple of Tests, one of which is already completed from the user's perspective, then we can issue a request like this:

```json
[
  {
    "@story": {
      "AssetType": "Story",
      "Scope": "Scope:0",
      "Name": "Story Test",
      "Children": [
        {
          "@test1": {
            "AssetType": "Test",
            "Name": "My Test 1 (checked off immediately)"
          }
        },
        {
          "AssetType": "Test",
          "Name": "My Test 2 (still undone)"
        }
      ]
    }
  },
  {
    "@inactivate": {
      "from": "@test1",
      "execute": "Inactivate"
    }
  },
  {
    "from": "Test",
    "where": {
      "Parent": "@story"
    },
    "select": [
      "Name",
      "AssetState"
    ]
  }
]
```

This produces a projection phase result like this:

```json
[
  {
    "@story": {
      "AssetType": "Story",
      "Scope": "Scope:0",
      "Name": "Story Test",
      "Children": [
        {
          "@test1": {
            "AssetType": "Test",
            "Name": "My Test 1 (checked off immediately)"
          }
        },
        {
          "AssetType": "Test",
          "Name": "My Test 2 (still undone)"
        }
      ]
    }
  },
  {
    "@inactivate": {
      "from": "@test1",
      "execute": "Inactivate"
    }
  },
  {
    "@147491a4-ce7f-4f1b-b238-626d6858d25b": {
      "from": "Test",
      "where": {
        "Parent": "@story"
      },
      "select": [
        "Name",
        "AssetState"
      ]
    }
  }
]
```

And a processing phase response like this:

```json
{
  "assetsCreated": {
    "oidTokens": [
      "Story:1582",
      "Test:1583",
      "Test:1584"
    ],
    "count": 3
  },
  "assetsModified": {
    "oidTokens": [],
    "count": 0
  },
  "assetsOperatedOn": {
    "oidTokens": [
      "Test:1583"
    ],
    "count": 1
  },
  "commandFailures": {
    "commands": [],
    "count": 0
  },
  "queryResult": {
    "results": [
      [
        {
          "_oid": "Test:1583",
          "Name": "My Test 1 (checked off immediately)",
          "AssetState": "Closed"
        },
        {
          "_oid": "Test:1584",
          "Name": "My Test 2 (still undone)",
          "AssetState": "Active"
        }
      ]
    ],
    "count": 1
  }
}
```

### Observations
* Notice how the Story asset, since it is user aliased, does not immediately result in a flattened projection phase result. That is because we are forcing the system to defer the projection until as late as possible. Thus, although we only supplied one nested user-alias, to identify `@tests1` for later reference, the second one remains within the hierarchy because the containing Story asset is itself user-aliased.
* The only auto-aliased part of the projection result is the query. The actual processing phase response would look no different if we had supplied our own alias for the query, but that is not necessary.

## Deferring update command projections

While it's not as realistic of a scenario to need to do this, it's still possible using a user-alias in exactly the same way as shown above. To see an example of this, [check out this automated test](../tests/update_deferrals_can_reference_user_aliases.ts).

## Query projections

When you supply a query in a request, the query will always take place after all previous commands and thus will not require deferral. You can see why a user-supplied alias provides no advantage over an auto-aliased query by looking at the `?previewOnly=true` result of the following request which contains the same query twice, one unaliased, one with a user-alias:

```json
[
  {
    "@story": {
      "AssetType": "Story",
      "Scope": "Scope:0",
      "Name": "My Story"
    }
  },
  {
    "from": "@story",
    "select": [
      "Name",
      "Number"
    ]
  },
  {
    "@query": {
      "from": "@story",
      "select": [
        "Name",
        "Number"
      ]
    }
  }
]
```

This produces a projection phase result like this:

```json
[
  {
    "@story": {
      "AssetType": "Story",
      "Scope": "Scope:0",
      "Name": "My Story"
    }
  },
  {
    "@acca160a-05b0-46f5-9035-4b6b26ddde7e": {
      "from": "@story",
      "select": [
        "Name",
        "Number"
      ]
    }
  },
  {
    "@query": {
      "from": "@story",
      "select": [
        "Name",
        "Number"
      ]
    }
  }
]
```

And a processing phase response like this:

```json
{
  "assetsCreated": {
    "oidTokens": [
      "Story:2842"
    ],
    "count": 1
  },
  "assetsModified": {
    "oidTokens": [],
    "count": 0
  },
  "assetsOperatedOn": {
    "oidTokens": [],
    "count": 0
  },
  "commandFailures": {
    "commands": [],
    "count": 0
  },
  "queryResult": {
    "results": [
      [
        {
          "_oid": "Story:2842",
          "Name": "My Story",
          "Number": "S-01663"
        }
      ],
      [
        {
          "_oid": "Story:2842",
          "Name": "My Story",
          "Number": "S-01663"
        }
      ]
    ],
    "count": 2
  }
}
```

Therefore, remember that you don't need to be overzealous about wrapping queries within user-aliases.

# Complex aliases

In the previous section, we learned about the basics of both simple auto-aliases and user-aliases. Let's walk through a more complex scenario that builds upon the basics.

## Create a Test Set with Tests from an existing Regression Suite with Regression Tests

Suppose you have the task of automating the creation of new Test Sets and their related Tests when doing system regression testing. In this situation, you must string together several commands to make the API do what you want.

Given we have an existing Scope with OID Token `Scope:1503` and a Regression Suite with OID Token `RegressionSuite:1505` which already has assigned Regression Tests assigned to it, we can issue the following command to produce a new Test Set, generated Tests from the Regression Tests, and select back the newly created Tests along with a reference to their Regression Test source:

```json
[
  {
    "@test-set": {
      "AssetType": "TestSet",
      "Name": "Tests",
      "Scope": "Scope:1503",
      "RegressionSuite": "RegressionSuite:1505"
    }
  },
  {
    "@copy": {
      "from": "@test-set",
      "execute": "CopyAcceptanceTestsFromRegressionSuite"
    }
  },
  {
    "from": "@test-set",
    "select": [
      "Name",
      {
        "from": "Children:Test",
        "select": [
          "Name",
          "GeneratedFrom",
          "Status"
        ]
      }
    ]
  }
]
```
This produces a projection phase result like so:

```json
[
  {
    "@test-set": {
      "AssetType": "TestSet",
      "Name": "Tests",
      "Scope": "Scope:1503",
      "RegressionSuite": "RegressionSuite:1505"
    }
  },
  {
    "@copy": {
      "from": "@test-set",
      "execute": "CopyAcceptanceTestsFromRegressionSuite"
    }
  },
  {
    "@b9fa8add-8d1d-4cca-8289-b0de710af2f3": {
      "from": "@test-set",
      "select": [
        "Name",
        {
          "from": "Children:Test",
          "select": [
            "Name",
            "GeneratedFrom",
            "Status"
          ]
        }
      ]
    }
  }
]
```

And, a processing phase response like so:

```json
{
  "assetsCreated": {
    "oidTokens": [
      "TestSet:1511"
    ],
    "count": 1
  },
  "assetsModified": {
    "oidTokens": [],
    "count": 0
  },
  "assetsOperatedOn": {
    "oidTokens": [
      "TestSet:1511"
    ],
    "count": 1
  },
  "commandFailures": {
    "commands": [],
    "count": 0
  },
  "queryResult": {
    "results": [
      [
        {
          "_oid": "TestSet:1511",
          "Name": "Tests",
          "Children:Test": [
            {
              "_oid": "Test:1512",
              "Name": "Regression Test 1",
              "GeneratedFrom": {
                "_oid": "RegressionTest:1506"
              },
              "Status": {
                "_oid": "NULL"
              }
            },
            {
              "_oid": "Test:1513",
              "Name": "Regression Test 2",
              "GeneratedFrom": {
                "_oid": "RegressionTest:1507"
              },
              "Status": {
                "_oid": "NULL"
              }
            }
          ]
        }
      ]
    ],
    "count": 1
  }
}
```

### Observations
* The command aliased with `@copy` is a deferred invocation. By aliasing it ourselves, we instruct the system not to delay the the projection phase for this particular command until the processing phase. The reason for this is that since the user-alias `@test-set` does not exist at the time we send our request, we must wait until it `@test-set` has itself been through the processing phase.
* The OID Token `TestSet:1511` for the TestSet asset appears in both the `assetsCreated` and `assetsOperatedOn` response properties because we both created the new TestSet and invoked the `CopyAcceptanceTestsFromRegressionSuite` operation on it within our request.
* We didn't have to supply a user-alias for the query because queries are already deferred until the processing phase anyway, since there is nothing for the system to create, update, or invoke in a query.

## Combining everything into one request

We can actually go a few steps further than the previous example by creating brand new Scope, RegressionPlan, RegressionSuite, and RegressionTest assets just before generating our new TestSet and Tests. This example is most practical in the cases of system-to-system synchronization or advanced automation.

Given a request like this:

```json
[
  {
    "@scope": {
      "AssetType": "Scope",
      "Name": "Scope for Regression Test",
      "Parent": "Scope:0",
      "BeginDate": "12/31/2019"
    }
  },
  {
    "@plan": {
      "AssetType": "RegressionPlan",
      "Name": "Plan",
      "Scope": "@scope"
    }
  },
  {
    "@suite": {
      "AssetType": "RegressionSuite",
      "RegressionPlan": "@plan",
      "Name": "Regression Suite"
    }
  },
  {
    "AssetType": "RegressionTest",
    "Name": "Regression Test 1",
    "Scope": "@scope",
    "RegressionSuites": "@suite"
  },
  {
    "AssetType": "RegressionTest",
    "Name": "Regression Test 2",
    "Scope": "@scope",
    "RegressionSuites": "@suite"
  },
  {
    "@test-set": {
      "AssetType": "TestSet",
      "Name": "New TestSet",
      "Scope": "@scope",
      "RegressionSuite": "@suite"
    }
  },
  {
    "@copy": {
      "from": "@test-set",
      "execute": "CopyAcceptanceTestsFromRegressionSuite"
    }
  },
  {
    "from": "@test-set",
    "select": [
      "Name",
      {
        "from": "Children:Test",
        "select": [
          "Name",
          "GeneratedFrom",
          "Status"
        ]
      }
    ]
  }
]
```
Then the projection phase will generate a result like this:

```json
[
  {
    "@scope": {
      "AssetType": "Scope",
      "Name": "Scope for Regression Test",
      "Parent": "Scope:0",
      "BeginDate": "12/31/2019"
    }
  },
  {
    "@plan": {
      "AssetType": "RegressionPlan",
      "Name": "Plan",
      "Scope": "@scope"
    }
  },
  {
    "@suite": {
      "AssetType": "RegressionSuite",
      "RegressionPlan": "@plan",
      "Name": "Regression Suite"
    }
  },
  {
    "@1e292cd2-9fa5-4f7a-9a93-480dcd4fb340$auto-aliased": {
      "AssetType": "RegressionTest",
      "Name": "Regression Test 1",
      "Scope": "@scope",
      "RegressionSuites": "@suite"
    }
  },
  {
    "@f0e94425-08e2-46b6-979f-0b40dea8280c$auto-aliased": {
      "AssetType": "RegressionTest",
      "Name": "Regression Test 2",
      "Scope": "@scope",
      "RegressionSuites": "@suite"
    }
  },
  {
    "@test-set": {
      "AssetType": "TestSet",
      "Name": "New TestSet",
      "Scope": "@scope",
      "RegressionSuite": "@suite"
    }
  },
  {
    "@copy": {
      "from": "@test-set",
      "execute": "CopyAcceptanceTestsFromRegressionSuite"
    }
  },
  {
    "@ad0c1c97-30dc-4e16-a061-2c0ef2ef006f": {
      "from": "@test-set",
      "select": [
        "Name",
        {
          "from": "Children:Test",
          "select": [
            "Name",
            "GeneratedFrom",
            "Status"
          ]
        }
      ]
    }
  }
]
```

And the processing phase will produce a response like:

```json
{
  "assetsCreated": {
    "oidTokens": [
      "Scope:1533",
      "RegressionPlan:1534",
      "RegressionSuite:1535",
      "RegressionTest:1536",
      "RegressionTest:1537",
      "TestSet:1538"
    ],
    "count": 6
  },
  "assetsModified": {
    "oidTokens": [],
    "count": 0
  },
  "assetsOperatedOn": {
    "oidTokens": [
      "TestSet:1538"
    ],
    "count": 1
  },
  "commandFailures": {
    "commands": [],
    "count": 0
  },
  "queryResult": {
    "results": [
      [
        {
          "_oid": "TestSet:1538",
          "Name": "New TestSet",
          "Children:Test": [
            {
              "_oid": "Test:1539",
              "Name": "Regression Test 1",
              "GeneratedFrom": {
                "_oid": "RegressionTest:1536"
              },
              "Status": {
                "_oid": "NULL"
              }
            },
            {
              "_oid": "Test:1540",
              "Name": "Regression Test 2",
              "GeneratedFrom": {
                "_oid": "RegressionTest:1537"
              },
              "Status": {
                "_oid": "NULL"
              }
            }
          ]
        }
      ]
    ],
    "count": 1
  }
}
```
### Observations
* There are no new concepts in this example. Instead, it's just a longer example that uses all the concepts we've already examined.
* The OID Token `TestSet:1511` for the TestSet asset appears in both the `assetsCreated` and `assetsOperatedOn` response properties because we both created the new TestSet and invoked the `CopyAcceptanceTestsFromRegressionSuite` operation on it within our request.
* We didn't have to supply a user-alias for the query because queries are already deferred until the processing phase anyway, since there is nothing for the system to create, update, or invoke in a query.
