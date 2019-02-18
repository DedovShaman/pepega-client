import gql from 'graphql-tag';
import Router from 'next/router';
import { FC, useState } from 'react';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { SWRow } from '../../ui/SWRow';
import { TwitchClipPlayer } from '../../ui/TwitchClipPlayer';
import { parseSource } from '../../utils/parseSoruce';

const CREATE_CLIP = gql`
  mutation newClip($data: NewClipInput!) {
    newClip(data: $data) {
      id
    }
  }
`;

const Box = styled.div`
  width: 600px;
`;

const Bottom = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
`;

export const NewClip: FC = () => {
  const [title, setTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [nfws, setNfws] = useState(false);
  const [spoiler, setSpoiler] = useState(false);
  const soruceData = parseSource(sourceUrl);

  return (
    <Mutation
      mutation={CREATE_CLIP}
      onCompleted={data => {
        Router.push(`/clip?id=${data.newClip.id}`);
      }}
    >
      {newClip => (
        <Box>
          <Input
            placeholder="Название"
            autoFocus
            maxLength={100}
            onChange={e => setTitle(e.target.value)}
          />
          <Input
            placeholder="Ссылка на Twitch клип"
            onChange={e => setSourceUrl(e.target.value)}
          />
          {soruceData && (
            <TwitchClipPlayer sourceId={soruceData.payload.sourceId} />
          )}
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
                newClip({
                  variables: {
                    data: {
                      title,
                      sourceUrl,
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
        </Box>
      )}
    </Mutation>
  );
};
