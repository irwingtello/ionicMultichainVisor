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
import { useEffect, useState, useRef, Component } from "react";

let posts: any = [];
let actualPage = 1;

const Offline: React.FC = (pruebaParam: any) => {
  const { getDataConnection } = useStorage();
  let clear = getDataConnection("tbClear");

  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [chain, setChain] = useState("");
  const [nfts, setNfts] = useState<any>([]);
  const [nftsShowing, setNftsShowing] = useState<any>([]);

  const [totalPages, setTotalPages] = useState(1);
  const [waiting, setWaiting] = useState(false);
  const [msgSearching, setMsgSearching] = useState("");

  let NftsForPage: number = 2;

  async function DropDownChain_Onchange() {
    posts = [];
    setNfts([]);
    setNftsShowing([]);
    setErrorText("");
    setWaiting(false);

    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name);
      });
    });
  }

  async function fetchNftsSaved() {
    if (chain.length == 0) setErrorText("Select NFT");
    else {
      setMsgSearching("Searching...");
      setWaiting(true);
      const TableName = "Chain_" + chain;

      let st = await getDataConnection(TableName);

      if (st != undefined && st.length != 0) {
        let { nft } = JSON.parse(st);

        for (let address in nft[chain]) {
          for (let metadata in nft[chain][address]) {
            nft[chain][address][metadata].chain = chain;
            posts.push(nft[chain][address][metadata]);
          }
        }

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
        setErrorText("");
        setMsgSearching("");
      } else {
        setErrorText("Not finded saved NFTs");
        setWaiting(false);
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
                      interface="popover"
                      placeholder="Select NFT"
                      onIonChange={(ev) => {
                        setChain(ev.detail.value);
                        DropDownChain_Onchange();
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

          <IonRow>
            {/*Button Search */}
            <IonCol class="cell-class cell-align cell-buttons-size ">
              {waiting == false /*Button Search */ ? (
                <IonButton
                  onClick={fetchNftsSaved}
                  color="primary"
                  className="ion-activatable ripple-parent"
                  style={{}}
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
            <IonLabel color="danger" className="my-label">
              {errorText}
            </IonLabel>
          </IonRow>
        </IonGrid>

        <div className="WebApp">
          {
            /*IonGridNFTS(chainId, nfts)*/
            IonGridNFTS(chain == null ? "all" : chain, nftsShowing, isLoading)
          }
        </div>

        <div className="Mobile ">
          {
            /*IonGridNFTS(chainId, nfts)*/
            IonGridCel(chain == null ? "all" : chain, nftsShowing, isLoading)
          }
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

export default Offline;
