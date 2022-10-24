import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { informationOutline, bookOutline, globeOutline, search, albums } from "ionicons/icons";
import SelectBlockchain from "./pages/Selectblockchain";
import ShowNfts from "./pages/ShowNFTS";
import About from "./pages/About";
import Offline from "./pages/Offline";
import Address from "./pages/Address";
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

declare global {
  var dbIsCreated: boolean | null;
  var storeConnection: any;
}

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/SelectBlockchain">
              <SelectBlockchain />
            </Route>
            <Route exact path="/ShowNfts/:blockchainName">
              <ShowNfts />
            </Route>
            <Route path="/About">
              <About />
            </Route>
            <Route path="/Offline">
              <Offline />
            </Route>
            <Route exact path="/Address">
              <Address />
            </Route>
            <Route exact path="/">
              <Redirect to="/SelectBlockchain" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="SelectBlockchain" href="/SelectBlockchain">
              <IonIcon icon={globeOutline} />
              <IonLabel>Blockchain</IonLabel>
            </IonTabButton>
            <IonTabButton tab="ShowNfts" href="/ShowNfts/ETH">
              <IonIcon icon={bookOutline} />
              <IonLabel>Reader</IonLabel>
            </IonTabButton>
            <IonTabButton tab="Offline" href="/Offline" >
              <IonIcon icon={search} />
              <IonLabel>Offline</IonLabel>
            </IonTabButton>
            <IonTabButton tab="Address" href="/Address">
              <IonIcon icon={albums} />
              <IonLabel>Address</IonLabel>
            </IonTabButton>
            <IonTabButton tab="About" href="/About">
              <IonIcon icon={informationOutline} />
              <IonLabel>About</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>

  );

}

export default App;
