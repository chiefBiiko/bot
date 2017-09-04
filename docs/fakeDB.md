# fake DB for developing bot

below has been set as a database mini sample; for initial development only:

```js
// 4 dev: bp.db.kvs has a products object which looks like this
{
  'galaxy s9': {
    category: 'smartphones',
    features: [ 'durable', 'sustainable' ],
    pictures: [ 's9front.png', 's9back.png' ],
    price: 500,
    ratings: [ 2, 3, 5, 4, 2, 4, 3, 4, 1, 5 ]
  },
  'iphone 7' : {
    category: 'smartphones',
    features: [ 'hd-camera', 'siri' ],
    pictures: [ 'iphront.png', 'iphback.png' ],
    price: 900,
    ratings: [ 4, 3, 5, 4, 3, 4, 3, 4, 1, 3 ]
  },
  'ipad pro' : {
    category: 'tablets',
    features: [ 'hd-camera', 'siri' ],
    pictures: [ 'ipront.png', 'ipack.png' ],
    price: 1100,
    ratings: [ 4, 3, 5, 4, 3, 4, 3, 4, 1, 3 ]
  }
}
```
