import { useEffect, useState } from 'react';
import { Drivers, Storage } from '@ionic/storage';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { HexBase64BinaryEncoding } from 'crypto';
import { ItemSlidingCustomEvent } from '@ionic/react';
import { exists } from 'fs';

const NFTS_KEY = 'nft';

// Requiere instalar:
// npm install cordova-sqlite-storage localforage-cordovasqlitedriver
// para que pueda utilizarse en dispositivos móviles de forma automatica

// Comando para Construir la aplicación para web y IOS:
//  ionic build && ionic cap add ios

// Este es el archivo que genera todo con sql, el otro archivo es la interfaz que muestra los datos con un map

export function useStorage() {
    const [store, setStore] = useState<Storage>();
    const [nftsRecord, setNftsDb] = useState<any>([]); // contiene los registros en total
    const initStorage = async () => {
        const newStore = new Storage({
            name: 'nftdb',   // nombre de la base de datos (o de la tabla? )
            // Agregamos el orden de uso de drivers para que nuestra DB no altere datos de nuestra api y evitar problemas
            driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB, Drivers.LocalStorage]
        });
        await newStore.defineDriver(CordovaSQLiteDriver);

        const store = await newStore.create(); // asigna el nuevo almacenamiento de datos de sql
        setStore(store);

        const storedNfts = await store.get(NFTS_KEY) || []; // obtiene de sql los registros
        //console.log('LOADED: ', storedNfts);   // carga en "todos" los registros de sql

        setNftsDb(storedNfts);

        return storedNfts;
    }

    async function saveNFTs(nfts: any, chain: any, address: string) {
        initStorage();
        let exists = nftsRecord.length == 0 ? 0 : 1;
        //console.log(exists);
        let objectNFT: any = [];
        let chainArray: any = [];
        let addressArray: any = [];
        //console.log("xD");

        if (exists == 0) {
            objectNFT = {
                "nft":
                {
                    //Chain
                    [chain]:
                        //Address

                        { [address]: nfts }

                }
            };
            //Guardar un array de las direcciones que tiene el usuario
            //Si no tiene address la guarda y si tiene, lo sobrescribe
            store?.set(NFTS_KEY, JSON.stringify(objectNFT));
            setNftsDb(objectNFT);
        }
        else {
            let { nft } = JSON.parse(nftsRecord);

            console.log(nft);
            let addressExists = false;
            let chainExists = false;
            for (const [chainField, addressList] of <any>Object.entries(nft)) {

                if (chainField == chain) {
                    chainExists = true;
                    for (const [addressx, metadata] of Object.entries(addressList)) {
                        if (addressx != address) {
                            addressArray[addressx] = metadata;
                        }
                    }

                    chainArray[chainField] = addressArray;
                }
            }

            console.log("Address", address);
            console.log("Chain", chainExists);
            console.log("Address", addressExists);
            console.log("---");
            if (chainExists == false) {
                if (addressExists == false) {
                    addressArray[address] = nfts;
                    nft[chain] = addressArray;
                    chainArray = nft;
                }
            }
            else {
                if (addressExists == false) {
                    for (let address in nft[chain]) {

                        //Address
                        console.log(address);
                        //Value
                        console.log(nft[chain][address]);

                        addressArray[address] = nft[chain][address];
                    }
                    addressArray[address] = nfts;
                    nft[chain] = addressArray;
                    chainArray = nft;
                }
                else {
                    /*
                    Chain true
                    Address true
                    */
                    for (let address in nft[chain]) {
                        addressArray[address] = nft[chain][address];
                    }

                    addressArray[address] = nfts;
                    nft[chain] = addressArray;
                }
            }
            let masterArray = "";
            let addressArrayx = "";

            for (const [chainField, addressList] of <any>Object.entries(chainArray)) {
                for (const [address, metadata] of Object.entries(addressList)) {
                    addressArrayx = addressArrayx + '"' + address + '"' + ":" + JSON.stringify(metadata) + ",";

                }
                addressArrayx = addressArrayx.slice(0, -1);
                masterArray = masterArray + '"' + chainField + '"' + ":" + "{" + addressArrayx + "},";
                addressArrayx = "";
            }

            masterArray = masterArray.slice(0, -1);
            masterArray = '{"nft":{' + masterArray + '}}';
            store?.set(NFTS_KEY, masterArray);

        }
    }

    async function showNfts(){
        const nfts = await initStorage();

        console.log(nfts);
        //initStorage().then( (storedNfts)=>{
            // destructuring objects or arrays
        //    let nft  = nftsRecord;
        //    console.log("Abajito");
        //    console.log(nft);
         //   return nft;
       // }
        //);
    
    }


    // useStorage retorna o exporta las const, como si fueran funciones
    return { nftsDb: nftsRecord, saveNFTs, showNfts }
}
