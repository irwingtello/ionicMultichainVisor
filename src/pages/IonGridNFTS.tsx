import {
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonIcon,
  IonImg,
  IonLabel,
} from "@ionic/react";

import { heart } from "ionicons/icons";

export default function IonGridNFTS(
  chainId: any,
  nfts: any,
  isLoading: boolean
) {
  function failedLoadImage(tokenUri: string, _nftIndex: number): void {
    console.log(nfts[_nftIndex], tokenUri);
    if (tokenUri) {
    }
  }

  return (
    <>
      <IonGrid>
        {chainId === "all" ? ( //PoapMobil
          <></>
        ) : (
          nfts.map((nft: any, nftIndex: number) =>
            nft.chain == "xDai" ? ( //PoapWEb
              <IonCol size="12" key={nftIndex}>
                <IonCard className="ion-no-margin">
                  <IonCardHeader></IonCardHeader>
                  <IonCardContent>
                    <div id="web">
                      <IonGrid>
                        <IonRow>
                          <IonRow className="image">
                            {isLoading ? (
                              <div className="ion-text-center">
                                <IonIcon size="large" icon={heart}></IonIcon>
                              </div>
                            ) : (
                              <IonImg
                                className="image"
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
                                <IonCol className="td-left">
                                  {" "}
                                  Chain: 
                                  <IonCol className="td-right">
                                    {nft?.chain}
                                  </IonCol>
                                </IonCol>
                              </IonRow>
                              <IonRow>
                                <IonCol className="td-left">
                                  Fancy_id: 
                                  <IonCol className="td-right">
                                    {nft?.fancy_id}
                                  </IonCol>
                                </IonCol>
                              </IonRow>
                              <IonRow>
                                <IonCol className="td-left">
                                  Year:
                                  <IonCol className="td-right">
                                    {nft?.tokenId}
                                  </IonCol>
                                </IonCol>
                              </IonRow>
                              <IonRow>
                                <IonCol className="td-left">
                                  Start_date: 
                                  <IonCol className="td-right">
                                    {nft?.start_date}
                                  </IonCol>
                                </IonCol>
                              </IonRow>
                              <IonRow>
                                <IonCol className="td-left">
                                  End_date: 
                                  <IonCol className="td-right">
                                    {nft?.end_date}
                                  </IonCol>
                                </IonCol>
                              </IonRow>
                            </IonGrid>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ) : (
              <IonCol size="12" key={nftIndex}>
                <IonCard className="ion-no-margin">
                  <IonCardHeader></IonCardHeader>
                  <IonCardContent>
                    <div id="web">
                      <IonGrid>
                        <IonRow>
                          <IonRow className="image">
                            {isLoading ? (
                              <div className="ion-text-center">
                                <IonIcon size="large" icon={heart}></IonIcon>
                              </div>
                            ) : (
                              <IonImg
                                className="image"
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
                                <IonCol className="td-left">
                                  {" "}
                                  Chain : 
                                  <IonCol className="td-right">
                                    {nft?.chain}
                                  </IonCol>
                                </IonCol>
                              </IonRow>
                              <IonRow>
                                <IonCol className="td-left">
                                  Contract Type: 
                                  <IonCol className="td-right">
                                    {nft?.contract_type}
                                  </IonCol>
                                </IonCol>
                              </IonRow>

                              <IonRow>
                                <IonCol className="td-left" size="12">
                                  {" "}
                                  Token_Id:
                                  <IonCol className="td-left1">
                                    {nft?.token_id}
                                  </IonCol>
                                </IonCol>
                              </IonRow>
                              <IonRow>
                                <IonCol className="td-left">
                                  Owner of: 
                                  <IonCol className="td-right">
                                    {nft?.owner_of}
                                  </IonCol>
                                </IonCol>
                              </IonRow>
                              <IonRow>
                                <IonCol className="td-left">
                                  Token Address: 
                                  <IonCol className="td-right">
                                    {nft?.token_address}
                                  </IonCol>
                                </IonCol>
                              </IonRow>
                              <IonRow>
                                <IonCol className="td-left">
                                  Block number: 
                                  <IonCol className="td-right">
                                    {nft?.block_number}
                                  </IonCol>
                                </IonCol>
                              </IonRow>
                              <IonRow>
                                <IonCol className="td-left">
                                  Block number minted: 
                                  <IonCol className="td-right">
                                    {nft?.block_number_minted}
                                  </IonCol>
                                </IonCol>
                              </IonRow>
                              <IonRow>
                                <IonCol className="td-left">
                                  Token Hash: 
                                  <IonCol className="td-right">
                                    {nft?.token_hash}
                                  </IonCol>
                                </IonCol>
                              </IonRow>
                              <IonRow>
                                <IonCol className="td-left">
                                  Last Token Uri Sync:
                                  <IonCol className="td-right">
                                    {nft?.last_token_uri_sync}
                                  </IonCol>
                                </IonCol>
                              </IonRow>
                              <IonRow>
                                <IonCol className="td-left">
                                  Last Metadata Sync: 
                                  <IonCol className="td-right">
                                    {nft?.last_metadata_sync}
                                  </IonCol>
                                </IonCol>
                              </IonRow>
                            </IonGrid>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            )
          )
        )}
      </IonGrid>
    </>
  );
}
