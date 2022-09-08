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
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonPopover,
} from "@ionic/react";
import { filterOutline, gridOutline, searchOutline } from "ionicons/icons";
import { useRef, useState } from "react";
import "./Tab1.css";

interface IBlockchain {
  chainId: number;
  name: string;
  img: string;
}

const FIXED_HEIGHT = 168;

const blockchains: IBlockchain[] = [
  {
    chainId: 1,
    name: "Ethereum",
    img: "https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png",
  },
  {
    chainId: 2,
    name: "Polygon",
    img: "https://seeklogo.com/images/P/polygon-matic-logo-1DFDA3A3A8-seeklogo.com.png",
  },
  {
    chainId: 3,
    name: "Solana",
    img: "https://seeklogo.com/images/S/solana-sol-logo-12828AD23D-seeklogo.com.png",
  },
  {
    chainId: 4,
    name: "BSC",
    img: "https://seeklogo.com/images/B/binance-coin-bnb-logo-CD94CC6D31-seeklogo.com.png",
  },
  {
    chainId: 5,
    name: "Fantom",
    img: "https://cryptologos.cc/logos/fantom-ftm-logo.png",
  },
  {
    chainId: 6,
    name: "Avalanche",
    img: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
  },
  {
    chainId: 10,
    name: "POAP",
    img: "https://poap.gallery/icons/poap_dark.png",
  },
];

const Tab1: React.FC = () => {
  const a: number = 0;

  // var, let, const
  const [isSearching, setIsSearching] = useState(false);
  const [search, setSearch] = useState("");
  // const searchInputRef = useRef();
  const Popover = () => (
    <IonContent className="ion-padding">
      <IonList>
        {blockchains
          .slice(5)
          .map((blockchain: any, blockchainIndex: number) => (
            <IonItem key={blockchainIndex}>
              <IonAvatar className="ion-margin-end">
                <IonImg src={blockchain.img} />
              </IonAvatar>
              <IonLabel>{blockchain.name}</IonLabel>
            </IonItem>
          ))}
      </IonList>
    </IonContent>
  );

  const [present, dismiss] = useIonPopover(Popover, {
    onDismiss: (data: any, role: string) => dismiss(data, role),
    side: "top-center",
  });
  const [roleMsg, setRoleMsg] = useState("");

  return (
    //jsx
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
              <div className="text-lg ion-margin-bottom">Select blockchain</div>
            </IonCol>
            <IonCol className="ion-text-right">
              {!isSearching && (
                <IonIcon
                  size="small"
                  className="ion-margin-start"
                  icon={gridOutline}
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
            {blockchains
              .slice(0, 6)
              .map((blockchain: IBlockchain, blockchainIndex: number) => (
                <IonCol size="6" key={blockchainIndex}>
                  {blockchainIndex < 5 && (
                    <IonCard className="ion-no-margin">
                      <IonCardHeader>
                        <IonImg
                          style={{
                            width: "64px",
                            height: "64px",
                            margin: "0 auto",
                          }}
                          src={blockchain.img}
                        />
                      </IonCardHeader>

                      <IonCardContent>
                        <p className="ion-text-center">{blockchain.name}</p>
                      </IonCardContent>
                    </IonCard>
                  )}
                  {blockchainIndex === 5 && (
                    <IonCard
                      onClick={(e: any) =>
                        present({
                          event: e,
                          onDidDismiss: (e: CustomEvent) =>
                            setRoleMsg(
                              `Popover dismissed with role: ${e.detail.role}`
                            ),
                        })
                      }
                      className="ion-no-margin"
                    >
                      <IonCardHeader>
                        <IonImg
                          style={{
                            width: "64px",
                            height: "64px",
                            margin: "0 auto",
                          }}
                          src="https://www.freeiconspng.com/thumbs/add-icon-png/add-icon--line-iconset--iconsmind-29.png"
                        />
                      </IonCardHeader>

                      <IonCardContent>
                        <p className="ion-text-center">More</p>
                      </IonCardContent>
                    </IonCard>
                  )}
                </IonCol>
              ))}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
