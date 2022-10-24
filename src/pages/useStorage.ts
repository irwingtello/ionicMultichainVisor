import { Drivers, Storage } from '@ionic/storage';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
//import { HexBase64BinaryEncoding } from 'crypto';
//import { ItemSlidingCustomEvent } from '@ionic/react';

export function useStorage() {

    const dbName = "Nfts_DB";

    async function createConnection() {
        if (globalThis.dbIsCreated != true) {
            try {
                const newStore = new Storage({
                    name: dbName,
                    driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB, Drivers.LocalStorage]
                });
                await newStore.defineDriver(CordovaSQLiteDriver);
                globalThis.storeConnection = await newStore.create();
                await storeConnection?.set("tbClear", "-");

                globalThis.dbIsCreated = true;

                console.log("DB is connected: ", globalThis.dbIsCreated);
            }
            catch (error) {
                console.log("Error dbCreated: ", error);
                globalThis.dbIsCreated = false;
            }
        }
    }

    async function getDataConnection(tableName: string) {
        await createConnection();
        let result = [];
        if (globalThis.dbIsCreated == true) {
            try {
                result = await globalThis.storeConnection.get(tableName) || [];
            }
            catch (error) {
                console.log("Error getting data: ", error);
            }
        }
        return result;
    }

    async function setDataConnection(tableName: string, data: string) {
        await createConnection();
        let notErrors = globalThis.dbIsCreated;
        if (globalThis.dbIsCreated == true) {
            try {
                await storeConnection?.set(tableName, data);
            }
            catch (error) {
                console.log("Error setting data: ", error);
                notErrors = false;
            }
        }
        return notErrors;
    }

    /*async function dbClear(TableName: string, DB_Name: string) {
        // await store.clear();
        storeConnection.remove(TableName);
    }*/


    async function saveNFTs(nfts: any, chain: any, address: string) {

        const TableName = 'Chain_' + chain;

        console.log("Getting data...");
        let previousDataSaved: any = await getDataConnection(TableName);

        let objectNFT: any = [];
        let chainArray: any = [];
        let addressArray: any = [];

        console.log("Saving...");
        try {
            if (previousDataSaved.length == 0) {
                objectNFT = {
                    "nft": {
                        [chain]: { [address]: nfts }
                    }
                };
                setDataConnection(TableName, JSON.stringify(objectNFT));
            }
            else {
                let { nft } = JSON.parse(previousDataSaved);
                let addressExists = false;
                let chainExists = false;
                for (const [chainField, addressList] of <any>Object.entries(nft)) {
                    if (chainField == chain) {
                        chainExists = true;
                        for (const [addressx, metadata] of Object.entries(addressList)) {
                            if (addressx != address)
                                addressArray[addressx] = metadata;
                        }
                        chainArray[chainField] = addressArray;
                    }
                }

                if (chainExists == false) {
                    if (addressExists == false) {
                        addressArray[address] = nfts;
                        nft[chain] = addressArray;
                        chainArray = nft;
                    }
                }
                else {
                    if (addressExists == false) {
                        for (let address in nft[chain])
                            addressArray[address] = nft[chain][address];
                        addressArray[address] = nfts;
                        nft[chain] = addressArray;
                        chainArray = nft;
                    }
                    else {
                        for (let address in nft[chain])
                            addressArray[address] = nft[chain][address];

                        addressArray[address] = nfts;
                        nft[chain] = addressArray;
                    }
                }
                let masterArray = "";
                let addressArrayx = "";

                for (const [chainField, addressList] of <any>Object.entries(chainArray)) {

                    for (const [address, metadata] of Object.entries(addressList))
                        addressArrayx = addressArrayx + '"' + address + '"' + ":" + JSON.stringify(metadata) + ",";

                    addressArrayx = addressArrayx.slice(0, -1);
                    masterArray = masterArray + '"' + chainField + '"' + ":" + "{" + addressArrayx + "},";
                    addressArrayx = "";
                }
                masterArray = masterArray.slice(0, -1);
                masterArray = '{"nft":{' + masterArray + '}}';

                setDataConnection(TableName, masterArray);
            }
            console.log("Nft Saved!");
        }
        catch (error: any) {
            console.log("Error saving:   ", error);
        }
    }

    // useStorage retorna o exporta las const, como si fueran funciones
    return { createConnection, getDataConnection, setDataConnection, saveNFTs }
}
