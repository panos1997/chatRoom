export const GlobalUtilities = {
    pressEnterOnKeyboard: (e, actionsList) => {
        if(e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            actionsList && actionsList.forEach(action => {
                action && action();
            })
        }
    }    
}