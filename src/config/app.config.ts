import * as dotenv from 'dotenv';
import  * as NodeGeocoder from 'node-geocoder'
const options : NodeGeocoder.Options = {
    provider: 'google',
    apiKey: 'AIzaSyDslSHJqkBgRk1J9ZJhAJYcRWfyLs4p1_I', // for Mapquest, OpenCage, APlace, Google Premier
    formatter: null // 'gpx', 'string', ...
};

dotenv.config();

export default () => ({

    appSecret: process.env.TOKEN_KEY

})
export const GOOGLE_GEOCODER = NodeGeocoder(options);
