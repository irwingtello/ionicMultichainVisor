import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonLabel,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonPopover,
} from "@ionic/react";

import { squareOutline } from "ionicons/icons";
import { useEffect, useState, useRef } from "react";
import "./ShowNFTS.css";
import axios from "axios";
import { useParams } from "react-router-dom";

import { useStorage } from "./useStorage";
import IonGridNFTS from "./IonGridNFTS";
import IonGridCel from "./IonGridCel";
import { wait } from "@testing-library/react";

let chain: string;
let row: number;
let posts: any = [];
let actualPage = 1;
let searching = false;

const ShowNfts: React.FC = () => {
  const params: any = useParams();
  const customData = require("../blockchains.json");

  useEffect(() => {
    setBlockchainName(params.blockchainName);
  }, [[params.blockchain]]);

  // console.log(params);
  const [blockchainName, setBlockchainName] = useState("");
  const [address, setAddress] = useState("");
  const [nftsShowing, setNftsShowing] = useState<any>([]);
  const [nfts, setNfts] = useState<any>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [waiting, setWaiting] = useState(false);

  let DataURL: any;
  let NftsForPage: number = 2;

  const Popover = () => (
    <IonContent className="ion-padding">
      <IonGrid>
        <IonRow>
          <IonCol className="ion-text-center">
            <IonIcon icon={squareOutline}></IonIcon>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol className="ion-text-center">
            <IonIcon icon={squareOutline}></IonIcon>
            <IonIcon icon={squareOutline}></IonIcon>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol className="ion-text-center">
            <IonIcon icon={squareOutline}></IonIcon>
            <IonIcon icon={squareOutline}></IonIcon>
            <IonIcon icon={squareOutline}></IonIcon>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol className="ion-text-center">
            <IonIcon icon={squareOutline}></IonIcon>
            <IonIcon icon={squareOutline}></IonIcon>
            <IonIcon icon={squareOutline}></IonIcon>
            <IonIcon icon={squareOutline}></IonIcon>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );

  const [present, dismiss] = useIonPopover(Popover, {
    onDismiss: (data: any, role: string) => dismiss(data, role),
    side: "top-bottom",
  });

  const { saveNFTs } = useStorage();

  async function saveNftsHandle() {
    setWaiting(true);
    searching = false;

    if (nfts.length != 0) {
      try {

        console.log("Converting images...");
        for (let i = 0; i <= nfts.length - 1; i++) {
          if (nfts[i].chain == "xDai") {
            nfts[i].image = await getBase64Image(nfts[i].event.image_url);
          }
          else if (nfts[i].metadata != null) {
            nfts[i].metadata.image = await getBase64Image(nfts[i].metadata.image);
          }
        }
        console.log("Images converted!");

        caches.keys().then((names) => {
          names.forEach((name) => {
            caches.delete(name);
          });
        });
        await saveNFTs(nfts, chain, address);
      }
      catch (error: any) {
        //setErrorText("Error Saving. " + error + ". FANCY_ID: " + actualChain);
        setErrorText("Error Saving.");
      }
    }
    else
      setErrorText("Not Searching Nfts");
    setWaiting(false);
  };

  async function parseURI(d: any) {
    var reader = new FileReader();    /* https://developer.mozilla.org/en-US/docs/Web/API/FileReader */
    reader.readAsDataURL(d);          /* https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL */
    return new Promise((res, rej) => {  /* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise */
      reader.onload = (e: any) => {        /* https://developer.mozilla.org/en-US/docs/Web/API/FileReader/onload */
        res(e.target.result)
      }
    })
  }

  async function getBase64Image(urlCORS: any) {
    //console.log("Url before: ", urlCORS);
    const xhr = new XMLHttpRequest();
    const url = urlCORS;
    xhr.open("GET", url);
    xhr.send();

    var res = await fetch(urlCORS);
    var blob = await res.blob();
    var uri = await parseURI(blob);
    //console.log("Base64 Image:    ", uri);
    return uri;
  }

  async function fetchNfts() {

    actualPage = 1;
    searching = true;
    setWaiting(true);

    if (address.trim().length === 0) {
      setErrorText("Write the address");
      setNftsShowing([]);
    } else {
      setErrorText("");
      setIsLoading(true);

      // search which blockchain send the URL
      for (row = 0; row <= customData.length; row++) {
        if (customData[row].currentSymbol === blockchainName) {
          chain = customData[row].chainId;
          break;
        }
      }

      let API_URL =
        chain == "xDai"
          ? "https://frontend.poap.tech/actions/scan/"
          : "https://deep-index.moralis.io/api/v2/";
      const API_KEY =
        "XUnDBl1fLvCROuwpgxpB645C1VrrjGGwfUDz6NmdJNo97qUCftf3a8TU0DGIu6Yo";
      let URL =
        chain == "xDai"
          ? `${API_URL}${address}`
          : `${API_URL}/${address}/nft?chain=${chain}&format=decimal`;
      try {
        const { data } = await axios.get(URL, {
          headers: {
            "X-Api-Key": API_KEY,
          },
        });
        if (chain != "xDai") {
          // return data
          // data.map((x: any) => x);
          /*
          data.map((x: any) => {
            // process data
          })
          */
          data.result = data.result.map((nft: any) => {
            const metadata = JSON.parse(nft.metadata);
            if (metadata) {
              metadata.image =
                metadata && metadata.image
                  ? metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")
                  : "https://live.staticflickr.com/65535/52418856778_a6fa0fc459_b.jpg";
              //getBase64Image(metadata.image); // Case ETHEREUM
            }
            return {
              ...nft,
              chain: chain,
              metadata,
            };
          });

          posts = await Promise.all(
            data.result.map(async (nft: any) => {
              return nft;
            })
          );
        } else {
          posts = await Promise.all(
            data.map(async (nft: any) => {
              nft.chain = chain;
              //Checar si no esta nulo,si no esta nulo, muestra y hace el replace
              //nft.image = nft.image  &&  nft.image.replace("ipfs://", "https://ipfs.io/ipfs/");
              nft.image = nft.image
                ? nft.image.replace("ipfs://", "https://ipfs.io/ipfs/")
                : "https://live.staticflickr.com/65535/52418856778_a6fa0fc459_b.jpg";
              nft.image = nft.event.image_url;
              nft.nftId = nft.event.id;
              nft.fancy_id = nft.event.fancy_id;
              nft.year = nft.event.year;
              nft.start_date = nft.event.start_date;
              nft.end_date = nft.event.end_date;    // CASE POAP
              //getBase64Image(nft.image);
              return nft;
            })
          );
        }
        if (posts.length <= 0)
          setErrorText("Sorry we don't found yours nfts");

        //console.log("Image base64 :   ", posts[0].base64Image);

        if (posts.length / NftsForPage <= Math.round(posts.length / NftsForPage)) //      1.5   <   2
          setTotalPages(Math.round(posts.length / NftsForPage));
        else //      1.4   >   1
          setTotalPages(Math.round(posts.length / NftsForPage) + 1);

        setNfts(posts);

        changePageNfts('neutro');

        //console.log("Nfts:   ", nfts);
        //console.log("Nfts showing:    ", nftsShowing);
        setIsLoading(false);
      }
      catch (error) {
        console.log(error);
        setErrorText("Invalid Address");
        setNftsShowing([]);
        setNfts([]);
      }
    }
    setWaiting(false);
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
      <IonContent className="ion-padding" fullscreen>
        <IonGrid>
          <IonRow class="row-class">
            <IonCol class="cell-class">
              <div className="text-lg ion-margin-bottom ion-text-justify">
                <IonInput
                  style={{ fontSize: "15px", width: "100%" }}
                  className="ion-no-padding border-bottom-white"
                  value={address}
                  placeholder="Enter address"
                  onKeyPress={(e: any) => {
                    if (e.charCode === 13) fetchNfts();
                  }}
                  onIonChange={(e: any) => setAddress(e.detail.value)}
                  autofocus
                ></IonInput>
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <div className="div-buttons">
              <IonCol class="cell-class cell-align cell-buttons-size ">
                {
                  waiting == false ?      /*Button Search */
                    <IonButton
                      onClick={fetchNfts}
                      color="primary"
                      className="ion-activatable ripple-parent"
                    >
                      Search
                    </IonButton> : <></>
                }

                {waiting == true && searching == true ?
                  <IonLabel color="dark" className="my-label">Searching...</IonLabel>
                  : ""}
                {waiting == false ?           /*Button Save */
                  <IonButton
                    onClick={() => saveNftsHandle()}
                    color="light"
                    className="ion-activatable ripple-parent"
                  >
                    Save
                  </IonButton>
                  : <></>
                }
                {waiting == true && searching == false ? <IonLabel color="dark" className="my-label">Saving...</IonLabel>
                  : ""}


              </IonCol>
            </div>
          </IonRow>
          <IonRow>
            <IonLabel color="danger" className="my-label">
              {errorText}
            </IonLabel>
          </IonRow>
        </IonGrid>

        <div className="WebApp">{IonGridNFTS(chain, nftsShowing, isLoading)}</div>

        <div className="Mobile">{IonGridCel(chain, nftsShowing, isLoading)}</div>
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

export default ShowNfts;
