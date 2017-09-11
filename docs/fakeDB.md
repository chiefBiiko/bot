# fake DB for developing bot

below has been set as a database mini sample; for initial development only:

```js
// 4 dev: bp.db.kvs has a products object which looks like this
{
  'Galaxy S9': {
    category: 'smartphones',
    manufacturer: 'Samsung',
    features: [ 'durable', 'sustainable' ],
    pictures: [ 'front.png', 'back.png' ],
    price: 500,
    ratings: [ 2, 3, 5, 4, 2, 4, 3, 4, 1, 5 ]
  },
  'iPhone 7' : {
    category: 'smartphones',
    manufacturer: 'Apple',
    features: [ 'HD-camera', 'Siri' ],
    pictures: [ 'front.png', 'back.png' ],
    price: 900,
    ratings: [ 4, 3, 5, 4, 3, 4, 3, 4, 1, 3 ]
  },
  'iPad Pro' : {
    category: 'tablets',
    manufacturer: 'Apple',
    features: [ 'HD-camera', 'Siri' ],
    pictures: [ 'front.png', 'back.png' ],
    price: 1100,
    ratings: [ 4, 3, 5, 4, 3, 4, 3, 4, 1, 3 ]
  }
}
```
