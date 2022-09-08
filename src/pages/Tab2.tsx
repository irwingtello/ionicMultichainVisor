import {
  IonAvatar,
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
import "./Tab2.css";
import axios from "axios";

const Tab2: React.FC = () => {
  const [address, setAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [nfts, setNfts] = useState<any>([]);
  const [isShowingQR, setIsShowingQR] = useState<any>({});

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
    // const address = "0xb7df44b373a32e1506d23899f85b220528c2cf80";
    // const address = "0x55aa13d2549351808b132513a0afce5163658313";
    // const address = "0xd97c7c5c30feba950790d3a6f72d98509499112c";
    // const addres = "0xED972ea8ed13DeE21F6ec697820B4961b4988881";
    // const address = "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e";
    // const address = "0xa9EF99546530A6c10333c52ad4b96d79bEd1F3b3";
    const chain = "polygon";
    const API_URL = "https://deep-index.moralis.io/api/v2";
    const { data } = await axios.get(
      `${API_URL}/${address}/nft?chain=${chain}&format=decimal`,
      {
        headers: {
          "X-Api-Key":
            "4AJJrGmR2jOnZnYf0ASkCO5zDbZy5F8QQhW0vlWT0tfb3CdsR1jPiaOVNchmsV8o",
        },
      }
    );

    data.result = data.result.map((nft: any) => ({
      ...nft,
      metadata: JSON.parse(nft.metadata),
    }));

    const posts = await Promise.all(
      data.result.map(async (nft: any) => {
        if (nft.image || (nft.metadata && nft.metadata.image)) {
          // run the call for saving base64 img at orbit db ipfs
          const EXPRESS_SERVER = "http://localhost:3000";
          const stm = await axios.post(`${EXPRESS_SERVER}/img`, {
            imgUrl: nft.image || nft.metadata.image,
          });

          console.log(stm);
          const news = {
            ...nft,
            image: `data:image/png;base64,${stm.data.base64}`,
          };
          console.log(news);
          return news;
        }

        return nft;
      })
    );

    console.log(posts);

    console.log(posts);

    setNfts(posts);
    setIsLoading(false);
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

  useEffect(() => {}, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>nftReader</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol>
              <div className="text-lg ion-margin-bottom">
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
              </div>
            </IonCol>
            <IonCol className="ion-text-right">
              {!isSearching && (
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
              )}
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
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
