import gql from 'graphql-tag';
import { createRef, FC } from 'react';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';
import StreamsProvider from '../../../providers/Streams';
import { Input } from '../../../ui/Input';
import Stream from './Stream';

const ADD_STREAM = gql`
  mutation addStream($channel: String!) {
    addStream(channel: $channel) {
      channel
    }
  }
`;

const Box = styled.div`
  margin: 0 auto;
  width: 800px;
  margin-top: 20px;
  border-radius: 5px;
  overflow: hidden;
  background: ${({ theme }) => theme.dark2Color};
`;

const StreamBox = styled.div`
  margin-bottom: 2px;

  :last-child {
    margin-bottom: 0;
  }
`;

const AddStreamForm = styled.div`
  margin-top: 2px;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
`;

const StreamsManage: FC = () => {
  const textInput = createRef<HTMLInputElement>();

  return (
    <Box>
      <StreamsProvider>
        {({ streams }) => (
          <>
            {streams.map(stream => (
              <StreamBox key={stream.id}>
                <Stream stream={stream} />
              </StreamBox>
            ))}
          </>
        )}
      </StreamsProvider>
      <AddStreamForm>
        <Mutation mutation={ADD_STREAM}>
          {addStream => (
            <Input
              autoFocus
              ref={textInput}
              placeholder="Введите название Twitch канала и нажмите Enter"
              onKeyPress={e => {
                const channel = textInput.current.value.trim();

                if (e.key === 'Enter' && channel.length > 0) {
                  addStream({ variables: { channel } });
                  textInput.current.value = '';
                }
              }}
            />
          )}
        </Mutation>
      </AddStreamForm>
    </Box>
  );
};

export default StreamsManage;
