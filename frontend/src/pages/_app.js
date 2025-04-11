import { AuthProvider } from '../context/AuthContext';
import { FavoriteProvider } from '../context/FavoriteContext';

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
    return (
        <AuthProvider>
            <FavoriteProvider>
                <Component {...pageProps} />
            </FavoriteProvider>
        </AuthProvider>
    );
}

export default MyApp;
