/* eslint-disable simple-import-sort/imports */
import { useSafeState } from 'ahooks';
import React, { useMemo } from 'react';
import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookMessengerIcon,
    FacebookMessengerShareButton,
    FacebookShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    TelegramIcon,
    TelegramShareButton,
    TwitterShareButton,
    ViberIcon,
    ViberShareButton,
    WhatsappIcon,
    WhatsappShareButton,
    XIcon,
} from 'react-share';

import { Modal } from 'antd';

import { useWindowSize } from '@library/hooks';

import IthriveButton from '../iThrive-button';
import { EducareInputUi } from '../educare-input';

export type TEducareShareDetail = {
    encryptedRoute: string;
    id: string;
    title: string;
};

type EducareShareProps = {
    state: [TEducareShareDetail | null, React.Dispatch<React.SetStateAction<TEducareShareDetail | null>>];
    onShare: () => void;
};

export const DeepLinkToken = {
    EncryptedRoutes: {
        social_post_details: '_1/',
        // event_details : '_2/',
        home_office_details: '_3/',
        // scholarship_details : '_4/',
        // housing_and_accommodation_details : '_5/',
        // job_details : '_6/',
        // marketplace_details : '_7/',
    },
    DEEP_LINK_SCHEMA: 'https',
    DEEP_LINK_HOST: 'www.stucommunify.co.uk',
    DEEP_LINK_PATH: 'nativeshare',
};

function getShareUrl({ encryptedRoute, id }: { encryptedRoute: string; id: string }) {
    const normalText = encryptedRoute + id;
    const enc = window.btoa(normalText);
    return `${DeepLinkToken.DEEP_LINK_SCHEMA}://${DeepLinkToken.DEEP_LINK_HOST}/${DeepLinkToken.DEEP_LINK_PATH}?ref=${enc}`;
}

function Share({ state, onShare }: EducareShareProps) {
    const [detail, setDetail] = state;
    const { encryptedRoute, id, title } = (!!detail ? detail : {}) as TEducareShareDetail;
    // const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}` : `https://dev.stucommunify.co.uk/`;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const currentUrl = useMemo(() => getShareUrl({ encryptedRoute, id }), [state]);
    const shareUrl = currentUrl;

    const [isCopied, setIsCopied] = useSafeState<boolean>(false);

    const copyToClipboard = () => {
        navigator.clipboard
            .writeText(currentUrl)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 3000);
            })
            .catch(err => {});
    };

    return (
        <>
            <div className="flex flex-wrap justify-start gap-2 mt-5">
                <FacebookShareButton url={shareUrl} onClick={onShare}>
                    <FacebookIcon size={40} round />
                </FacebookShareButton>
                <FacebookMessengerShareButton url={shareUrl} appId="521270401588372">
                    <FacebookMessengerIcon size={40} round />
                </FacebookMessengerShareButton>

                <TwitterShareButton url={shareUrl} title={title} onClick={onShare}>
                    <XIcon size={40} round />
                </TwitterShareButton>

                <TelegramShareButton url={shareUrl} title={title} onClick={onShare}>
                    <TelegramIcon size={40} round />
                </TelegramShareButton>

                <WhatsappShareButton url={shareUrl} title={title} separator=":: " onClick={onShare}>
                    <WhatsappIcon size={40} round />
                </WhatsappShareButton>

                <LinkedinShareButton url={shareUrl} onClick={onShare}>
                    <LinkedinIcon size={40} round />
                </LinkedinShareButton>

                {/*<PinterestShareButton url={String(window.location)} media={`${String(window.location)}/${educareMLogo}`}*/}
                {/*                      onClick={onShare}>*/}
                {/*    <PinterestIcon size={40} round />*/}
                {/*</PinterestShareButton>*/}

                {/*<VKShareButton url={shareUrl} image={`${String(window.location)}/${educareMLogo}`} onClick={onShare}>*/}
                {/*    <VKIcon size={40} round />*/}
                {/*</VKShareButton>*/}

                {/*<OKShareButton url={shareUrl} image={`${String(window.location)}/${educareMLogo}`}*/}
                {/*               description={description} onClick={onShare}>*/}
                {/*    <OKIcon size={40} round />*/}
                {/*</OKShareButton>*/}

                {/*<RedditShareButton url={shareUrl} title={title} windowWidth={660} windowHeight={460} onClick={onShare}>*/}
                {/*    <RedditIcon size={40} round />*/}
                {/*</RedditShareButton>*/}

                {/*<GabShareButton url={shareUrl} title={title} windowWidth={660} windowHeight={640} onClick={onShare}>*/}
                {/*    <GabIcon size={40} round />*/}
                {/*</GabShareButton>*/}

                {/*<TumblrShareButton url={shareUrl} title={title} onClick={onShare}>*/}
                {/*    <TumblrIcon size={40} round />*/}
                {/*</TumblrShareButton>*/}

                {/*<LivejournalShareButton url={shareUrl} title={title} description={description} onClick={onShare}>*/}
                {/*    <LivejournalIcon size={40} round />*/}
                {/*</LivejournalShareButton>*/}

                {/*<MailruShareButton url={shareUrl} title={title} description={description} onClick={onShare}>*/}
                {/*    <MailruIcon size={40} round />*/}
                {/*</MailruShareButton>*/}

                <EmailShareButton url={shareUrl} subject={title} body="description" onClick={onShare}>
                    <EmailIcon size={40} round />
                </EmailShareButton>

                <ViberShareButton url={shareUrl} title={title} onClick={onShare}>
                    <ViberIcon size={40} round />
                </ViberShareButton>

                {/*<WorkplaceShareButton url={shareUrl} quote={title} onClick={onShare}>*/}
                {/*    <WorkplaceIcon size={40} round />*/}
                {/*</WorkplaceShareButton>*/}

                {/*<LineShareButton url={shareUrl} title={title} onClick={onShare}>*/}
                {/*    <LineIcon size={40} round />*/}
                {/*</LineShareButton>*/}

                {/*<WeiboShareButton url={shareUrl} title={title} image={`${String(window.location)}/${educareMLogo}`}*/}
                {/*                  onClick={onShare}>*/}
                {/*    <WeiboIcon size={40} round />*/}
                {/*</WeiboShareButton>*/}

                {/*<PocketShareButton url={shareUrl} title={title} onClick={onShare}>*/}
                {/*    <PocketIcon size={40} round />*/}
                {/*</PocketShareButton>*/}

                {/*<InstapaperShareButton url={shareUrl} title={title} description={description} onClick={onShare}>*/}
                {/*    <InstapaperIcon size={40} round />*/}
                {/*</InstapaperShareButton>*/}

                {/*<HatenaShareButton url={shareUrl} title={title} windowWidth={660} windowHeight={460} onClick={onShare}>*/}
                {/*    <HatenaIcon size={40} round />*/}
                {/*</HatenaShareButton>*/}
            </div>
            <div className="flex gap-4 flex-col pb-10">
                <div className="mt-5">Copy Link</div>
                <div className="flex items-center w-full gap-3">
                    <div className="w-full">
                        <EducareInputUi type="text" size="large" label="" onChange={() => {}} name="link" value={currentUrl} />
                    </div>

                    <IthriveButton
                        onClick={copyToClipboard}
                        className="bg-primary text-white pb-2 h-full"
                        variant={isCopied ? 'filled' : 'reset'}
                        type="default">
                        {isCopied ? `Copied !` : `Copy`}
                    </IthriveButton>
                </div>
            </div>
        </>
    );
}

export default function EducareShareModal({ state, onShare }: EducareShareProps) {
    const { isSm } = useWindowSize();
    const [detail, setDetail] = state;
    return (
        <Modal
            destroyOnClose
            centered
            forceRender
            footer={null}
            maskClosable={false}
            open={!!detail}
            width={isSm ? '95vw' : '50vw'}
            onCancel={() => setDetail(null)}
            title="Share">
            {!!detail && <Share state={state} onShare={onShare} />}
        </Modal>
    );
}
