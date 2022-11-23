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
import IonGridNFTS from "./IonGridNFTS";
import IonGridCel from "./IonGridCel";
import { useStorage } from "./useStorage";

import "./Addres.css";

let posts: any = [];
let actualPage = 1;
let chain = "";

const Address: React.FC = () => {
  const DB_Name = "Nfts_DB";

  const { getDataConnection } = useStorage();
  let clear = getDataConnection("tbClear");
  const [chainName, setChainName] = useState("");
  const [nftsShowing, setNftsShowing] = useState<any>([]);
  const [nfts, setNfts] = useState<any>([]);
  const [itemAddress, setItemAddress] = useState<any>([]);
  const [selectAddressValue, setSelectAddressValue] = useState<any>("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [totalPages, setTotalPages] = useState(1);
  const [waiting, setWaiting] = useState(false);
  const [msgSearching, setMsgSearching] = useState("");

  let NftsForPage: number = 2;

  interface itemAdressOption {
    value: string;
    label: string;
  }

  async function DropDownChain_Onchange(selectedChainId: string) {
    //  receives "0x1", "0x89", "0x38"... and so
    setWaiting(true);
    setMsgSearching("Searching Saved Address...");
    setErrorText("");
    setSelectAddressValue("");
    posts = [];
    setNftsShowing([]);
    setNfts([]);
    setItemAddress([]);
    chain = selectedChainId;
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
        setChainName("");
        break;
    }

    let itemAddress: itemAdressOption[] = [];

    const TableName = "Chain_" + chain;

    let st = await getDataConnection(TableName);

    console.log(itemAddress);

    if (st != undefined && st.length != 0) {
      const valuex = st;

      itemAddress = [];
      if (valuex !== null) {
        let { nft } = JSON.parse(valuex);
        for (let addressArray in nft[selectedChainId]) {
          itemAddress.push({
            value: addressArray,
            label: addressArray,
          });
        }
        setItemAddress(itemAddress);
      }
      setItemAddress(itemAddress);

      if (itemAddress.length == 1) setSelectAddressValue(itemAddress[0].value);
    } else setErrorText("Not finded saved NFTs");

    setWaiting(false);
    setMsgSearching("");
    let clear = getDataConnection("tbClear");
  }

  function DropDownAddress_Onchange(selectedAddress: string) {
    setSelectAddressValue(selectedAddress);
    setErrorText("");
    posts = [];
    setNftsShowing([]);
    setNfts([]);
    let clear = getDataConnection("tbClear");
  }

  async function fetchNfts() {
    posts = [];
    actualPage = 1;

    if (chainName == "all" || chainName.length == 0) setErrorText("Select NFT");
    else if (selectAddressValue.length == 0) {
      if (itemAddress.length == 0) setErrorText("Not finded saved NFTs");
      else setErrorText("Select Address");
    } else {
      if (chain != null && selectAddressValue != null) {
        setWaiting(true);
        setMsgSearching("Searching...");

        const TableName = "Chain_" + chain;
        let st = await getDataConnection(TableName);

        let { nft } = JSON.parse(st);

        // chargue all nfts finded
        for (let address in nft[chain]) {
          for (let metadata in nft[chain][address]) {
            nft[chain][address][metadata].chain = chain;
            posts.push(nft[chain][address][metadata]);
          }
        }

        if (chain == "xDai")
          // if is POAP
          posts = posts.filter(
            (postItem: any) =>
              postItem.owner.toUpperCase() == selectAddressValue.toUpperCase()
          );
        else
          posts = posts.filter(
            (postItem: any) =>
              postItem.owner_of.toUpperCase() ==
              selectAddressValue.toUpperCase()
          );

        if (
          posts.length / NftsForPage <=
          Math.round(posts.length / NftsForPage)
        )
          //      1.5   <   2
          setTotalPages(Math.round(posts.length / NftsForPage));
        //      1.4   >   1
        else setTotalPages(Math.round(posts.length / NftsForPage) + 1);

        setNfts(posts);

        changePageNfts("neutro");

        setWaiting(false);
        setMsgSearching("");

        if (posts.length == 0) {
          setErrorText("Not finded saved NFTs");
        } else {
          setErrorText("");
        }
      }
    }
    let clear = getDataConnection("tbClear");
  }

  function previousPage() {
    changePageNfts("previous");
  }
  function nextPage() {
    changePageNfts("next");
  }
  function changePageNfts(type: "previous" | "next" | "neutro") {
    switch (type) {
      case "previous":
        if (actualPage >= 2) actualPage--;
        break;
      case "next":
        if (actualPage <= totalPages - 1) actualPage++;
        break;
      default:
        break;
    }

    let postsPage: any = [];
    for (let i = 0; i <= NftsForPage - 1; i++) {
      postsPage[i] = posts[NftsForPage * actualPage + i - NftsForPage];
    }

    setNftsShowing(postsPage.filter((nft: any) => typeof nft !== "undefined"));
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
                  <IonItem
                    className="inpuborder"
                    style={{ fontSize: "15px", width: "100%" }}
                  >
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
              {chain != "" && itemAddress.length != 0 ? (
                <IonItem
                  className="inpuborder"
                  style={{ fontSize: "15px", width: "100%" }}
                >
                  <IonSelect // Select 2 -  Address
                    style={{ fontSize: "15px", width: "100%" }}
                    //className="ion-hide-lg-up"
                    interface="popover"
                    placeholder="Select Address"
                    value={selectAddressValue}
                    //onIonChange={(ev) => setSelectAddressValue(ev.detail.value)}
                    onIonChange={(ev) =>
                      DropDownAddress_Onchange(ev.detail.value)
                    }
                  >
                    {itemAddress.map(
                      (item: itemAdressOption, index: number) => {
                        return (
                          <IonSelectOption key={index} value={item.value}>
                            {item.label}
                          </IonSelectOption>
                        );
                      }
                    )}
                  </IonSelect>
                </IonItem>
              ) : (
                <IonLabel color="dark" className="my-label">
                  {msgSearching}
                </IonLabel>
              )}
            </IonCol>

            <IonCol>
              {nfts.length == 0 ? (
                <IonButton // Button search
                  color="primary"
                  className="ion-activatable ripple-parent"
                  onClick={fetchNfts}
                >
                  Search
                </IonButton>
              ) : (
                <IonLabel color="dark" className="my-label">
                  {msgSearching}
                </IonLabel>
              )}
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol class="cell-class cell-align cell-buttons-size "></IonCol>
          </IonRow>

          <IonRow>
            <IonLabel color="danger" className="my-label">
                 {errorText}
            </IonLabel>
          </IonRow>
        </IonGrid>

        <div className="WebApp">
          {IonGridNFTS(chain == null ? "all" : chain, nftsShowing, isLoading)}
        </div>

        <div className="Mobile">
          {IonGridCel(chain == null ? "all" : chain, nftsShowing, isLoading)}
        </div>
        {nfts.length != 0 ? (
          <IonGrid>
            <IonButton onClick={previousPage}>❮</IonButton>
            <IonButton onClick={nextPage}>❯</IonButton>
            <IonLabel>
              {" "}
              Page: {actualPage} / {totalPages} - NFTs Finded: {nfts.length}
            </IonLabel>
          </IonGrid>
        ) : (
          <></>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Address;
