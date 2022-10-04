export default function getAuthToken() {
    let authToken = localStorage.getItem(`${window.location.origin}-token`);
    return authToken;
}