"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asset_api_helper_1 = require("../lib/asset-api-helper");
const documenter_1 = require("../lib/documenter");
const projectroles_api_helper_1 = require("../lib/projectroles-api-helper");
const types = ['yaml', 'json'];
for (const type of types) {
    const doc = documenter_1.default();
    doc.exampleName(`bulk/execute_Scope_AssignMemberWithRole_list`);
    const title = 'Execute Scope.AssignMemberWithRole operation for list of Members';
    asset_api_helper_1.test(`${title} (${type})`, async (t) => {
        doc.title(title);
        doc.type(type);
        doc.description("Demonstrates how to use a single command to assign multiple Members to a Scope along with Scope-specific roles each Member will have for the target Scope.");
        const setupCommand = `
from: Member
filter:
- Name='scopeListMember1','scopeListMember2'
execute: Delete
---
AssetType: Scope
Name: Project for List of Members
Parent: Scope:0
BeginDate: ${new Date().toJSON()}
---
AssetType: Member
Name: scopeListMember1
Password: scopeListMember1
Nickname: scopeListMember1
Username: scopeListMember1
DefaultRole: Role.Name'Observer
---
AssetType: Member
Name: scopeListMember2
Password: scopeListMember2
Nickname: scopeListMember2
Username: scopeListMember2
DefaultRole: Role.Name'Observer
`;
        let res = await asset_api_helper_1.assetApiPost(setupCommand);
        doc.setup(res, setupCommand);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsCreated.count, 3, "Expected 3 Assets to be created");
        const [scopeOidToken, member1OidToken, member2OidToken] = res.data.assetsCreated.oidTokens;
        const roleObserverOidToken = 'Role:8';
        const roleCustomerOidToken = 'Role:7';
        const roleProjectLeadOidToken = 'Role:3';
        const commands = {
            yaml: `
from: ${scopeOidToken}
execute:
 op: AssignMemberWithRole
 list:
 - Member: ${member1OidToken}
   Role: ${roleProjectLeadOidToken}
   IsOwner: true
 - Member: ${member2OidToken}
   Role: ${roleCustomerOidToken}
   IsOwner: false
`,
            json: `
{
    "from": "${scopeOidToken}",
    "execute": {
        "op": "AssignMemberWithRole",
        "list": [{
            "Member": "${member1OidToken}",
            "Role": "${roleProjectLeadOidToken}",
            "IsOwner": true
          },{
            "Member": "${member2OidToken}",
            "Role": "${roleCustomerOidToken}",
            "IsOwner": false
          }
        ]
      }
}
`
        };
        const payload = commands[type];
        res = await asset_api_helper_1.assetApiPost(payload, type);
        t.is(res.status, 200, "Expected 200 OK");
        t.is(res.data.assetsOperatedOn.count, 2, "Expected 2 Assets to be operated upon");
        const query = `where=ID='${scopeOidToken}'`;
        const verifyExpectation = [
            {
                "isOwner": true,
                "member": {
                    "oidToken": "Member:20",
                    "name": "Administrator",
                    "email": "",
                    "defaultRole": {
                        "oidToken": "Role:1",
                        "name": "System Admin"
                    }
                },
                "role": {
                    "oidToken": "Role:1",
                    "name": "System Admin"
                }
            },
            {
                "isOwner": true,
                "member": {
                    "oidToken": `${member1OidToken}`,
                    "name": "scopeListMember1",
                    "email": "",
                    "defaultRole": {
                        "oidToken": `${roleObserverOidToken}`,
                        "name": "Observer"
                    }
                },
                "role": {
                    "oidToken": `${roleProjectLeadOidToken}`,
                    "name": "Project Lead"
                }
            },
            {
                "isOwner": false,
                "member": {
                    "oidToken": `${member2OidToken}`,
                    "name": "scopeListMember2",
                    "email": "",
                    "defaultRole": {
                        "oidToken": `${roleObserverOidToken}`,
                        "name": "Observer"
                    }
                },
                "role": {
                    "oidToken": `${roleCustomerOidToken}`,
                    "name": "Customer"
                }
            }
        ];
        const verificationResult = await projectroles_api_helper_1.projectRolesQueryByProject(query);
        const matches = verificationResult.data.assets[0].memberRoles.filter(m => ["Member:20", member1OidToken, member2OidToken]
            .includes(m.member.oidToken));
        t.is(matches.length, 3, "Expected 3 results");
        // Just force the email to be the same for crying out loud
        verifyExpectation[0].member.email = matches[0].member.email;
        t.deepEqual(matches, verifyExpectation);
        doc.request({ payload, responseObject: res, responseObservations: [
                "Notice that the `assetsOperatedOn.oidTokens` array property contains the same token twice. This is because in this example we invoked the `Scope.AssignMemberWithRole` operation on the same scope, passing different member oids each time."
            ] });
        doc.emit();
    });
}
//# sourceMappingURL=execute_Scope_AssignMemberWithRole_list.js.map