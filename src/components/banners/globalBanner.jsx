import React from "react";
import ButtonComponent from '../buttons/buttonComponent';

const GlobalBanner = ({bannerShow, bannerTexts, bannerButtons}) => {
    return(
        bannerShow && <div className='globalBannerWrapper'>
            <div className='globalBanner flex-center-col'>
                <h3 className='globalBanner-title'>
                    {bannerTexts.title}
                </h3>
                <p className='globalBanner-description'>
                    {bannerTexts.description}
                </p>
                <div className='flex-center-justify-around-row full-width'>
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
                </div>
            </div>
        </div>
    )
}

export default GlobalBanner;