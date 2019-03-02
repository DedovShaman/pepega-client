import { FC, memo, useEffect } from 'react';
import { getSDK } from './getSDK';

interface IProps {
  muted: boolean;
  channel: string;
}
export const TwitchPlayer: FC<IProps> = memo(({ muted, channel }) => {
  const playerId = `adplayer-${channel}`;
  let player;

  console.log('render', playerId, muted, channel);

  useEffect(() => {
    getSDK().then(Twitch => {
      player = new Twitch.Player(playerId, {
        channel,
        height: '100%',
        width: '100%',
        autoplay: true,
        muted,
        controls: false
      });

      player.addEventListener(Twitch.Player.PLAYING, () => {
        const qualities = player.getQualities();
        const lowQuality = qualities[qualities.length - 1];

        if (lowQuality && lowQuality.group !== '160p30') {
          player.pause();
        } else {
          player.setQuality('160p30');
        }
      });
    });
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '100%'
      }}
      id={playerId}
    />
  );
});
