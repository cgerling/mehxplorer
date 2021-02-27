'use strict';

const BASE_URL = 'https://api.spotify.com/v1';
const AUTH_URL = 'https://accounts.spotify.com/authorize';

const spotifyService = {};

{
    spotifyService.authorize = authorize;
    spotifyService.getAlbum = getAlbum;
    spotifyService.getArtist = getArtist;
    spotifyService.getTopTracks = getTopTracks;
    spotifyService.getRelatedArtists = getRelatedArtists;
    spotifyService.getArtistAlbum = getArtistAlbum;
    spotifyService.verifyAuth = verifyAuth;
    spotifyService.search = search;

    function expired(token) {
        let expiration = new Date(token.generated);
        expiration.setSeconds(expiration.getSeconds() + parseInt(token.expires_in));

        return Date.now() > expiration;
    }

    function mapToken(params = []) {
        let token = {
            generated: Date.now()
        };

        for (let data of params) {
            token[data[0]] = data[1];
        }

        return token;
    }

    function getUrlParams() {
        let urlParams = window.location.hash;
        urlParams = urlParams !== '' ? urlParams.split('&').map(item => item.replace('#', '').split('=')) : [];

        return urlParams;
    }

    function authFetch(path = '') {
        let token = storageService.get('token');
        return fetch(path, {
            headers: {
                'Authorization': `${token.token_type} ${token.access_token}`
            }
        });
    }

    function verifyAuth() {
        let urlParams = getUrlParams();
        let token = mapToken(urlParams);

        if (Object.keys(token).length === 1)
            token = storageService.get('token');

        if (!token || expired(token)) {
            spotifyService.authorize();
        } else if (urlParams.length > 0) {
            storageService.add('token', token);
            router.redirect('index.html');
        }
    }

    function authorize() {
        const CLIENT_ID = 'cdea4af68ab44184a9ed27902782b388';
        const REDIRECT_URL = 'http://localhost:8080';

        router.redirect(`${AUTH_URL}?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URL}`);
    }

    function search(term, types = ['album', 'artist', 'track', 'playlist']) {
        return authFetch(`${BASE_URL}/search?q=${term.split(' ').join('+')}&type=${types.join(',')}`);
    }

    function getAlbum(album_id = '') {
        return authFetch(`${BASE_URL}/albums/${album_id}`);
    }

    function getArtist(artist_id = '') {
        return authFetch(`${BASE_URL}/artists/${artist_id}`);
    }

    function getTopTracks(artist_id = '', country = 'BR') {
        return authFetch(`${BASE_URL}/artists/${artist_id}/top-tracks?country=${country}`);
    }

    function getRelatedArtists(artist_id = '') {
        return authFetch(`${BASE_URL}/artists/${artist_id}/related-artists`);
    }

    function getArtistAlbum(artist_id = '') {
        return authFetch(`${BASE_URL}/artists/${artist_id}/albums`);
    }
}