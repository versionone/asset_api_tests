import axios from 'axios';
import sdk, {axiosConnector} from 'v1sdk';

export default class {
	v1:any;

	constructor({server = 'localhost', instance = 'versionone', username = 'admin', password = 'admin', ssl = false} = {}) {
		const axiosConnectedSdk = axiosConnector(axios)(sdk);
		if(ssl){
            this.v1 = axiosConnectedSdk(server, instance, 443, true).withCreds(username, password);
        }
        else {
            this.v1 = axiosConnectedSdk(server, instance, 80, false).withCreds(username, password);
        }
	}

    createAssetReturnOid(assetType, data) {
        return this.v1.create(assetType, data)
            .then(moment => moment.data.id.slice(0, moment.data.id.lastIndexOf(':')), err => console.log(err.response.data.exceptions));
    }

    updateAsset(oidToken, data, changeComment){
        return this.v1.update(oidToken, data, changeComment);
    }

    async getAssetOid(queryObj){
        let result = await this.v1.query(queryObj);
        if(result.data.length === 0 || result.data[0].length === 0){
            return null;
        }
        return result.data[0][0]._oid;

    }
	async query(queryBody) {
		return (await this.v1.query(queryBody)).data;
	}

	async getAssetOidByName(name, assetType){
	    return await this.getAssetOid({
            select: ["ID"],
            where: {Name:name},
            from: assetType});
    }

    async assetExistsByName(name, assetType) {
	    return await this.getAssetOidByName(name, assetType) !== null;
    }
};




