import { FC, Fragment } from 'react';
import { Emoji } from '../ui/Emoji';
import { splitTextToEmojiArray } from '../utils/emoji';

interface IProps {
  children: string;
}

export const WithEmoji: FC<IProps> = ({ children }) => {
  return (
    <>
      {splitTextToEmojiArray(children).map((elm, index) => {
        if (elm.type === 'text') {
          return <Fragment key={index}>{elm.value}</Fragment>;
        }

        if (elm.type === 'emoji') {
          return <Emoji key={index} name={elm.name} />;
        }
      })}
    </>
  );
};
