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

let chainId: string;
let row: number;
let posts: any = [];
let actualPage = 1;


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

  const { saveNFTs } = useStorage(); // Importamos nuestras funciones del archivo useStorage

  async function saveNftsHandle() {
    //  envía el objeto a sql para que agregue o actualice los nfts en el registro

    console.log("Converting images...");
    //console.log("Nft antes:   ", nfts);
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
    await saveNFTs(nfts, chainId, address);
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

    //console.log("Url antes: ", urlCORS);

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

    // valida input vacío
    if (address.trim().length === 0) {
      setErrorText("Write the address");
      setNftsShowing([]);
    } else {
      setErrorText("");
      setIsLoading(true);

      // Busca cual blockchain llegó por URL
      for (row = 0; row <= customData.length; row++) {
        if (customData[row].currentSymbol === blockchainName) {
          chainId = customData[row].chainId;
          break;
        }
      }

      let API_URL =
        chainId == "xDai"
          ? "https://frontend.poap.tech/actions/scan/"
          : "https://deep-index.moralis.io/api/v2/";
      const API_KEY =
        "XUnDBl1fLvCROuwpgxpB645C1VrrjGGwfUDz6NmdJNo97qUCftf3a8TU0DGIu6Yo";
      let URL =
        chainId == "xDai"
          ? `${API_URL}${address}`
          : `${API_URL}/${address}/nft?chain=${chainId}&format=decimal`;
      try {
        const { data } = await axios.get(URL, {
          headers: {
            "X-Api-Key": API_KEY,
          },
        });
        if (chainId != "xDai") {
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
              chain: chainId,
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
              nft.chain = chainId;
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
      } catch (error) {
        console.log(error);
        setErrorText("Invalid Address");
        setNftsShowing([]);
        setNfts([]);

      }
    }
  }

  function previousPage() {
    changePageNfts("previous");
  }
  function nextPage() {
    changePageNfts("next");
  }

  //useEffect(() => {
  //
  // }, [lblNftsShowing]);

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

    //console.log("posts ", posts);
    //console.log("posts ", postsPage);

    /* Antiguo
    for (let i = 0; i <= NftsForPage - 1; i++) {
      let element = (actualPage * NftsForPage) - NftsForPage + i;

      if (element <= posts.length - 1)
        postsPage[i] = posts[element];
      else
        break;
    }// antiguo
    */

    setNftsShowing(postsPage.filter((nft: any) => typeof nft !== 'undefined'));
    // console.log("nftshowing:    ", nftsShowing);
  }

  /*function toDataURL(url: string, callback: any) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }*/


  //useEffect(() => { }, []);

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
            {/*Button Search */}
            <div className="div-buttons">
              <IonCol class="cell-class cell-align cell-buttons-size ">
                <IonButton
                  onClick={fetchNfts}
                  color="primary"
                  className="ion-activatable ripple-parent"
                >
                  Search
                </IonButton>
                {/*Button Save */}

                <IonButton
                  onClick={() => saveNftsHandle()}
                  color="light"
                  className="ion-activatable ripple-parent"
                >
                  Save
                </IonButton>
              </IonCol>
            </div>
          </IonRow>
          <IonRow>
            <IonLabel color="danger" className="my-label">
              {errorText}
            </IonLabel>
          </IonRow>
        </IonGrid>

        <div className="WebApp">
          {
            IonGridNFTS(chainId, nftsShowing, isLoading)
            /*<IonGridNFTS
            chainId={chainId}
            nfts={nfts}
            isLoading={isLoading}
            isFindedNfts={isFindedNfts}
            errorText={errorText}
          ></IonGridNFTS>*/
          }
        </div>

        <div className="Mobile">
          {
            IonGridCel(chainId, nftsShowing, isLoading)
            /*<IonGridNFTS
            chainId={chainId}
            nfts={nfts}
            isLoading={isLoading}
            isFindedNfts={isFindedNfts}
            errorText={errorText}
          ></IonGridNFTS>*/
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

export default ShowNfts;
