# GyreJS
Data fetching and state library geared towards ReactJS. This is an experimental project.

## Vision
### Flow
```
                   +                                                 
+------------+     |                                                 
|            |     |                                                 
|            |     |                                                 
|            |     |                                                 
|            |     |    +------------+                +-------------+
|            |     |    |            |                |  Data HoC   |
|            +---------------+----------------------->+  +-------+  |
|   Server   |     |    |    ^       |                |  |       |  |
|            |     |    |    |       |                |  |  UI   |  |
|            |     |    |    |       |                |  |       |  |
|            <---------------+------------------------+  +-------+  |
|            |     |    |            |                |             |
|            |     |    +------------+                +-------------+
|            |     |                                                 
|            |     |      Store / Action handlers / Reducer                                  
+------------+     |      - State source                             
                   +      - Data fetching/saving
                          - Optimistic updates              
```

## Intended features
- Minimal surface API
- HoC for ReactJS (data wrapper) 
- Isomorphic
- Snapshots / rollback
- Immutable data

## Inspiration
### Articles
- [Turning the database inside out](http://blog.confluent.io/2015/03/04/turning-the-database-inside-out-with-apache-samza/)
- [The two pillars of Javascript FRP](https://medium.com/javascript-scene/the-two-pillars-of-javascript-pt-2-functional-programming-a63aa53a41a4)

### Libraries
- [Redux](http://redux.org)
- [Marty/Alt](http://alt.js.org)
- [KefirJS](http://www.kefirjs.org)
- [RxJS](https://github.com/Reactive-Extensions/RxJS)
- [GraphQL/Relay](https://gist.github.com/wincent/598fa75e22bdfa44cf47)
- [ImmutableJS](https://facebook.github.io/immutable-js/)
 
## Gyre?
Gyre = vortex. A wink to unidirectional data flow.
