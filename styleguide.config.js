/* eslint-disable flowtype/require-valid-file-annotation */
/* eslint-disable import/no-nodejs-modules */
const path = require('path');
const glob = require('glob');

const firstLetterIsUppercase = (string) => {
    const first = string.charAt(0);
    return first === first.toUpperCase();
};

const compareFolderName = (folderA, folderB) => {
    folderA = path.basename(folderA).toUpperCase();
    folderB = path.basename(folderB).toUpperCase();

    if (folderA < folderB) {
        return -1;
    }

    if (folderA > folderB) {
        return 1;
    }

    return 0;
};

module.exports = { // eslint-disable-line
    require: [
        'core-js/fn/array/includes',
        'core-js/fn/array/from',
        './src/Sulu/Bundle/AdminBundle/Resources/js/containers/Application/global.scss',
        './src/Sulu/Bundle/AdminBundle/Resources/js/containers/Application/styleguidist.scss',
    ],
    styles: {
        Playground: {
            preview: {
                background: '#f5f5f5',
            },
        },
    },
    sections: [
        {
            name: 'Components',
            components: function() {
                let folders = glob.sync('./src/Sulu/Bundle/*/Resources/js/components/*');
                // filter out higher order components
                folders = folders
                    .filter((folder) => firstLetterIsUppercase(path.basename(folder)))
                    .sort(compareFolderName);

                return folders.map((folder) => {
                    const component = path.basename(folder);

                    return path.join(folder, component + '.js');
                });
            },
        },
        {
            name: 'Containers',
            components: function() {
                let folders = glob.sync('./src/Sulu/Bundle/*/Resources/js/containers/*');
                // filter out containers
                folders = folders
                    .filter((folder) => firstLetterIsUppercase(path.basename(folder)))
                    .sort(compareFolderName);

                return folders.map((folder) => {
                    const component = path.basename(folder);

                    return path.join(folder, component + '.js');
                });
            },
        },
        {
            name: 'Services',
            sections: (function() {
                let folders = glob.sync('./src/Sulu/Bundle/*/Resources/js/services/*');

                return folders
                    .filter((folder) => path.basename(folder) !== 'index.js')
                    .sort(compareFolderName)
                    .map((folder) => {
                        const component = path.basename(folder);

                        return {name: component, content: folder + '/README.md'};
                    });
            })(),
        },
        {
            name: 'Views',
            sections: (function() {
                let folders = glob.sync('./src/Sulu/Bundle/*/Resources/js/views/*');

                return folders
                    .map((folder) => {
                        const component = path.basename(folder);
                        return {name: component, content: folder + '/README.md'};
                    });
            })(),
        },
        {
            name: 'Higher-Order components',
            sections: (function() {
                let folders = glob.sync('./src/Sulu/Bundle/*/Resources/js/components/*');
                folders = folders.filter((folder) => !firstLetterIsUppercase(path.basename(folder)));

                return folders
                    .filter((folder) => path.basename(folder) !== 'index.js')
                    .sort(compareFolderName)
                    .map((folder) => {
                        const component = path.basename(folder);

                        return {name: component, content: folder + '/README.md'};
                    });
            })(),
        },
    ],
    webpackConfig: {
        devServer: {
            disableHostCheck: true,
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                },
                {
                    test: /\.css/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: false,
                            },
                        },
                    ],
                },
                {
                    test: /\.(scss)$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                camelCase: true,
                                importLoaders: 1,
                                localIdentName: '[local]--[hash:base64:10]',
                            },
                        },
                        'postcss-loader',
                    ],
                },
                {
                    test:/\.(jpg|gif|png)(\?.*$|$)/,
                    use: [
                        {
                            loader: 'file-loader',
                        },
                    ],
                },
                {
                    test:/\.(svg|ttf|woff|woff2|eot)(\?.*$|$)/,
                    use: [
                        {
                            loader: 'file-loader',
                        },
                    ],
                },
            ],
        },
    },
};
