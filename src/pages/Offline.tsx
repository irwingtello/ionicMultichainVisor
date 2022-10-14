import {
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRow,
  IonCol,
  IonButton,
  IonLabel,
  IonList,
  IonItem,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";

import "./About.css";
import { useStorage } from "./useStorage";
import IonGridNFTS from "./IonGridNFTS";
import IonGridCel from "./IonGridCel";
import { useEffect, useState, useRef } from "react";
import { Drivers, Storage } from "@ionic/storage";
import * as CordovaSQLiteDriver from "localforage-cordovasqlitedriver";
import { allowedNodeEnvironmentFlags } from "process";
const NFTS_KEY = "nft";


let posts: any = [];
let actualPage = 1;


const Offline: React.FC = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [nftsShowing, setNftsShowing] = useState<any>([]); // contiene los registros en total
  const [nfts, setNfts] = useState<any>([]);

  const [ChainId, setChainId] = useState("all");

  const [totalPages, setTotalPages] = useState(1);

  let NftsForPage: number = 2;


  const initStorage = async () => {
    const newStore = new Storage({
      name: "nftdb"+ChainId, // nombre de la base de datos (o de la tabla? )
      // Agregamos el orden de uso de drivers para que nuestra DB no altere datos de nuestra api y evitar problemas
      driverOrder: [
        CordovaSQLiteDriver._driver,
        Drivers.IndexedDB,
        Drivers.LocalStorage,
      ],
    });
    await newStore.defineDriver(CordovaSQLiteDriver);

    const store = await newStore.create(); // asigna el nuevo almacenamiento de datos de sql
    // setStore(store);

    const storedNfts = (await store.get(NFTS_KEY)) || []; // obtiene de sql los registros
    //console.log('LOADED: ', storedNfts);   // carga en "todos" los registros de sql

    return storedNfts;
  };

  /*
  useEffect(() => {
    setChainId("all");
    initStorage().then((st) => {
      
      console.log(st);
      if (st != undefined && st.length != 0) {
        let { nft } = JSON.parse(st);
        let masterArray = [];

        for (let chainx in nft) {
          for (let address in nft[chainx]) {
            for (let metadata in nft[chainx][address]) {
              nft[chainx][address][metadata].chain = chainx;
              masterArray.push(nft[chainx][address][metadata]);
            }
          }
        }
        setNftsShowing(masterArray);
      }
    });
  }, []);
  */

  async function DropDownChain_Onchange(selectedChainId: string) {
    setNfts([]);
    setNftsShowing([]);
    setErrorText("");
  }

  async function fetchNftsSaved() {
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name);
      });
    });
    posts = [];
    if (ChainId == "all" || ChainId.length == 0)
      setErrorText("Select NFT");
    else {
      initStorage().then((st) => {

        if (st != undefined && st.length != 0) {
          let { nft } = JSON.parse(st);

          for (let address in nft[ChainId]) {
            for (let metadata in nft[ChainId][address]) {
              nft[ChainId][address][metadata].chain = ChainId;
              posts.push(nft[ChainId][address][metadata]);
            }
          }

          if (posts.length / NftsForPage <= Math.round(posts.length / NftsForPage)) //      1.5   <   2
            setTotalPages(Math.round(posts.length / NftsForPage));
          else //      1.4   >   1
            setTotalPages(Math.round(posts.length / NftsForPage) + 1);

          setNfts(posts);

          changePageNfts('neutro');
        }


        if (posts.length == 0)
          setErrorText("Not finded saved NFTs");
        else
          setErrorText("");

      });
    }
  }

  function previousPage() {
    changePageNfts("previous");
  }
  function nextPage() {
    changePageNfts("next");
  }

  function changePageNfts(type: 'previous' | 'next' | 'neutro') {

    switch (type) {
      case 'previous':
        if (actualPage >= 2)
          actualPage--;
        break;
      case 'next':
        if (actualPage <= totalPages - 1)
          actualPage++;
        break;
      default: break;
    }

    let postsPage: any = [];
    for (let i = 0; i <= NftsForPage - 1; i++) {
      postsPage[i] = posts[(NftsForPage * actualPage) + i - NftsForPage];
    }

    setNftsShowing(postsPage.filter((nft: any) => typeof nft !== 'undefined'));
  }
  useEffect(() => {
    console.log("xd");
    return () => {
      console.log("cleaned up");
    };
  }, []);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>NFT VISOR</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense"></IonHeader>
        <IonGrid>
          <IonRow class="row-class">
            <IonCol class="cell-class">
              <div className="text-lg ion-margin-bottom ion-text-justify">
                <IonList>
                  <IonItem style={{ fontSize: "15px" }}>
                    <IonSelect
                      interface="popover"
                      placeholder="Select NFT"
                      onIonChange={(ev) => {
                        setChainId(ev.detail.value);
                        DropDownChain_Onchange(ev.detail.value);
                      }}
                    >
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
              <IonButton
                onClick={fetchNftsSaved}
                color="primary"
                className="ion-activatable ripple-parent"
                style={{}}
              >
                Search
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonLabel color="danger" className="my-label">
              {errorText}
            </IonLabel>
          </IonRow>
        </IonGrid>

        <div className="WebApp">
          {
            /*IonGridNFTS(chainId, nfts)*/
            IonGridNFTS(
              ChainId == null ? "all" : ChainId,
              nftsShowing,
              isLoading
            )
          }
        </div>

        <div className="Mobile ">
          {
            /*IonGridNFTS(chainId, nfts)*/
            IonGridCel(ChainId == null ? "all" : ChainId, nftsShowing, isLoading)
          }
        </div>

        {
          nfts.length != 0 ?
            <IonGrid>
              <IonButton onClick={previousPage}>❮</IonButton>
              <IonButton onClick={nextPage}>❯</IonButton>
              <IonLabel> Page: {actualPage} / {totalPages} - NFTs Finded: {nfts.length}</IonLabel>
            </IonGrid>
            : <></>
        }


      </IonContent>
    </IonPage>
  );
};

export default Offline;
