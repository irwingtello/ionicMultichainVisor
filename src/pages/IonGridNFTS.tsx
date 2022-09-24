import { 
    IonGrid, 
    IonRow, 
    IonCol, 
    IonCard,
    IonCardHeader,
    IonCardContent, 
    IonIcon,
    IonImg,
    IonLabel
} from '@ionic/react';

import { heart } from "ionicons/icons";
import { useEffect, useState, useRef } from "react";


export default function IonGridNFTS(chainId: any, nfts: any, isLoading: boolean, isFindedNfts: boolean, errorText: string) {

    // Estas 3 const están en SHow nft también:
    //const [isLoading, setIsLoading] = useState(false);
    //const [isFindedNfts, setIsFindedNfts] = useState(true);
    //const [errorText, setErrorText] = useState("");
    

  
    function failedLoadImage(tokenUri: string, _nftIndex: number): void {
        console.log(nfts[_nftIndex], tokenUri);
        if (tokenUri) {
        }
      }
    
      //function onError(err: any): void {
      //  console.log(err);
      //  setIsLoading(false);
      //}

    return (
      <IonGrid>
          <div className="Mobile">
            <IonRow>

              {chainId == 'xDai' ?    // Caso POAPMovil
                //
                nfts.map((nft: any, nftIndex: number) => (
                  <IonCol size="12" key={nftIndex}>
                    <IonCard className="ion-no-marginMovil">
                      <IonCardHeader>


                      </IonCardHeader>
                      <IonCardContent>
                        <div className="div-flexMovil" id="Movil">
                          <IonGrid >
                            <IonRow>
                              <IonRow className="imageMovil">
                                {isLoading ? (

                                  <div className="ion-text-centerMovil">
                                    <IonIcon size="large" icon={heart}></IonIcon>
                                  </div>
                                ) : (

                                  <IonImg className="imageMovil"

                                    onIonImgDidLoad={console.log}
                                    onIonError={() =>
                                      failedLoadImage(nft.image, nftIndex)
                                    }
                                    style={{
                                      width: "228px",
                                      height: "228px",
                                      margin: "5 auto",

                                    }}

                                    src={nft?.image}
                                  />


                                )}

                              </IonRow>
                              <IonCol>
                                <IonGrid className="table-flex">
                                  <IonRow>
                                    <IonCol className="td-left"> Chain: <IonCol className="td-right">{nft?.chain}</IonCol></IonCol>
                                  </IonRow>
                                  <IonRow>
                                    <IonCol className="td-left">Fancy_id: <IonCol className="td-right">{nft?.fancy_id}</IonCol></IonCol>
                                  </IonRow>
                                  <IonRow>
                                    <IonCol className="td-left">Year:<IonCol className="td-right">{nft?.tokenId}</IonCol></IonCol>
                                  </IonRow>
                                  <IonRow>
                                    <IonCol className="td-left">Start_date: <IonCol className="td-right">{nft?.start_date}</IonCol></IonCol>
                                  </IonRow>
                                  <IonRow>
                                    <IonCol className="td-left">End_date: <IonCol className="td-right">{nft?.end_date}</IonCol></IonCol>
                                  </IonRow>
                                </IonGrid>
                              </IonCol>
                            </IonRow>
                          </IonGrid>

                        </div>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                ))

                //
                : // Caso genéricoMovil
                nfts.map((nft: any, nftIndex: number) => (
                  <IonCol size="12" key={nftIndex}>
                    <IonCard className="ion-no-marginMovil">
                      <IonCardHeader>


                      </IonCardHeader>
                      <IonCardContent>
                        <div className="div-flexMovil" id="Movil">
                          <IonGrid >
                            <IonRow>
                              <IonRow className="imageMovil">
                                {isLoading ? (

                                  <div className="ion-text-center">
                                    <IonIcon size="large" icon={heart}></IonIcon>
                                  </div>
                                ) : (

                                  <IonImg className="imageMovil"


                                    onIonImgDidLoad={console.log}
                                    onIonError={() =>
                                      failedLoadImage(nft.token_uri, nftIndex)
                                    }
                                    style={{
                                      width: "228px",
                                      height: "228px",
                                      margin: "5 auto",

                                    }}
                                    src={nft.metadata?.image}
                                  />


                                )}

                              </IonRow>

                              <IonCol>
                                <IonGrid className="table-flex">
                                  <IonRow>
                                    <IonCol className="td-left"> Chain: </IonCol>
                                  </IonRow>
                                  <IonCol className="td-left1">{nft?.chain}</IonCol>

                                  <IonRow>
                                    <IonCol className="td-left" size="12">Contract Type: </IonCol>
                                    <IonCol className="td-left1" size="12">{nft?.contract_type}</IonCol>
                                  </IonRow>

                                  <IonRow>
                                    <IonCol className="td-left" size="12">Token Id:</IonCol>
                                  </IonRow>
                                  <IonRow>
                                    <IonCol className="td-left1" size="12">{nft?.token_id}</IonCol>
                                  </IonRow>
                                  <IonRow>
                                    <IonCol className="td-left" size="12">Owner of: </IonCol>
                                  </IonRow>
                                  <IonCol className="td-left1" size="12">{nft?.owner_of}</IonCol>
                                  <IonRow>
                                    <IonCol className="td-left" size="12">Token Address: </IonCol>
                                  </IonRow>
                                  <IonRow>
                                    <IonCol className="td-left1" size="12">{nft?.token_address}</IonCol>
                                  </IonRow>

                                  <IonRow>
                                    <IonCol className="td-left" size="12">Block number: </IonCol>
                                  </IonRow>
                                  <IonRow>
                                    <IonCol className="td-left1" size="12">{nft?.block_number}</IonCol>
                                  </IonRow>
                                  <IonRow>
                                    <IonCol className="td-left">Block number minted:</IonCol>
                                  </IonRow>
                                  <IonRow>
                                    <IonCol className="td-left1" size="12">{nft?.block_number_minted}</IonCol>
                                  </IonRow>
                                  <IonRow>
                                    <IonCol className="td-left" size="12">Token Hash:</IonCol>
                                  </IonRow>
                                  <IonRow>
                                    <IonCol className="td-left1" size="12">{nft?.token_hash}</IonCol>
                                  </IonRow>
                                  <IonRow>
                                    <IonCol className="td-left" size="12">Last Token Uri Sync:</IonCol>
                                  </IonRow>
                                  <IonRow>
                                    <IonCol className="td-left1" size="12">{nft?.last_token_uri_sync}</IonCol>
                                  </IonRow>
                                  <IonRow>
                                    <IonCol className="td-left" size="12">Last Metadata Sync:</IonCol>
                                    <IonCol className="td-left1" size="12">{nft?.last_metadata_sync}</IonCol>
                                  </IonRow>
                                </IonGrid>
                              </IonCol>
                            </IonRow>
                          </IonGrid>

                        </div>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                ))
              }
            </IonRow>
          </div>

          <div className="WebApp">
            <IonRow>
              {chainId == 'xDai' ?    // Caso POAPWEB
                //
                nfts.map((nft: any, nftIndex: number) => (
                  <IonCol size="12" key={nftIndex}>
                    <IonCard className="ion-no-margin">
                      <IonCardHeader>
                      </IonCardHeader>
                      <IonCardContent>
                        <div className="div-flex" id="web">
                          <IonGrid >
                            <IonRow>
                              <IonRow className="image">
                                {isLoading ? (

                                  <div className="ion-text-center">
                                    <IonIcon size="large" icon={heart}></IonIcon>
                                  </div>
                                ) : (

                                  <IonImg className="image"

                                    onIonImgDidLoad={console.log}
                                    onIonError={() =>
                                      failedLoadImage(nft.image, nftIndex)
                                    }
                                    style={{
                                      width: "228px",
                                      height: "228px",
                                      margin: "5 auto",

                                    }}

                                    src={nft?.image}
                                  />


                                )}

                              </IonRow>
                              <IonCol>
                                <IonGrid className="table-flex">
                                <IonRow>
                                    <IonCol className="td-left"> Chain: <IonCol className="td-right">{nft?.chain}</IonCol></IonCol>
                                  </IonRow>
                                  <IonRow>
                                    <IonCol className="td-left">Fancy_id: <IonCol className="td-right">{nft?.fancy_id}</IonCol></IonCol>
                                  </IonRow>
                                  <IonRow>
                                    <IonCol className="td-left">Year:<IonCol className="td-right">{nft?.tokenId}</IonCol></IonCol>
                                  </IonRow>
                                  <IonRow>
                                    <IonCol className="td-left">Start_date: <IonCol className="td-right">{nft?.start_date}</IonCol></IonCol>
                                  </IonRow>
                                  <IonRow>
                                    <IonCol className="td-left">End_date: <IonCol className="td-right">{nft?.end_date}</IonCol></IonCol>
                                  </IonRow>
                                </IonGrid>
                              </IonCol>
                            </IonRow>
                          </IonGrid>

                        </div>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                ))

                //
                : // Caso genéricoWEb3 
                nfts.map((nft: any, nftIndex: number) => (
                  <IonCol size="12" key={nftIndex}>
                    <IonCard className="ion-no-margin">
                      <IonCardHeader>


                      </IonCardHeader>
                      <IonCardContent>
                        <div className="div-flex" id="web">
                          <IonGrid >
                            <IonRow>
                              <IonRow className="image">
                                {isLoading ? (

                                  <div className="ion-text-center">
                                    <IonIcon size="large" icon={heart}></IonIcon>
                                  </div>
                                ) : (

                                  <IonImg className="image"


                                    onIonImgDidLoad={console.log}
                                    onIonError={() =>
                                      failedLoadImage(nft.token_uri, nftIndex)
                                    }
                                    style={{
                                      width: "228px",
                                      height: "228px",
                                      margin: "5 auto",

                                    }}
                                    src={nft.metadata?.image}
                                  />


                                )}

                              </IonRow>

                              <IonCol>


                                <IonGrid className="table-flex">
                                  <IonRow>
                                    <IonCol className="td-left"> Chain: <IonCol className="td-right">{nft?.chain}</IonCol></IonCol>
                                  </IonRow>
                                  <IonRow>
                                    <IonCol className="td-left">Contract Type: <IonCol className="td-right">{nft?.contract_type}</IonCol></IonCol>
                                  </IonRow>

                                  <IonRow>
                                    <IonCol className="td-left" size="12"> Token_Id:
                                      <IonCol className="td-left1">{nft?.token_id}</IonCol></IonCol>
                                  </IonRow>
                                  <IonRow>
                                    <IonCol className="td-left">Owner of: <IonCol className="td-right">{nft?.owner_of}</IonCol></IonCol>
                                  </IonRow>
                                  <IonRow>
                                    <IonCol className="td-left">Token Address: <IonCol className="td-right">{nft?.token_address}</IonCol></IonCol>
                                  </IonRow>
                                  <IonRow>
                                    <IonCol className="td-left">Block number: <IonCol className="td-right">{nft?.block_number}</IonCol></IonCol>
                                  </IonRow>
                                  <IonRow>
                                    <IonCol className="td-left">Block number minted: <IonCol className="td-right">{nft?.block_number_minted}</IonCol></IonCol>
                                  </IonRow>
                                  <IonRow>
                                    <IonCol className="td-left">Token Hash: <IonCol className="td-right">{nft?.token_hash}</IonCol></IonCol>
                                  </IonRow>
                                  <IonRow>
                                    <IonCol className="td-left">Last Token Uri Sync:<IonCol className="td-right">{nft?.last_token_uri_sync}</IonCol></IonCol>
                                  </IonRow>
                                  <IonRow>
                                    <IonCol className="td-left">Last Metadata Sync: <IonCol className="td-right">{nft?.last_metadata_sync}</IonCol></IonCol>
                                  </IonRow>
                                </IonGrid>
                              </IonCol>
                            </IonRow>



                          </IonGrid>


                        </div>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                ))
                                  
              }
            </IonRow>
          </div>

          <IonRow>

            <IonLabel color="danger" className="my-label">{isFindedNfts == true ? "" : errorText}</IonLabel>

          </IonRow>
          {
            //console.log("ChainId Grid -  ", chainId, "\nNFTS Grid -  ", nfts)
          }
        </IonGrid>
    );
}
