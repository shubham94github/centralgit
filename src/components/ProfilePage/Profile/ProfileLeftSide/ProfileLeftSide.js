import React, { memo, useEffect, useState } from "react";
import { H1, P16 } from "@components/_shared/text";
import { isEmpty } from "@utils/js-helpers";
import TagButtons from "@components/_shared/buttons/TagButtons";
import { array, arrayOf, bool, number, shape, string } from "prop-types";
import ReactPlayer from "react-player";
import { getVideoAttributes } from "@api/commonApi";
import { getFileThumbnails } from "@api/fileUploadingApi";
import LoadingOverlay from "@components/_shared/LoadingOverlay";
import { Icons } from "@icons";
import { openWebsite } from "@utils/openWebsiteHelper";
import { Link } from "react-router-dom";
const tractionIcon = Icons.tractionIcon();
const overviewIcon = Icons.overviewIcon();

const ProfileLeftSide = ({
  isRetailer,
  urlOfCompanyWebsite,
  companyType,
  businessModel,
  companyStatus,
  targetMarket,
  platformPartners,
  integrationTiming,
  clientsList,
  numberOfClients,
  presenceInCountries,
  tags,
  videoInterview,
  documents,
}) => {
  const [isPlayVideo, setIsPlayVideo] = useState(false);
  const [videoAttributes, setVideoAttributes] = useState(null);
  const [isLoadingThumbnails, setIsLoadingThumbnails] = useState(false);
  const [profileDocuments, setProfileDocuments] = useState(documents);

  const isVisibleTraction =
    !isRetailer &&
    (!!platformPartners.length ||
      integrationTiming ||
      !!numberOfClients ||
      !!clientsList.length ||
      !!presenceInCountries.length);

  const onStopVideo = () => setIsPlayVideo(false);

  const getVideoInfo = async () => {
    if (!videoInterview.link) return;

    const videoAttributes = await getVideoAttributes(videoInterview.link);

    setVideoAttributes(videoAttributes);
  };

  useEffect(() => {
    const fetchThumbnailsForDocuments = async (documents) => {
      try {
        setIsLoadingThumbnails(true);
        const fileIds = documents.map((file) => file.thumbnailId);

        if (isEmpty(fileIds)) return setIsLoadingThumbnails(false);

        const thumbnails = await getFileThumbnails(fileIds);

        setProfileDocuments([
          ...profileDocuments,
          ...documents.map((file) => ({
            ...file,
            thumbnail: thumbnails.find(
              (item) => item.thumbnailId === file.thumbnailId
            ).image,
          })),
        ]);
      } finally {
        setIsLoadingThumbnails(false);
      }
    };

    const getVideoAttr = async (videoUrl) => {
      if (!videoUrl?.length) return;

      await getVideoInfo();
    };

    if (!isEmpty(documents)) fetchThumbnailsForDocuments(documents);

    if (videoInterview?.link) getVideoAttr(videoInterview.link);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playVideo = () => {
    if (!videoAttributes) return;

    setIsPlayVideo(true);
  };

  const openCompanyWebsite = () => openWebsite(urlOfCompanyWebsite);

  return (
    <div className="left-side-profile">
      <H1 className="text-gray text-start pb-3" bold>
        <span className="me-1">{overviewIcon}</span>
        Overview
      </H1>
      {isRetailer && (
        <div className="blue-link truncate" onClick={openCompanyWebsite}>
          {urlOfCompanyWebsite}
        </div>
      )}
      {!isRetailer && (
        <div className="company-short-info-wrapper">
          {companyType && (
            <div className="flex-item">
              <div className="title">
                <P16 className="text-gray" bold>
                  Company type
                </P16>
              </div>
              <div className="content">
                <P16 className="text-gray">{companyType}</P16>
              </div>
            </div>
          )}
          {businessModel && (
            <div className="flex-item">
              <div className="title">
                <P16 className="text-gray" bold>
                  Business model
                </P16>
              </div>
              <div className="content">
                <P16 className="text-gray">{businessModel}</P16>
              </div>
            </div>
          )}
          {companyStatus && (
            <div className="flex-item">
              <div className="title">
                <P16 className="text-gray" bold>
                  Status
                </P16>
              </div>
              <div className="content">
                <P16 className="text-gray">{companyStatus}</P16>
              </div>
            </div>
          )}
          {!!targetMarket.length && (
            <div className="flex-item">
              <div className="title">
                <P16 className="text-gray" bold>
                  Target markets
                </P16>
              </div>
              <div className="content">
                <P16 className="text-gray">
                  {targetMarket.map((market, index) => (
                    <span key={market + index}>
                      {index !== 0 && ", "}
                      {market}
                    </span>
                  ))}
                </P16>
              </div>
            </div>
          )}
          {isVisibleTraction && (
            <>
              <H1 className="text-gray text-start mt-40 pb-3" bold>
                <span className="me-1">{tractionIcon}</span>
                Information
              </H1>
              {!!platformPartners.length && (
                <div className="flex-item">
                  <div className="title">
                    <P16 className="text-gray" bold>
                      Platform Partners
                    </P16>
                  </div>
                  <div className="content">
                    <P16 className="text-gray">
                      {platformPartners.map((platform, index) => (
                        <span key={platform + index}>
                          {index !== 0 && ", "}
                          {platform}
                        </span>
                      ))}
                    </P16>
                  </div>
                </div>
              )}
              {integrationTiming && (
                <div className="flex-item">
                  <div className="title">
                    <P16 className="text-gray" bold>
                      Integration Timing
                    </P16>
                  </div>
                  <div className="content">
                    <P16 className="text-gray">{integrationTiming}</P16>
                  </div>
                </div>
              )}
              {!!numberOfClients && (
                <div className="flex-item">
                  <div className="title">
                    <div className="d-inline-block">
                      <P16 className="text-gray" bold>
                        Number of Clients
                      </P16>
                    </div>
                  </div>
                  <div className="content">
                    <div className="d-inline-block">
                      <P16 className="text-gray">{numberOfClients}</P16>
                    </div>
                  </div>
                </div>
              )}
              {!!clientsList.length && (
                <div className="flex-item">
                  <div className="title">
                    <P16 className="text-gray" bold>
                      Clients
                    </P16>
                  </div>
                  <div className="content">
                    <P16 className="text-gray">
                      {clientsList.map((exampleItem, index) => (
                        <span key={exampleItem + index}>
                          {index !== 0 && ", "}
                          <Link to={`/browse-page?client=${exampleItem}`}>
                            {exampleItem}
                          </Link>
                        </span>
                      ))}
                    </P16>
                  </div>
                </div>
              )}
              {!!presenceInCountries.length && (
                <div className="flex-item">
                  <div className="title">
                    <P16 className="text-gray" bold>
                      Presence in other Countries
                    </P16>
                  </div>
                  <div className="content">
                    <P16 className="text-gray">
                      {presenceInCountries.map((country, index) => (
                        <span key={country.id}>
                          {index !== 0 && ", "}
                          {country.name}
                        </span>
                      ))}
                    </P16>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
      {!isEmpty(tags) && !videoInterview && (
        <>
          <H1 className="text-black text-start mt-40 pb-3" bold>
            Associated tags
          </H1>
          <TagButtons tags={tags} />
        </>
      )}
      {videoInterview && (
        <div className="video-preview-poster">
          {isPlayVideo ? (
            <div className={`player`}>
              <ReactPlayer
                url={videoInterview.link}
                height="100%"
                width="100%"
                playing={isPlayVideo}
                onEnded={onStopVideo}
                controls={true}
              />
            </div>
          ) : (
            <>
              {videoAttributes?.thumbnail && (
                <img src={videoAttributes.thumbnail} alt={"video-poster"} />
              )}
              <span className="default-video-icon" onClick={playVideo}>
                {Icons.video()}
              </span>
            </>
          )}
          {isLoadingThumbnails && <LoadingOverlay />}
        </div>
      )}
    </div>
  );
};

ProfileLeftSide.propTypes = {
  isRetailer: bool.isRequired,
  urlOfCompanyWebsite: string,
  companyType: string,
  businessModel: string,
  companyStatus: string,
  targetMarket: array,
  platformPartners: array,
  integrationTiming: string,
  clientsList: array,
  numberOfClients: number,
  presenceInCountries: array,
  tags: array,
  documents: arrayOf(
    shape({
      id: number,
      filename: string,
      extension: string,
      size: number,
    })
  ),
  videoInterview: shape({
    link: string,
    id: number,
    title: string,
  }),
};

export default memo(ProfileLeftSide);
