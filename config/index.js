import axios from 'axios';
import article from './article';
import getFlags from './flags';
import getOnwardJourney from './onward-journey';

export default async () => {
  const d = await article();
  const flags = await getFlags();
  const onwardJourney = await getOnwardJourney();
  const berthaId = '1Yqxt-9H6K8oTs3ZPlFhJJBKx9e3zT7i6RoW-ctH-RqA';
  const endpoint = `http://bertha.ig.ft.com/view/publish/gss/${berthaId}/data`;
  let cards = {};
  let data;

  try {
    const res = await axios(endpoint);
    data = res.data;
  } catch (e) {
    console.log('Error getting content from Bertha', e);
  }

  try {
    cards = await Promise.all(
      data.map(async (card) => {
        const url = `https://ig.ft.com/onwardjourney/v1/thing/${card.y2016.topicid}/json?limit=5`;

        try {
          const res = await axios(url);

          // Filter this item out.
          card.links = res.data.items.filter(v => v.id !== d.id); // eslint-disable-line no-param-reassign
        } catch (e) {
          console.error(`Error getting Onward Journey for ${card.ceo.name}`);

          console.log(url);

          card.links = []; // eslint-disable-line no-param-reassign
        }

        return card;
      }));
  } catch (e) {
    console.error(e);
  }

  return {
    ...d,
    flags,
    onwardJourney,
    data,
    cards,
  };
};
