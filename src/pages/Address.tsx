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
import { useEffect, useState, useRef } from "react";
import { Drivers, Storage } from "@ionic/storage";
import IonGridNFTS from "./IonGridNFTS";
import IonGridCel from "./IonGridCel";

import * as CordovaSQLiteDriver from "localforage-cordovasqlitedriver";
import "./Addres.css";
const NFTS_KEY = "nft";

let posts: any = [];
let actualPage = 1;
let chainId = "";

const Address: React.FC = () => {
  const [chainName, setChainName] = useState("");
  const [nftsShowing, setNftsShowing] = useState<any>([]); // contiene los registros en total
  const [nfts, setNfts] = useState<any>([]);
  const [itemAddress, setItemAddress] = useState<any>([]);
  const [selectAddressValue, setSelectAddressValue] = useState<any>("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [totalPages, setTotalPages] = useState(1);

  let NftsForPage: number = 2;


  const initStorage = async () => {
    const newStore = new Storage({
      name: "nftdb" + chainId, // nombre de la base de datos (o de la tabla? )
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

    //console.log("--");
    //console.log(storedNfts);
    return storedNfts;
  };

  useEffect(() => {
    setChainName("all");
    initStorage().then((st) => {
      if (st != undefined && st.length != 0) {

        //console.log("st:   ", st);
        let { nft } = JSON.parse(st);
        let masterArray = [];

        for (let chainx in nft) {
          for (let address_ in nft[chainx]) {
            for (let metadata in nft[chainx][address_]) {
              nft[chainx][address_][metadata].chain = chainx;
              masterArray.push(nft[chainx][address_][metadata]);
            }
          }
        }
      }
      // Descomentar esto despues 
      //setNftsRecord(masterArray);   // Carga todos los address al inicio
    });
  }, []);

  interface itemAdressOption {
    value: string;
    label: string;
  }

  async function searchAddress(chainField: string) {


    let itemAddress: itemAdressOption[] = [];

    initStorage().then((st) => {
      //console.log(st);
      if (st != undefined && st.length != 0) {
        const valuex = st;

        itemAddress = [];
        if (valuex !== null) {
          let { nft } = JSON.parse(valuex);
          for (let addressArray in nft[chainField]) {
            itemAddress.push({
              value: addressArray,
              label: addressArray,
            });
          }
          setItemAddress(itemAddress);
        }
        setItemAddress(itemAddress);

        if (itemAddress.length == 1)
          setSelectAddressValue(itemAddress[0].value);
      }
    });
  }

  async function DropDownChain_Onchange(selectedChainId: string) {
    //  recibe las "0x1", "0x89", "0x38"... etc

    setErrorText("");


    setSelectAddressValue("");
    setNftsShowing([]);
    setNfts([]);
    chainId = selectedChainId;
    switch (selectedChainId) {
      case "0x1":
        setChainName("ETH");
        break;
      case "0x89":
        setChainName("Polygon");
        break;
      case "0x38":
        setChainName("BNB");
        break;
      case "0xfa":
        setChainName("Fantom");
        break;
      case "0xa86a":
        setChainName("Avalanche");
        break;
      case "xDai":
        setChainName("POAP");
        break;
      default:
        setChainName("all");
        break;
    }

    await searchAddress(selectedChainId);
    //setSelectAddressValue('');
  }

  async function fetchNfts() {

    posts = [];
    actualPage = 1;

    if (chainName == 'all' || chainName.length == 0)
      setErrorText("Select NFT");
    else if (selectAddressValue.length == 0) {
      if (itemAddress.length == 0)
        setErrorText("Not finded saved NFTs");
      else
        setErrorText("Select Address");
    }
    else {
      if (chainId != null && selectAddressValue != null) {
        initStorage().then((st) => {
          let { nft } = JSON.parse(st);

          // Carga de todos los nfts encontrados
          for (let address in nft[chainId]) {
            for (let metadata in nft[chainId][address]) {
              nft[chainId][address][metadata].chain = chainId;
              posts.push(nft[chainId][address][metadata]);
            }
          }

          if (chainId == 'xDai')  // Si es POAP
            posts = posts.filter((postItem: any) => postItem.owner.toUpperCase() == selectAddressValue.toUpperCase());
          else
            posts = posts.filter((postItem: any) => postItem.owner_of.toUpperCase() == selectAddressValue.toUpperCase());



          if (posts.length / NftsForPage <= Math.round(posts.length / NftsForPage)) //      1.5   <   2
            setTotalPages(Math.round(posts.length / NftsForPage));
          else //      1.4   >   1
            setTotalPages(Math.round(posts.length / NftsForPage) + 1);

          setNfts(posts);

          changePageNfts('neutro');

          if (posts.length == 0) {
            setErrorText("Not finded saved NFTs");
          }
          else {
            setErrorText("");
          }


          //setSelectAddressValue("adsfadsf");
          //setAddress(null);
        });
      }
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
                  <IonItem>
                    <IonSelect
                      style={{ width: "100%" }}
                      mode="ios"
                      interface="popover"
                      placeholder="Select NFT"
                      onIonChange={(ev) => {
                        //setChainx(ev.detail.value);
                        DropDownChain_Onchange(ev.detail.value);
                      }}
                    >
                      <IonSelectOption value="0x1">ETH</IonSelectOption>
                      <IonSelectOption value="0x89">Polygon</IonSelectOption>
                      <IonSelectOption value="0x38">BNB</IonSelectOption>
                      <IonSelectOption value="0xfa">Fantom</IonSelectOption>
                      <IonSelectOption value="0xa86a">
                        Avalanche
                      </IonSelectOption>
                      <IonSelectOption value="xDai">POAP</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </IonList>
              </div>
            </IonCol>
          </IonRow>

          <IonRow class="row-class">
            <IonCol size="12">
              <IonCol>
                <IonSelect // Select 2 -  Address
                  style={{ fontSize: "15px" }}
                  //className="ion-hide-lg-up"
                  interface="popover"
                  placeholder="Select Address"
                  value={selectAddressValue}
                  onIonChange={(ev) => setSelectAddressValue(ev.detail.value)}
                >
                  {itemAddress.map((item: itemAdressOption, index: number) => {
                    return (
                      <IonSelectOption key={index} value={item.value}>
                        {item.label}
                      </IonSelectOption>
                    );
                  })}
                </IonSelect>
              </IonCol>
              {/*

              <div className="selectAddres">
                <select
                  className="ion-hide-lg-down"
                  name="NFTSAddres"
                  id="lang"
                  placeholder="Select Address"
                  style={{ width: "900px", height: "64px", margin: "5 auto" }}
                  value={selectAddressValue}
                  onChange={(ev) => setSelectAddressValue(ev.)}
                >
                  {itemAddress.map((item: itemAdressOption, index: number) => {
                    return (
                      <option
                        key={index == null ? 0 : index}
                        defaultValue="0"
                        value={item.value}
                        >
                        {item.label}
                      </option>
                    );
                  })}
                </select>
              </div>*/
              }
            </IonCol>

            <IonCol>
              <IonButton // Button search
                color="primary"
                className="ion-activatable ripple-parent"
                onClick={fetchNfts}
              >
                Search
              </IonButton>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol class="cell-class cell-align cell-buttons-size "></IonCol>
          </IonRow>

          <IonRow>
            <IonLabel color="danger" className="my-label">   {errorText}</IonLabel>
          </IonRow>

        </IonGrid>

        <div className="WebApp">
          {
            /*IonGridNFTS(chainId, nfts)*/
            IonGridNFTS(
              chainId == null ? "all" : chainId,
              nftsShowing,
              isLoading
            )
          }
        </div>

        <div className="Mobile">
          {
            /*IonGridNFTS(chainId, nfts)*/
            IonGridCel(
              chainId == null ? "all" : chainId,
              nftsShowing,
              isLoading
            )
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

export default Address;
