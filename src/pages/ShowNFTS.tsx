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
  searchOutline,
  squareOutline,
} from "ionicons/icons";
import { useEffect, useState, useRef } from "react";
import "./ShowNfts.css";
import axios from "axios";
import { useParams } from "react-router-dom";

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
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [nfts, setNfts] = useState<any>([]);
  const [isShowingQR, setIsShowingQR] = useState<any>({});

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
            metadata: JSON.parse(nft.metadata),
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

  function failedLoadImage(tokenUri: string, _nftIndex: number): void {
    console.log(nfts[_nftIndex], tokenUri);
    if (tokenUri) {
    }
  }

  function onError(err: any): void {
    console.log(err);
    setIsLoading(false);
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
                  style={{ fontSize: "12px", width: '100%' }}
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
              <IonButton onClick={fetchNfts} color="light" className="ion-activatable ripple-parent">
                Save
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonGrid>
          <IonRow>
            {chainId == 'xDai' ?    // Caso POAP
              //
              nfts.map((nft: any, nftIndex: number) => (
                <IonCol size="6" key={nftIndex}>
                  <IonCard className="ion-no-margin">
                    <IonCardHeader>
                      {isLoading ? (
                        <div className="ion-text-center">
                          <IonIcon size="large" icon={heart}></IonIcon>
                        </div>
                      ) : (
                        <IonImg
                          onClick={() =>
                            setIsShowingQR({
                              ...isShowingQR,
                              [nft.token_hash]: true,
                            })
                          }
                          onIonImgDidLoad={console.log}
                          onIonError={() =>
                            failedLoadImage(nft.image, nftIndex)
                          }
                          style={{
                            width: "128px",
                            height: "128px",
                            margin: "0 auto",
                          }}
                          src={nft?.image}
                        />
                      )}
                    </IonCardHeader>
                    <IonCardContent>
                      <p className="ion-text-center">
                        {nft?.fancy_id}
                      </p>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))
              //
              : // Caso genérico 
              nfts.map((nft: any, nftIndex: number) => (
                <IonCol size="12" key={nftIndex}>
                  <IonCard className="ion-no-margin">
                    <IonCardHeader>
                      {isLoading ? (
                        <div className="ion-text-center">
                          <IonIcon size="large" icon={heart}></IonIcon>
                        </div>
                      ) : (
                        <IonImg
                          onClick={() =>
                            setIsShowingQR({
                              ...isShowingQR,
                              [nft.token_hash]: true,
                            })
                          }
                          onIonImgDidLoad={console.log}
                          onIonError={() =>
                            failedLoadImage(nft.token_uri, nftIndex)
                          }
                          style={{
                            width: "128px",
                            height: "128px",
                            margin: "0 auto",
                          }}
                          src={nft.metadata?.image}
                        />
                      )}
                    </IonCardHeader>
                    <IonCardContent>
                      <div className="div-flex">
                        <table className="table-flex">
                          <tr><td className="td-right"><p className="p-font">Chain: </p></td><td className="td-left"><p>{nft?.chain}</p></td></tr>
                          <tr><td className="td-right"><p className="p-font">Contract Type: </p></td><td className="td-left"><p>{nft?.contract_type}</p></td></tr>
                          <tr><td className="td-right"><p className="p-font">Token Id: </p></td><td className="td-left"><p>{nft?.token_id}</p></td></tr>
                          <tr><td className="td-right"><p className="p-font">Owner of: </p></td><td className="td-left"><p>{nft?.owner_of}</p></td></tr>
                          <tr><td className="td-right"><p className="p-font">Token Address: </p></td><td className="td-left"><p>{nft?.token_address}</p></td></tr>
                          <tr><td className="td-right"><p className="p-font">Block number: </p></td><td className="td-left"><p>{nft?.block_number}</p></td></tr>
                          <tr><td className="td-right"><p className="p-font">Block number minted: </p></td><td className="td-left"><p>{nft?.block_number_minted}</p></td></tr>
                          <tr><td className="td-right"><p className="p-font">Token Hash: </p></td><td className="td-left"><p>{nft?.token_hash}</p></td></tr>
                          <tr><td className="td-right"><p className="p-font">Last Token Uri Sync: </p></td><td className="td-left"><p>{nft?.last_token_uri_sync}</p></td></tr>
                          <tr><td className="td-right"><p className="p-font">Last Metadata Sync: </p></td><td className="td-left"><p>{nft?.last_metadata_sync }</p></td></tr>
                        </table>
                      </div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))
            }
          </IonRow>
          <IonRow>
            <IonLabel color="danger" className="my-label">{isFindedNfts == true ? "" : errorText}</IonLabel>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ShowNfts;