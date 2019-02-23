const commonConfig = {
  emojiUrl: `https://ravepro.ams3.digitaloceanspaces.com/emojis/`
};

const devConfig = {
  baseUrl: 'http://localhost:7000/',
  apiUrl: 'http://localhost:3000/',
  gqlUrl: 'http://localhost:3000/graphql',
  wsgqlUrl: 'ws://localhost:3000/graphql',
  cookieOptions: {}
};

const prodConfig = {
  baseUrl: 'https://twitchru.com/',
  apiUrl: 'https://api.twitchru.com/',
  gqlUrl: 'https://api.twitchru.com/graphql',
  wsgqlUrl: 'wss://api.twitchru.com/graphql',
  cookieOptions: {
    domain: '.twitchru.com'
  }
};

const isProduction = process.env.NODE_ENV === 'production';

export default { ...commonConfig, ...(isProduction ? prodConfig : devConfig) };
