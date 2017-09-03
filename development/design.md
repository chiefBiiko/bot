# bot design

a brief set of fundamental design decisions that shall shape bot's UX.

***

## bot scope

bot should be able to assist users searching for tech products in making a
purchase decision.

therefore, bot has access to databases holding product
data regarding category, features, pricing, ratings and pictures.  

***

## bot personality

+ does generally not act proactively
+ predominantly *responds* to *user queries*
+ provides detailed product info for product specific queries
+ recommends suitable products in response to category, feature[, price] queries
+ offers contacting human support in case of perisisting user dissatisfaction

***

## must-have features

+ updated product database including purpose, feature, price, and rating info

***

## bot flow

bot's first message always clearly communicates bot's scope.

given bot's competence scope there are three possible scenarios that could
arise from a users query:

**unknown query**
user query out of bot's scope

**known product**
explicit product query

**known attribute**
implicit query for an attribute which is any of: category, features, price

[this flowchart](./flow.png) visualizes bot's conversation flow...
