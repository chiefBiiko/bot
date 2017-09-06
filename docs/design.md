# bot design

a brief set of fundamental design decisions that shall shape bot's UX.

***

## bot scope

bot should be able to assist users searching for tech products in making a
purchase decision.

therefore, bot has access to databases holding product data regarding category,
features, pricing, ratings and pictures.  

bot is able to provide info on a specific category or product, and can answer
basic arithmetic queries, e.g. "what is the minimum rating for the iPhone 7?".

***

## bot personality

+ predominantly *responds* to *user queries*
+ provides detailed product info for product specific queries
+ recommends suitable products in response to category, feature[, price] queries
+ offers contacting human support in case of perisisting user dissatisfaction

***

## must-have features

+ updated product database

***

## bot flow

bot's first message always clearly communicates bot's scope.

given bot's scope there are roughly four scenarios that could arise from a user
query:

+ **known attribute**
implicit query for an attribute which is any of: category, features, price,
ratings
+ **known product**
explicit query for a known product
+ **known product-attribute**
explicit query for an attribute of a known product
+ **unknown query**
user query out of bot's scope

[this flowchart](./flow.sequence.svg) visualizes bot's conversation flow...
