var math = require('mathjs');
var _ = require('underscore');

//// --------testing
// var matrix = math.matrix([[7, 1], [-2, 3]]);
//console.log(matrix.map(function (value, index, matrix){ return value - 1}));
//console.log(math.multiply(-1 , (matrix)));
// console.log(matrix.subset(math.index([0],_.range(matrix.size()[1]))));



var KNN = function(k,distanceType){
	
	if( !(distanceType == 'manhattan' || distanceType== 'euclidean') ) {
		distanceType ='manhattan';
	}

	var matrix = math.matrix([7, 1]);
	var matrix2 = math.matrix([[8, -1],[0,1]]);

	//return a matrix
	var matrix_row = function(matrix,i){
		return math.squeeze(matrix.subset(math.index([i],_.range(matrix.size()[1]))));
	}


	var o = {
		'distance':distanceType,
		'k':k,
		'X': null,
		'y':null,
		'fit' : function(X,y){
			this.X = math.matrix(X);
			this.y = math.matrix(y);
		},
		'calcDistance' : function(v1,v2){ //public
			var p = null;
			var v = v1;

			if(this.distance == 'manhattan') {
				p = 1; // remember javascript only has floats
			}
			else if(this.distance == 'euclidean') {
				p = 2;
			}
			if(v2){
				v = math.add(v,  math.multiply(-1,v2));
			}

			v = v.map(function(value,index,matrix){ return math.abs(value)});
			z = 0;
			v.forEach(function(value,index,matrix){
				z+= math.pow(value,p);
			})
			return math.pow(z,1/p);
		},
		'calcAllDistances' : function(v){
			var arr = [];
			var numrows = this.X.size()[0];

			var i = 0
			while(i < numrows) {
				arr.push(this.calcDistance(v,matrix_row(this.X,i)));
				i+=1
			}
			return arr;
		},
		'predict_row' : function(row){
			var distances = this.calcAllDistances(row);
		
			function compare(a,b) {
			if (a.val > b.val)
			return -1;
			else if (a.val < b.val)
			return 1;
			else
			return 0;
			}

			top_k = [];
			for(var i = 0; i<distances.length; ++i)
			{
				if(top_k.length < this.k) {
					top_k.push({val:distances[i],'label':y[i]});
					top_k.sort(compare);
				}
				else{
					if(distances[i] > top_k[this.k-1]){
						top_k.pop();
						top_k.push({val:distances[i],'label':y[i]});
						top_k.sort(compare);
					}
				}
			}

			classes = {}
			// do majority voting
			for(var i = 0; i < top_k.length; ++i)
			{
				if(_.isUndefined(c[top_k[i]['label']])){
					c[top_k[i]['label']] = 1
				}
				else{
					c[top_k[i]['label']]++;
				}
			}
			l = []
			for(key in c)
			{
				l.push({'label': key, 'val': c[key]});
			}

			return  _.max(l, function(stooge){ return stooge.val; })['label'];
		},
		'predict' : function(X_test){ 
			var numtestrows = this.X_test.size()[0];
			var i = 0 ;
			var y = _.range(numtestrows);

			while (i < numtestrows) { 
				y[i] = this.predict_row(matrix_row(X_test,i));
				i+=1;
			}
			return y;
		}
	}
	return o;
}



//testing
z = KNN(1,'manhattan')
z.b()

console.log(_.map([1,2,3],[1,2,3],function(a,b){return a + b}))