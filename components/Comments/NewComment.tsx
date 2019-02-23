import gql from 'graphql-tag';
import * as React from 'react';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';
import { Permission } from '../../helpers/Permission';
import { convertTextToEmojiCode } from '../../utils/emoji';

const NEW_COMMENT = gql`
  mutation newComment($data: NewCommentInput!) {
    newComment(data: $data) {
      id
    }
  }
`;

const MessagesBottom = styled.div`
  height: 60px;
  display: flex;
  position: relative;

  input {
    width: calc(100% - 20px);
    padding: 0 30px 0 10px;
    height: 36px;
    color: #fff;
    background: #00000040;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    outline: none;
    margin: auto;
  }
`;

interface IProps {
  clipId: string;
}

export default class extends React.Component<IProps> {
  public textInput: any;
  public lock: boolean = false;

  public render() {
    const { clipId } = this.props;

    return (
      <MessagesBottom>
        <Permission name="CREATE_COMMENT">
          {({ deny }) => {
            if (deny) {
              return (
                <input
                  disabled
                  type="text"
                  placeholder="Войдите чтобы писать комментарии"
                />
              );
            }

            return (
              <Mutation
                mutation={NEW_COMMENT}
                onCompleted={({ newComment }) => {
                  if (newComment) {
                    this.textInput.value = '';
                    this.lock = false;
                  }
                }}
              >
                {newComment => (
                  <>
                    <input
                      ref={input => {
                        this.textInput = input;
                      }}
                      maxLength={500}
                      type="text"
                      placeholder="Написать комментарий..."
                      onKeyPress={e => {
                        const content = convertTextToEmojiCode(
                          this.textInput.value.trim()
                        );

                        if (
                          e.key === 'Enter' &&
                          !this.lock &&
                          content.length > 0
                        ) {
                          this.lock = true;
                          newComment({
                            variables: { data: { clipId, content } }
                          });
                        }
                      }}
                    />
                  </>
                )}
              </Mutation>
            );
          }}
        </Permission>
      </MessagesBottom>
    );
  }
}
