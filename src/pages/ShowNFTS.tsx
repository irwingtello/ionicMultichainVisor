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

const ShowNfts: React.FC = () => {
  const params: any = useParams();
  const customData = require("../blockchains.json");

  useEffect(() => {
    setBlockchainName(params.blockchainName);
  }, [[params.blockchain]]);

  // console.log(params);
  const [blockchainName, setBlockchainName] = useState("");
  const [address, setAddress] = useState("");
  const [nfts, setNfts] = useState<any>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

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

  const saveNftsHandle = async () => {
    //  envía el objeto a sql para que agregue o actualice los nfts en el registro
    await saveNFTs(nfts, chainId, address);
  };

  async function fetchNfts() {
    // valida input vacío
    if (address.trim().length === 0) {
      setErrorText("Write the address");
      setNfts([]);
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
        let posts = [];
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
                  : "https://lh3.googleusercontent.com/5wX5t0QHTVMd-8KeqY9Y67l-giA9pVUOgc_BcyyjKVfCHxP21NQOHixiBPFpGZVsQi7-2Q=s170";
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
                : "https://lh3.googleusercontent.com/5wX5t0QHTVMd-8KeqY9Y67l-giA9pVUOgc_BcyyjKVfCHxP21NQOHixiBPFpGZVsQi7-2Q=s170";
              nft.image = nft.event.image_url;
              nft.nftId = nft.event.id;
              nft.fancy_id = nft.event.fancy_id;
              nft.year = nft.event.year;
              nft.start_date = nft.event.start_date;
              nft.end_date = nft.event.end_date;
              return nft;
            })
          );
        }
        if (posts.length <= 0) {
          setErrorText("Sorry we don't found yours nfts");
        }
        setNfts(posts);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setErrorText("Invalid Address");
      }
    }
  }

  useEffect(() => {}, []);

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
            IonGridNFTS(chainId, nfts, isLoading)
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
            IonGridCel(chainId, nfts, isLoading)
            /*<IonGridNFTS
            chainId={chainId}
            nfts={nfts}
            isLoading={isLoading}
            isFindedNfts={isFindedNfts}
            errorText={errorText}
          ></IonGridNFTS>*/
          }
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ShowNfts;
