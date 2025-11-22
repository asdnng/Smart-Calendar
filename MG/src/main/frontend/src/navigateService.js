// This provides access to React Router's navigate function from non-React contexts, like Axios interceptors.

let navigateFunction = null;

// Called inside a React component to set the navigator
export const setGlobalNavigator = (navigator) => {
    navigateFunction = navigator;
};

// Called inside the Axios interceptor to trigger navigation
export const navigateTo = (path) => {
    if (navigateFunction) {
        navigateFunction(path);
        return true;
    }
    console.error("Navigation function not initialized.");
    return false;
};