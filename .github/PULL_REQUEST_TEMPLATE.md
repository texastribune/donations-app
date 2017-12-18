#### What's the plan?
[for PRs that haven't been fully implemented yet]

#### What's this PR do?

#### Why are we doing this? How does it help us?

#### Have you done the following membership-specific things (if necessary)?
* [ ] Update campaign ID
* [ ] If launching a campaign, redirect `index.html` to `campaign.html` (probably)
* [ ] If ending a campaign, redirect `campaign.html` to `index.html` (probably)
* [ ] Update social meta tags
* [ ] After deploy, [bust](https://developer.twitter.com/en/docs/tweets/optimize-with-cards/guides/troubleshooting-cards) the Twitter card cache
+ After deploy, [bust the Facebook cache](https://developers.facebook.com/tools/debug/). This is automated as part of the deploy script, but it's good to double check just in case something didn't go/our caching layers are causing something not to update.

#### How should this be manually tested?

#### Have automated tests been added?

#### Are there performance implications? If adding JS can it be done async? Do images/CSS/JS have cache headers set?

#### What are the relevant tickets?

#### How should this change be communicated to end users?

#### Next steps?

#### Smells?

#### TODOs:
* [ ] your TODO here

#### Has the relevant documentation/wiki been updated?

#### Technical debt note
