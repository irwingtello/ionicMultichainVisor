import { IonContent, IonGrid, IonHeader, IonPage, IonTitle, IonToolbar, IonRow, IonCol, IonButton, IonList, IonItem, IonSelect, IonSelectOption } from '@ionic/react';

import './About.css';
import { useStorage } from './useStorage';
import IonGridNFTS from "./IonGridNFTS";
import { useEffect, useState, useRef } from "react";
import { Drivers, Storage } from '@ionic/storage';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { allowedNodeEnvironmentFlags } from 'process';
const NFTS_KEY = 'nft';




const Offline: React.FC = () => {

  const [nfts, setNfts] = useState<any>([]);
  const { saveNFTs } = useStorage();  // Importamos nuestras funciones del archivo useStorage
  const { showNfts } = useStorage();

  const [isLoading, setIsLoading] = useState(false);
  const [isFindedNfts, setIsFindedNfts] = useState(true);
  const [errorText, setErrorText] = useState("Hubo error");
  const [nftsRecord, setNftsDb] = useState<any>([]); // contiene los registros en total

  const [chainx, setChainx] = useState('');

  const initStorage = async () => {
    const newStore = new Storage({
        name: 'nftdb',   // nombre de la base de datos (o de la tabla? )
        // Agregamos el orden de uso de drivers para que nuestra DB no altere datos de nuestra api y evitar problemas
        driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB, Drivers.LocalStorage]
    });
    await newStore.defineDriver(CordovaSQLiteDriver);

    const store = await newStore.create(); // asigna el nuevo almacenamiento de datos de sql
    // setStore(store);

    const storedNfts = await store.get(NFTS_KEY) || []; // obtiene de sql los registros
    //console.log('LOADED: ', storedNfts);   // carga en "todos" los registros de sql

    console.log("--");
    console.log(storedNfts);
    return storedNfts;
}

  useEffect(() => {
    setChainx("all");
   initStorage().then((st) => {
    console.log('st', st);
    let {nft} = JSON.parse(st);
    let masterArray=[];

    for(let chainx in nft)
    {
      for(let address in nft[chainx])
      {
        for(let metadata in nft[chainx][address])
        {   
          nft[chainx][address][metadata].chain=chainx;
          masterArray.push(nft[chainx][address][metadata]);
        }
      }
    }  
    setNftsDb(masterArray);
    
   })
  
  }, []);

  

  async function fetchNftsSaved() {
    
    console.log("Select: ", chainx);
    initStorage().then((st) => {
      let {nft} = JSON.parse(st);
      let masterArray=[];
      

        for(let address in nft[chainx])
        {
          for(let metadata in nft[chainx][address])
          {   
            nft[chainx][address][metadata].chain=chainx;
            masterArray.push(nft[chainx][address][metadata]);
          }
        }

      setNftsDb(masterArray);
      console.log(nftsRecord);
      // IonGridNFTS(chainId, nfts, isLoading, isFindedNfts, errorText);
      
     })
    //console.log("Nft despues", showNfts());

    //IonGridNFTS(chainId, nfts, isLoading, isFindedNfts, errorText);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>NFT VISOR</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Offline</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonGrid>

          <IonRow class="row-class">
            <IonCol class="cell-class">
              <div className="text-lg ion-margin-bottom ion-text-justify">
                <IonList>
                  <IonItem style={{ fontSize: "15px" }} >
                    <IonSelect interface="popover" placeholder="Select NFT"  onIonChange={(ev) => setChainx(ev.detail.value)} >
                      <IonSelectOption value="0x1">ETH</IonSelectOption>
                      <IonSelectOption value="0x89">Polygon</IonSelectOption>
                      <IonSelectOption value="0x38">BNB</IonSelectOption>
                      <IonSelectOption value="0xfa">Fantom</IonSelectOption>
                      <IonSelectOption value="0xa86a">Avalanche</IonSelectOption>
                      <IonSelectOption value="xDai">POAP</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </IonList>
              </div>
            </IonCol>
          </IonRow>

          <IonRow>
            {/*Button Search */}
            <IonCol class="cell-class cell-align cell-buttons-size ">
              <IonButton onClick={fetchNftsSaved} color="primary" className="ion-activatable ripple-parent" style={{}}>
                Search
              </IonButton>

            </IonCol>
          </IonRow>

        </IonGrid>
        {/*IonGridNFTS(chainId, nfts)*/
          IonGridNFTS(chainx==null?"all":chainx, nftsRecord, isLoading, isFindedNfts, errorText)

        }


      </IonContent>
    </IonPage>
  );
};

export default Offline;
