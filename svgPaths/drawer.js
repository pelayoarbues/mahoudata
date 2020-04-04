/*

    //self.beersData.forEach(function(p){
    //self.beersData.slice(10,51).forEach(function(p){
    //[{'graduacion':14,'lupulo_afrutado_citrico':4,'lupulo_floral_herbal':4,'amargor':4,'color':4,'maltoso':4,'licoroso':4,'afrutado':4,'especias':4,'acidez':4}].forEach(function(p){
*/
    
self = {};

self.cats = ['graduacion','lupulo_afrutado_citrico','lupulo_floral_herbal','amargor','color','maltoso','licoroso','afrutado','especias','acidez']

self.loadBeersData = function(){
    d3.csv('dataset-datathon.csv',function(beers){
        console.log("BEERS",beers)
        self.beersData = beers;
        self.draw();
    })
}

self.draw = function(){

    var svg = d3.select("#board")
        .append("svg")
        .attr("height",500)
        .attr("width",1100);

    /*svg.append("line")
        .attr("x1",0)
        .attr("y1",0)
        .attr("x2",300)
        .attr("y2",300)
        .style("fill","none")
        .style("stroke","red")

    svg.append("path")
        .attr("d", "m0,0 l0,150 l150,150 z")
        .attr("stroke", "blue")
        .attr("stroke-width", "2")
        .attr("fill", "none");*/

    var beer_count = 0

    window.setInterval(function(){

      if(beer_count<1000){

        var p = self.beersData[beer_count];
        var pathB = svg.append("path")
            .style("fill","none")
            .style("stroke","green");

        var svg_str = 'm0,0';
        var x = 0;
        var y = 0;
        var count = 0;
        var height = 30;

        window.setInterval(function(){

            if(count<11){
                let i = count;
                let cat = self.cats[count];
                let angle = ((2*Math.PI)/10)*i;
                let svg_tmp = 'm'+x+','+y;

                let value = 0;
                //y = value;

                if(p[cat]){
                    value = p[cat]*60;
                }
                //y = value;
                if(value>0){
                    //var incX = value*Math.cos(angle);
                    //var incY = value*Math.sin(angle);
                    var incX = value*Math.abs(Math.cos(angle));
                    var incY = value*Math.abs(Math.sin(angle));

                    //console.log("ANGLE",angle,value, incX, incY);
                    svg.selectAll("line")
                        .style("opacity",0.1);

                    svg.append("line")
                        .attr("x1",x)
                        .attr("y1",y)
                        .attr("x2",function(){return x+incX;})
                        .attr("y2",function(){return y+incY;})
                        .style("fill","none")
                        .style("stroke","red");

                    x += incX;
                    y += incY;

                    svg_tmp += ' l'+x+','+y//+' z'
                    //svg_str += ' l'+x+','+y;
                    //console.log("MUEVO",svg_tmp);
                    //pathB.transition().duration(1000).attr("d",svg_str)
                    /*svg.append("path")
                        .attr("d",svg_tmp)
                        .style("fill","none")
                        .style("stroke","green");*/
                }
            }
            count += 1
        },10)
      }
      beer_count += 1;
    },100);

}

self.init = function(){
    self.loadBeersData();
}

window.onload = self.init;


//await sleep(2000);
//self.cats.forEach(function(cat,i){