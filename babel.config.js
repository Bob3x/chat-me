module.exports = function (api) {
    api.cache(true);

    return {
        presets: ["babel-preset-expo"],
        plugins: [
            ["@babel/plugin-transform-private-methods", { loose: true }],
            ["@babel/plugin-transform-class-properties", { loose: true }],
            ["@babel/plugin-transform-private-property-in-object", { loose: true }],
            [
                "module:react-native-dotenv",
                {
                    moduleName: "@env",
                    path: ".env",
                    blacklist: null,
                    whitelist: [
                        "EXPO_PUBLIC_FIREBASE_API_KEY",
                        "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN",
                        "EXPO_PUBLIC_FIREBASE_PROJECT_ID",
                        "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET",
                        "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
                        "EXPO_PUBLIC_FIREBASE_APP_ID"
                    ],
                    safe: false,
                    allowUndefined: true
                }
            ]
        ]
    };
};
