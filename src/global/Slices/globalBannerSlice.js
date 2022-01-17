const initialGlobalBannerState = {
    bannerShow: false,
    bannerTexts: {},
    bannerButtons: []
}

// Global Banner reducer
const globalBanner = (state = initialGlobalBannerState, action) => {
    switch(action.type) {
        case 'globalBanner/setBannerShow': {
            return {
                ...state,
                bannerShow: action.payload
            };
        }
        case 'globalBanner/setBannerTexts': {
            return {
                ...state,
                bannerTexts: action.payload
            };
        }
        case 'globalBanner/setBannerButtons': {
            return {
                ...state,
                bannerButtons: action.payload
            };
        }
        default: 
            return state;
    }
}

export default globalBanner;