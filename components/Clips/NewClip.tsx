import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import ruLocale from 'date-fns/locale/ru';
import gql from 'graphql-tag';
import Router from 'next/router';
import { FC, useState } from 'react';
import { Mutation, Query } from 'react-apollo';
import styled from 'styled-components';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { SWRow } from '../../ui/SWRow';
import { TwitchClipPlayer } from '../../ui/TwitchClipPlayer';
import { VideoPreview } from '../../ui/VideoPreview';
import { parseSource } from '../../utils/parseSoruce';

const GET_TWITCH_CLIP = gql`
  query getTwitchClip($sourceUrl: String!, $id: String!) {
    clip(id: $id) {
      id
      title
      thumbnail
      createdAt
    }
    twitchClip(sourceUrl: $sourceUrl) {
      slug
      title
    }
  }
`;

const CREATE_CLIP = gql`
  mutation createClip($data: ClipCreateInput!) {
    createClip(data: $data) {
      id
    }
  }
`;

const Box = styled.div`
  width: 600px;
`;

const PlayerBox = styled.div`
  border-radius: 4px;
  overflow: hidden;
  margin: 4px 0;
`;

const Bottom = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
`;

const DupBox = styled.div`
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const DupMessage = styled.span`
  padding: 10px 0;
`;

const DupVideoBox = styled.div`
  width: 300px;
  margin: 5px 0;
`;

export const NewClip: FC = () => {
  const [title, setTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [nfws, setNfws] = useState(false);
  const [spoiler, setSpoiler] = useState(false);
  const soruceData = parseSource(sourceUrl);
  const exClip = 'https://www.twitch.tv/sygeman/clip/DiligentTallQuailRedCoat';

  return (
    <Mutation
      mutation={CREATE_CLIP}
      onCompleted={data => {
        Router.push(`/clip?id=${data.createClip.id}`);
      }}
    >
      {createClip => (
        <Box>
          <Input
            autoFocus
            placeholder={`Ссылка на клип, например: ${exClip}`}
            onChange={e => setSourceUrl(e.target.value)}
          />
          <Query
            query={GET_TWITCH_CLIP}
            variables={{
              sourceUrl,
              id: soruceData && soruceData.payload.sourceId
            }}
            skip={!soruceData}
          >
            {({ loading, error, data }) => {
              if (loading || error || !data || !data.twitchClip) {
                return null;
              }

              const clip = data.clip;

              if (clip) {
                const date =
                  clip &&
                  clip.createdAt &&
                  distanceInWordsToNow(clip.createdAt, {
                    locale: ruLocale
                  }) + ' назад';

                return (
                  <DupBox>
                    <DupMessage>Этот клип уже кидали</DupMessage>
                    <DupVideoBox>
                      <VideoPreview
                        onClick={() => {
                          Router.push(
                            {
                              pathname: Router.route,
                              query: {
                                clipId: clip.id,
                                backPath: Router.asPath,
                                ...Router.query
                              }
                            },
                            {
                              pathname: '/clip',
                              query: { id: clip.id }
                            },
                            {
                              shallow: true
                            }
                          );
                        }}
                        cover={clip.cover}
                        date={date}
                      />
                    </DupVideoBox>
                  </DupBox>
                );
              }

              return (
                <>
                  <Input
                    placeholder={data.twitchClip.title}
                    maxLength={100}
                    onChange={e => setTitle(e.target.value)}
                  />

                  <PlayerBox>
                    <TwitchClipPlayer sourceId={soruceData.payload.sourceId} />
                  </PlayerBox>

                  <SWRow
                    title="NSFW"
                    description="Обнажённая натура, гуро, порнография и обсценная лексика"
                    onChange={() => setNfws(!nfws)}
                    active={nfws}
                    inactiveColor={'#1D1E30'}
                  />

                  <SWRow
                    title="Спойлер"
                    description="Информация о сюжете книги, фильма или компьютерной игры, которая, будучи преждевременно раскрытой, лишает некоторых читателей части удовольствия от сюжета."
                    onChange={() => setSpoiler(!spoiler)}
                    active={spoiler}
                    inactiveColor={'#1D1E30'}
                  />

                  <Bottom>
                    <Button
                      onClick={() =>
                        createClip({
                          variables: {
                            data: {
                              id: data.twitchClip.slug,
                              title,
                              nfws,
                              spoiler
                            }
                          }
                        })
                      }
                    >
                      Отправить
                    </Button>
                  </Bottom>
                </>
              );
            }}
          </Query>
        </Box>
      )}
    </Mutation>
  );
};
