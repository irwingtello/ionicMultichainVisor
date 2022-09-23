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
  IonList,
  IonItem,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";

import "./About.css";

const Offline: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>NFT VISOR </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Offline</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonGrid>
          <IonRow class="row-class">
            <IonCol size="12">
              <IonSelect
                mode="ios"
                className="ion-hide-lg-up"
                interface="action-sheet"
                placeholder="Select NFT"
              >
                <IonSelectOption value="ETH">ETH</IonSelectOption>
                <IonSelectOption value="Polygon">Polygon</IonSelectOption>
                <IonSelectOption value="BNB">BNB</IonSelectOption>
                <IonSelectOption value="Fantom">Fantom</IonSelectOption>
                <IonSelectOption value="Avalanche">Avalanche</IonSelectOption>
                <IonSelectOption value="POAP">POAP</IonSelectOption>
              </IonSelect>
              <div className="select">
                <select
                  className="ion-hide-lg-down"
                  name="NFTS"
                  id="lang"
                  style={{ width: "604px", height: "64px", margin: "5 auto" }}
                >
                  <option value="ETH1">ETH</option>
                  <option value="Polygon1">Polygon</option>
                  <option value="BNB1">BNB</option>
                  <option value="Fantom1">Fantom</option>
                  <option value="Avalanche1">Avalanche</option>
                  <option value="POAP1">POAP</option>
                </select>
              </div>
            </IonCol>
            <IonCol>
              <IonButton
                color="primary"
                className="ion-activatable ripple-parent"
              >
                Search
              </IonButton>
            </IonCol>
          </IonRow>

          <IonRow>
            {/*Button Search */}
            <IonCol class="cell-class cell-align cell-buttons-size "></IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Offline;
