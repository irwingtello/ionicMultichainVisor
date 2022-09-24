import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonPopover,
} from "@ionic/react";
import QRCodeSVG from "qrcode.react";

import {
  filterOutline,
  gridOutline,
  heart,
  image,
  searchOutline,
  squareOutline,
} from "ionicons/icons";
import { useEffect, useState, useRef } from "react";
import "./ShowNFTS.css";
import axios from "axios";
import { useParams } from "react-router-dom";

import { useStorage } from './useStorage';
import IonGridNFTS from "./IonGridNFTS";

let chainId: string;
let row: number;

const ShowNfts: React.FC = () => {
  const params: any = useParams();
  const customData = require('../blockchains.json');

  useEffect(() => {
    setBlockchainName(params.blockchainName);
  }, [[params.blockchain]]);

  // console.log(params);
  const [blockchainName, setBlockchainName] = useState("");
  const [address, setAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [search, setSearch] = useState("");
  const [nfts, setNfts] = useState<any>([]);
  const [isShowingQR, setIsShowingQR] = useState<any>({});


  const [isLoading, setIsLoading] = useState(false);
  const [isFindedNfts, setIsFindedNfts] = useState(true);
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
  const [roleMsg, setRoleMsg] = useState("");

  const { saveNFTs } = useStorage();  // Importamos nuestras funciones del archivo useStorage


  const saveNftsHandle = async () => { //  envía el objeto a sql para que agregue o actualice los nfts en el registro
    await saveNFTs(nfts, chainId, address);
  }


  async function fetchNfts() {

    // valida input vacío
    if (address.trim().length === 0) {
      setErrorText("Write the address");
      setIsFindedNfts(false);
      setNfts([]);
    }
    else {
      setIsLoading(true);
      // Busca cual blockchain llegó por URL
      for (row = 0; row <= customData.length; row++) {
        if (customData[row].currentSymbol === blockchainName) {
          chainId = customData[row].chainId;
          break;
        }
      }

      let API_URL = (chainId == 'xDai') ? "https://frontend.poap.tech/actions/scan/" : "https://deep-index.moralis.io/api/v2/";
      const API_KEY = 'XUnDBl1fLvCROuwpgxpB645C1VrrjGGwfUDz6NmdJNo97qUCftf3a8TU0DGIu6Yo';
      let URL = (chainId == 'xDai') ?
        `${API_URL}${address}` :
        `${API_URL}/${address}/nft?chain=${chainId}&format=decimal`;
      try {
        const { data } = await axios.get(
          URL,
          {
            headers: {
              'X-Api-Key': API_KEY,
            },
          }
        );
          
        let posts = [];
        if (chainId != 'xDai') {
          data.result = data.result.map((nft: any) => ({
            ...nft,
            chain: chainId,
            metadata: JSON.parse(nft.metadata)

          
            
          }));


          posts = await Promise.all(
            data.result.map(async (nft: any) => {
              setIsFindedNfts(true);
              return nft;
            })
          );

          
        }
        else {
          
          posts = await Promise.all(
            data.map(async (nft: any) => {
              setIsFindedNfts(true); 
              nft.chain = chainId;
              nft.image = nft.event.image_url;
              if(nft.event.image_url === "ipfs://")
              {
                  try 
                  {
                    nft.image=nft.event.image_url.replace("ipfs://", "https://ipfs.io/ipfs/");
                  }
                  catch
                  {
                    nft.image="https://lh3.googleusercontent.com/5wX5t0QHTVMd-8KeqY9Y67l-giA9pVUOgc_BcyyjKVfCHxP21NQOHixiBPFpGZVsQi7-2Q=s170";
                  }
              }
              else
              {
                nft.image = nft.event.image_url;
              }
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
          setIsFindedNfts(false);
        }

        setNfts(posts);
        setIsLoading(false);

      }
      catch ({ error }) {

        setIsFindedNfts(false);
      }
    }
  }



  useEffect(() => { }, []);

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
                  style={{ fontSize: "15px", width: '100%' }}
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
            <IonCol class="cell-class cell-align cell-buttons-size ">
              <IonButton onClick={fetchNfts} color="primary" className="ion-activatable ripple-parent" style={{}}>
                Search
              </IonButton>
              {/*Button Save */}
              <IonButton onClick={() => saveNftsHandle()} color="light" className="ion-activatable ripple-parent">
                Save
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
        {
          IonGridNFTS(chainId,nfts,isLoading,isFindedNfts,errorText)
          /*<IonGridNFTS
            chainId={chainId}
            nfts={nfts}
            isLoading={isLoading}
            isFindedNfts={isFindedNfts}
            errorText={errorText}
          ></IonGridNFTS>*/
        }
      </IonContent>
    </IonPage>

  );
};

export default ShowNfts;