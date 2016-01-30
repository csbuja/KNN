#Example
```javascript

z = KNN(2,'manhattan')
var X_train = [[0,0],[1,1],[0.1,0.1]];
var y_train = ['dumb','smart','dumb']
var X_test = [[.25,.25]];
console.log(z.fit(X_train,y_train,function(){return z.predict(X_test)} ) );
```