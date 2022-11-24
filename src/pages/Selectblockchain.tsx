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
import { useHistory, useParams } from "react-router-dom";
import { filterOutline, gridOutline, searchOutline } from "ionicons/icons";
import { userInfo } from "os";
import { useRef, useState } from "react";
import "./Selectblockchain.css";
import "../blockchains.json";

interface IBlockchain {
  chainId: string;
  currentSymbol: string;
  img: string;
}

const FIXED_HEIGHT = 168;

let blockchains: IBlockchain[] = require('../blockchains.json');

const SelectBlockchain: React.FC = () => {
  const history = useHistory();

  const a: number = 0;

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
  function navigateTo(name: string) {

    history.push(`/ShowNfts/${name}`);
  }

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
          <IonTitle>NFT VISOR</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol>
              <div className="text-lg ion-margin-bottom">Select Blockchain</div>
            </IonCol>
            <IonCol className="ion-text-right"></IonCol>
          </IonRow>
        </IonGrid>
        <IonGrid>
          <IonRow>
            {blockchains
              .slice(0, 6)
              .map((blockchain: IBlockchain, blockchainIndex: number) => (
                <IonCol size="6" key={blockchainIndex}>
                  {blockchainIndex < 6 && (
                    <IonCard
                      onClick={() => navigateTo(blockchain.currentSymbol)} // chainId   o    name
                      className="ion-no-margin"
                    >
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
                        <p className="ion-text-center">{blockchain.currentSymbol}</p>
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
                    ></IonCard>
                  )}
                </IonCol>
              ))}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default SelectBlockchain;
