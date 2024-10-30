import React from 'react';
import type { DocumentContext } from 'next/document';
import Document, { Head, Html, Main, NextScript } from 'next/document';

import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';

const MyDocument = () => {
    return (
        <Html lang="en-US">
            <Head>
                <link rel="icon" href="/assets/favicon/favicon.ico" />
                <link rel="icon" href="/assets/favicon/favicon-16x16.png" type="image/png" sizes="16x16" />
                <link rel="icon" href="/assets/favicon/favicon-32x32.png" type="image/png" sizes="32x32" />
                <link rel="icon" href="/assets/favicon/android-chrome-192x192.png" type="image/png" sizes="192x192" />
                <link href="/assets/favicon/android-chrome-512x512.png" rel="icon" type="image/png" sizes="512x512" />
                <link rel="apple-touch-icon" href="/assets/favicon/apple-touch-icon.png" />

                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap" rel="stylesheet" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
};
MyDocument.getInitialProps = async (ctx: DocumentContext) => {
    const cache = createCache();
    const originalRenderPage = ctx.renderPage;
    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: App => props => (
                <StyleProvider cache={cache}>
                    <App {...props} />
                </StyleProvider>
            ),
        });

    const initialProps = await Document.getInitialProps(ctx);
    const style = extractStyle(cache, true);
    return {
        ...initialProps,
        styles: (
            <>
                {initialProps.styles}
                <style dangerouslySetInnerHTML={{ __html: style }} />
            </>
        ),
    };
};
export default MyDocument;
