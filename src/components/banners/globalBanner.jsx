import React from "react";
import ButtonComponent from '../buttons/buttonComponent';

const GlobalBanner = ({bannerShow, bannerTexts, bannerButtons, bannerExtraClasses}) => {
    return(
        bannerShow && <div className='globalBannerWrapper'>
            <div className={`globalBanner flex-center-col ${bannerExtraClasses.globalBanner}`}>
                <div className='header full-width'>
                    {bannerTexts.title}
                </div>
                <div className={`description ${bannerExtraClasses.description}`}>
                    {bannerTexts.description}
                </div>
                {bannerButtons?.length > 0 && <div className='flex-center-justify-around-row full-width'>
                    {
                        bannerButtons.map((button, index) => (
                            <ButtonComponent 
                                key={index}
                                btnContent={button.content}
                                btnProps={{
                                    className: button.classes,
                                    style: button.style,
                                    onClick: button.clickListener
                                }}
                            />
                        ))
                    }
                </div>}
            </div>
        </div>
    )
}

export default GlobalBanner;