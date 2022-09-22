import { IonContent, IonGrid, IonHeader, IonPage, IonTitle, IonToolbar, IonRow,IonCol,IonButton, IonList, IonItem, IonSelect, IonSelectOption } from '@ionic/react';

import './About.css';

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
            <IonCol class="cell-class">
              <div className="text-lg ion-margin-bottom ion-text-justify">
              <IonList>
      <IonItem  style={{ fontSize: "15px" }} >
        <IonSelect interface="popover" placeholder="Select NFT">
          <IonSelectOption value="ETH">ETH</IonSelectOption>
          <IonSelectOption value="Polygon">Polygon</IonSelectOption>
          <IonSelectOption value="BNB">BNB</IonSelectOption>
          <IonSelectOption value="Fantom">Fantom</IonSelectOption>
          <IonSelectOption value="Avalanche">Avalanche</IonSelectOption>
          <IonSelectOption value="POAP">POAP</IonSelectOption>
        </IonSelect>
      </IonItem>
    </IonList>
              </div>
            </IonCol>
          </IonRow>

          <IonRow>
            {/*Button Search */}
            <IonCol class="cell-class cell-align cell-buttons-size ">
              <IonButton color="primary" className="ion-activatable ripple-parent" style={{}}>
                Search
              </IonButton>

              </IonCol>
         </IonRow>

      </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Offline;
