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
import { useEffect, useState } from "react";
import "./ShowNFTS.css";
import axios from "axios";
import { useParams } from "react-router-dom";

let chainId: string;
let row: number;

const ShowNFTS: React.FC = () => {
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
      {/* <IonList>
        <IonItem className="ios-text-center">
          <IonIcon icon={squareOutline}></IonIcon>
        </IonItem>
        <IonItem>
          <IonIcon icon={squareOutline}></IonIcon>
          <IonIcon icon={squareOutline}></IonIcon>
        </IonItem>
        <IonItem>
          <IonIcon icon={squareOutline}></IonIcon>
          <IonIcon icon={squareOutline}></IonIcon>
          <IonIcon icon={squareOutline}></IonIcon>
        </IonItem>
        <IonItem>
          <IonIcon icon={squareOutline}></IonIcon>
          <IonIcon icon={squareOutline}></IonIcon>
          <IonIcon icon={squareOutline}></IonIcon>
          <IonIcon icon={squareOutline}></IonIcon>
        </IonItem>
      </IonList> */}
    </IonContent>
  );

  const [present, dismiss] = useIonPopover(Popover, {
    onDismiss: (data: any, role: string) => dismiss(data, role),
    side: "top-bottom",
  });
  const [roleMsg, setRoleMsg] = useState("");

  async function fetchNfts() {
    setIsLoading(true);
    setIsFindedNfts(true);
    // const address = "0xb7df44b373a32e1506d23899f85b220528c2cf80";
    // const address = "0x55aa13d2549351808b132513a0afce5163658313";
    // const address = "0xd97c7c5c30feba950790d3a6f72d98509499112c";
    // const addres = "0xED972ea8ed13DeE21F6ec697820B4961b4988881";
    // const address = "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e";
    // const address = "0xa9EF99546530A6c10333c52ad4b96d79bEd1F3b3";


    /*    let chainId;
        switch(blockchainName)
        {
          case 'ETH': chainId="0x1"; break;
          case 'Polygon': chainId="0x89"; break;
          case 'BNB': chainId="0x38"; break;
          case 'Fantom': chainId="0xfa"; break;
          case 'Avalanche': chainId="0xa86a"; break;
          case 'POAP': chainId="xDai"; break;
          default: chainId="0x1"; break; // Agarra Etherum
        }
    
      */

    //useEffect(() => {

    for (row = 0; row <= customData.length; row++) {
      if (customData[row].currentSymbol === blockchainName) {
        chainId = customData[row].chainId;
        break;
      }
    }

    console.log("ChainId: " + chainId);
    console.log("Name: " + blockchainName);

    const API_URL = "https://deep-index.moralis.io/api/v2/";
    const { data } = await axios.get(
      `${API_URL}/${address}/nft?chain=${chainId}&format=decimal`,
      {
        headers: {
          "X-Api-Key": "XUnDBl1fLvCROuwpgxpB645C1VrrjGGwfUDz6NmdJNo97qUCftf3a8TU0DGIu6Yo",
        },
      }
    );

    data.result = data.result.map((nft: any) => ({
      ...nft,
      metadata: JSON.parse(nft.metadata),
    }));

    setIsFindedNfts(false);

    const posts = await Promise.all(
      data.result.map(async (nft: any) => {
        setIsFindedNfts(true);
        return nft;
      })
    )
    /*.then((values: any) => {
      setIsFindedNfts(false);
      console.log("Todo mal: " + values);
    })
    .catch((error: any) => {
      setIsFindedNfts(false);
      console.log("Todo mal: " + error);
    });*/

    if (posts.length <= 0) {
      setIsFindedNfts(false);
    }


    console.log(posts);

    console.log(posts);

    console.log("Finded: " + isFindedNfts);


    setNfts(posts);
    setIsLoading(false);

    //}, [[]]);
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
          <IonRow>
            <IonCol>
              <div className="text-lg ion-margin-bottom ion-text-justify">
                <IonInput
                  style={{ fontSize: "12px" }}
                  className="ion-no-padding border-bottom-white"
                  value={address}
                  placeholder="Enter address"
                  onKeyPress={(e: any) => {
                    if (e.charCode === 13) fetchNfts();
                  }}
                  onIonChange={(e: any) => setAddress(e.detail.value)}
                  autofocus
                ></IonInput>
                <IonButton onClick={fetchNfts} >
                  Search
                </IonButton>
              </div>
            </IonCol>
            <IonCol className="ion-text-right">
              {/*!isSearching && (
                <IonIcon
                  size="small"
                  className="ion-margin-start"
                  icon={gridOutline}
                  onClick={(e: any) =>
                    present({
                      event: e,
                      onDidDismiss: (e: CustomEvent) =>
                        setRoleMsg(
                          `Popover dismissed with role: ${e.detail.role}`
                        ),
                    })
                  }
                />
              )}
              {!isSearching && (
                <IonIcon
                  size="small"
                  className="ion-margin-start"
                  icon={filterOutline}
                />
              )}
              {!isSearching && (
                <IonIcon
                  size="small"
                  className="ion-margin-start"
                  icon={searchOutline}
                  onClick={() => setIsSearching(true)}
                />
              )}
              {isSearching && (
                <IonRow className="ion-align-items-center">
                  <IonCol class="ion-no-padding" size="4">
                    <IonIcon
                      size="small"
                      className="ion-margin-end"
                      icon={searchOutline}
                      onClick={() => setIsSearching(false)}
                    />
                  </IonCol>
                  <IonCol class="ion-no-padding" size="8">
                    <IonInput
                      style={{ fontSize: "12px" }}
                      className="ion-no-padding border-bottom-white"
                      value={search}
                      placeholder="Search"
                      onIonChange={(e: any) => setSearch(e.detail.value)}
                      autofocus
                    ></IonInput>
                  </IonCol>
                </IonRow>
              )} */}
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonGrid>
          <IonRow>
            {nfts.map((nft: any, nftIndex: number) => (
              <IonCol size="6" key={nftIndex}>
                <IonCard className="ion-no-margin">
                  <IonCardHeader>
                    {isLoading ? (
                      <div className="ion-text-center">
                        <IonIcon size="large" icon={heart}></IonIcon>
                      </div>
                    ) : isShowingQR[nft.token_hash] ? (
                      <div
                        style={{
                          width: "128px",
                          height: "128px",
                          margin: "0 auto",
                        }}
                        onClick={() =>
                          setIsShowingQR({
                            ...isShowingQR,
                            [nft.token_hash]: false,
                          })
                        }
                      >
                        <QRCodeSVG value={nft.token_hash} />
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
                    <p className="ion-text-center">
                      {nft.name} - {nft.metadata?.name}
                    </p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
          <IonRow>

            <IonLabel>{isFindedNfts == true ? "" : "Sorry we don't found yours nfts"}</IonLabel>

          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ShowNFTS;
