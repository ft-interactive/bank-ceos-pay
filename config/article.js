export default () => ({ // eslint-disable-line

  // link file UUID
  id: '079f2cbe-501c-11e7-bfb8-997009366969',

  // canonical URL of the published page
  // https://ig.ft.com/sites/bank-ceo-compensation/2017 get filled in by the ./configure script
  url: 'https://ig.ft.com/sites/bank-ceo-compensation/2017',

  // To set an exact publish date do this:
  //       new Date('2016-05-17T17:11:22Z')
  publishedDate: new Date(),

  headline: 'Bank chief executives\' pay 2016',

  // summary === standfirst (Summary is what the content API calls it)
  summary: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',

  topic: {
    name: 'Banks',
    url: 'https://www.ft.com/companies/banks',
  },

  relatedArticle: {
    text: 'Related article »',
    url: 'https://en.wikipedia.org/wiki/Politics_and_the_English_Language',
  },

  mainImage: {
    title: '',
    description: '',
    credit: '',
    url: 'https://image.webservices.ft.com/v1/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2Fc4bf0be4-7c15-11e4-a7b8-00144feabdc0?source=ig&fit=scale-down&width=700',
    width: 2048, // ensure correct width
    height: 1152, // ensure correct height
  },

  // Byline can by a plain string, markdown, or array of authors
  // if array of authors, url is optional
  byline: [
    { name: 'Laura Noonan', url: 'https://www.ft.com/stream/ed45acb9-9da0-35fd-94ae-184c05d5ba36' },
    { name: 'David Blood', url: 'https://www.ft.com/david-blood' },
  ],

  // Appears in the HTML <title>
  title: 'Bank chief executives\' pay 2016',

  // meta data
  description: '',

  /*
  TODO: Select Twitter card type -
        summary or summary_large_image

        Twitter card docs:
        https://dev.twitter.com/cards/markup
  */
  twitterCard: 'summary',

  /*
  TODO: Do you want to tweak any of the
        optional social meta data?
  */
  // General social
  // socialImage: '',
  // socialHeadline: '',
  // socialDescription: '',
  // twitterCreator: '@author's_account', // shows up in summary_large_image cards

  // TWEET BUTTON CUSTOM TEXT
  // tweetText: '',
  // twitterRelatedAccounts: ['authors_account_here', 'ftdata'], // Twitter lists these as suggested accounts to follow after a user tweets (do not include @)

  // Fill out the Facebook/Twitter metadata sections below if you want to
  // override the General social options above

  // TWITTER METADATA (for Twitter cards)
  // twitterImage: '',
  // twitterHeadline: '',
  // twitterDescription: '',

  // FACEBOOK
  // facebookImage: '',
  // facebookHeadline: '',
  // facebookDescription: '',

  //ADVERTISING
  ads: {
    // ad unit hierarchy makes ads more granular. Start with ft.com and /companies /markets /world as appropriate to your story
    gptAdunit: 'ft.com/companies/european',
    // granular targeting is optional and will be specified by the ads team
    dftTargeting: '',
  },

  tracking: {

    /*

    Microsite Name

    e.g. guffipedia, business-books, baseline.
    Used to query groups of pages, not intended for use with
    one off interactive pages. If you're building a microsite
    consider more custom tracking to allow better analysis.
    Also used for pages that do not have a UUID for whatever reason
    */
    // micrositeName: '',

    /*
    Product name

    This will usually default to IG
    however another value may be needed
    */
    // product: '',
  },
});
