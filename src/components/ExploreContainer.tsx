import "./ExploreContainer.css";
import { IonButton, IonRouterLink } from "@ionic/react";

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  return (
    <div className="container" style={{}}>
      <IonRouterLink className="ionButton" color="dark" href="https://www.dfhcommunity.com/nftvisorPrivacyPolicy">
        Privacy Policy
      </IonRouterLink>

    </div>
  );
};

export default ExploreContainer;
