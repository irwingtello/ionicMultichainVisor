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
    let nftsDb: any = [];

    async function saveNFTs(nfts: any, chain: any, address: string) {
        /* 
        */
        const newStore = new Storage({
            name: 'nftdb' + chain,   // nombre de la base de datos (o de la tabla? )
            // Agregamos el orden de uso de drivers para que nuestra DB no altere datos de nuestra api y evitar problemas
            driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB, Drivers.LocalStorage]
        });
        await newStore.defineDriver(CordovaSQLiteDriver);


        const store = await newStore.create(); // asigna el nuevo almacenamiento de datos de sql

        const storedNfts = await store.get(NFTS_KEY) || []; // obtiene de sql los registros

        /* 
        */
        //console.log('LOADED: ', storedNfts);   // carga en "todos" los registros de sql
        //setNftsDb(storedNfts);
        nftsDb = storedNfts;
        //initStorage();
        //let exists = nftsDb.length == 0 ? 0 : 1;
        //console.log(exists);
        let objectNFT: any = [];
        let chainArray: any = [];
        let addressArray: any = [];
        //console.log("xD");

        console.log("Saving...");
        try {
        if (nftsDb.length == 0) {
            objectNFT = {
                "nft": {
                    [chain]: { [address]: nfts }
                }
            };
            //Guardar un array de las direcciones que tiene el usuario
            //Si no tiene address la guarda y si tiene, lo sobrescribe

            //store?.set(NFTS_KEY, JSON.stringify(objectNFT)); 
            store?.set(NFTS_KEY, JSON.stringify(objectNFT));

            //console.log("nftkey: ", NFTS_KEY);
            //console.log("JSONStringify: ", JSON.stringify(objectNFT));
            
            //setNftsDb(objectNFT);
            nftsDb = objectNFT;


            //console.log("Nfts Saved!", objectNFT);
            //console.log("Nfts Saved!", nftsDb);

        }
        else {
            let { nft } = JSON.parse(nftsDb);

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
            store?.set(NFTS_KEY, masterArray);
            
            //console.log("Nfts Saved! 2 ", masterArray);
            //console.log("Nfts Saved! 2 ", nftsDb);
        }
        //console.log("STORE:          ", store);
        console.log("Nft Saved!");
     }  
     catch(error:any)
     {
        console.log("Error saving:   ", error);
     }       
    }

    // useStorage retorna o exporta las const, como si fueran funciones
    return { nftsDb, saveNFTs}
}
