import * as yaml from 'js-yaml';
import * as fs from 'fs-extra';

const adjustUrl = (url : string) => url.replace(/https?:\/\/.*?\/.*?\//gm, "http://V1Host/V1Instance/");
const TWO_SPACES = "  ";

const stringify = (obj : any) => JSON.stringify(obj, null, TWO_SPACES);

const documenter = () => ({
    exampleName(exampleName : string) {
        this._exampleName = exampleName;
    },

    title(title : string) {
        this._title = title;
    },

    description(description : string) {
        this._description = description;
    },

    type(type : string) {
        this._type = type;
    },

    _setupDescription : "",

    setup(res, setup : string, description : string = "For the context of this example, the following request will setup the instance with the needed starting conditions:") {
        this._setupDescription = description;
        this._setupMethod = res.config.method.toUpperCase();
        this._setupUrl = adjustUrl(res.config.url);

        if (this._type === 'json') {
             const ary = yaml.safeLoadAll(setup);
             setup = stringify(ary);
        }
        this._setup = setup;
    },

    _requests : [],

    request({
        payload = "",
        responseObject = null,
        description = "The following request invokes the behavior:",
        responseDescription = "Expect a result similar to this:",
        requestObservations = [],
        responseObservations = []} :
        {
            payload: string,
            responseObject: any,
            description?: string,
            responseDescription?: string,
            requestObservations?: string [],
            responseObservations?: string []
        }) {
        if (this._type === 'json') payload = stringify(JSON.parse(payload));
        const request = {
            description,
            payload,
            url : adjustUrl(responseObject.config.url),
            method : responseObject.config.method.toUpperCase(),
            response : stringify(responseObject.data),
            responseDescription,
            requestObservations,
            responseObservations
        }
        this._requests.push(request);
    },

    emit() {
        if (process.env['APIDOCS_EMIT'] === undefined) return;
        let requests = "";
        let setup = "";
        for(let i = 0; i < this._requests.length; i++) {
            const request = this._requests[i];
            let requestText = `
#### HTTP Request ${this._requests.length > 1 ? i : ""}

${request.description}

\`${request.method} ${request.url}\`

##### Payload:
\`\`\`${this._type}
${request.payload}
\`\`\`
`;
            if (request.requestObservations.length > 0) {
                let observationText = "";
                for(let observation of request.requestObservations)
                    observationText += `* ${observation}\n`;
                requestText += "\n" + observationText;
            }
            
            requestText +=

`#### HTTP Response ${this._requests.length > 1 ? i : ""}

${request.responseDescription}

\`\`\`json
${request.response}
\`\`\`
`;
            if (request.responseObservations.length > 0) {
                let observationText = "";
                for(let observation of request.responseObservations)
                    observationText += `* ${observation}\n`;
                requestText += "\n" + observationText;
            }

            requests += requestText;

            if (this._setupDescription !== "") {
                const setupText = `
#### Setup

${this._setupDescription}

##### HTTP Request

\`${this._setupMethod} ${this._setupUrl}\`

###### Payload:

\`\`\`${this._type}
${this._setup}
\`\`\`
`;
                setup += setupText;
            }
        }

        const content =
`## ${this._title}

${this._description}

${setup}

${requests}
`;

        const rootDir = process.env['APIDOCS_ROOT'];
        if (rootDir === undefined) console.log(`file: ${this._exampleName}\n\n${content}`);
        else {
            const fileName = `${rootDir}/${this._exampleName}/${this._type}.md`;
            fs.outputFileSync(fileName, content);
        }
    }
});

export default documenter;