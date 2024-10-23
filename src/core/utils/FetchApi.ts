import {POSTCODER_API} from "../config/conf";

class FetchApi{

    private apiUrl: string = POSTCODER_API;

    constructor() {

    }

    async getData(url: string): Promise<any> {
        try {
            // const response = await fetch(url);
            const response = await fetch(url,{
                method: 'POST',
                    mode: 'no-cors',
                    headers: {
                    'Content-Type': 'application/json',
                        'Accept': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }


    async postData(url: string, payload: any): Promise<any> {
        try {
            // await this.delay(1000);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error posting data:', error);
            throw error;
        }
    }

    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}
export const fetchApi = new FetchApi();