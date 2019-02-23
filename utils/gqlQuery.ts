import config from '../config';

export const gqlQuery = async (query, variables) => {
  const res = await fetch(config.gqlUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      variables
    })
  });

  return res.json();
};
