import axios from 'axios';

export default class {
    tcUserName: string;
    tcPassword: string;
    teamcityBuildID: string;

    constructor(teamcityBuildID) {
        this.tcUserName = process.env['TEAMCITY_SERVICE_USER'];
        this.tcPassword = process.env['TEAMCITY_SERVICE_PASSWORD'];
        this.teamcityBuildID = teamcityBuildID;
    }

    tag(tagName) {
        if (this.teamcityBuildID !== null) {
            return axios.post('http://teamcity/httpAuth/app/rest/builds/' + this.teamcityBuildID + '/tags/', tagName, {
                headers: {'content-Type': 'text/plain'},
                auth: {username: this.tcUserName, password: this.tcPassword}
            })
                .then(function (response) {
                    console.log(response.data, 'tag added successfully');
                }).catch(function (error) {
                console.log('Error:', error);
            });
        } else {
            // console.log('No teamcity build ID provided, so build cannot be tagged');
            return Promise.resolve()
        }
    }
};



