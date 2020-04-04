
    
self = {};

self.radars = [];

self.radarLimit = 3;

self.referenceId = -1;

self.maxValues = [15,5,5,5,5,5,5,5,5,5,5,5];

self.referenceVector = [];

self.cats = ['graduacion','lupulo_afrutado_citrico','lupulo_floral_herbal','amargor','color','maltoso','licoroso','afrutado','especias','acidez']

self.getSimilarBeer = function(){

    var min = 10000;
    var selectedId = -1;

    self.matrix.forEach(function(beer,i){

        var dif = 0;

        beer.forEach(function(val,j){
            var minidif = Math.abs(val-self.referenceVector[j]);
            dif += minidif;
        })

        if(dif<min){
            min = dif;
            self.referenceId = i;
        }
    })

    self.initBaseRadar();

}

self.drawSelector = function(){

    /*<input type="range" id="points" name="points" min="0" max="10">*/

    let selectorHtml = '';
    
    let count = 0;

    while(count<self.cats.length){
        selectorHtml += '<div class="range-cont"><span>'+self.cats[count]+'</span><input type="range" class="ranges" name="points" min="0" max="'+self.maxValues[count]+'"></div>';
        count += 1;
    }

    selectorHtml += '<div id="btn-cont"><span id="draw-btn">Get my beer!!!</span></div>'

    d3.select("#selector-container")
        .html(selectorHtml)
        
    d3.selectAll(".ranges")
        .on("change",function(d){
            console.log("CHANGE",this,d);
            var sel = this;
            console.log("SDASDA",sel.value);
            d3.selectAll(".ranges")
                .attr("fake",function(dd,i){
                    console.log("DDDDDD",dd,this);
                    self.referenceVector[i] = this.value;
                })
            //self.initBaseRadar();
            console.log("QUEDA",self.referenceVector);
            //getSimilarBeer();
        })

    d3.select("#draw-btn")
        .on("click",function(){
            self.getSimilarBeer();
        })

}

self.drawRecomCharts = function(){

    console.log("DRAW RECOM");
    d3.select("#recom-charts").html('');

    console.log("URL",'http://localhost:5000/?id='+self.referenceId);

    /*{"beerID":{"0":673,"1":674,"2":675,"3":1169,"4":1186},"cosine_dist":{"0":0.0,"1":0.0,"2":0.0,"3":0.0056217473,"4":0.0056217473}}*/

    d3.json('http://localhost:5000/?id='+self.referenceId,function(data){

        console.log("LLEGA",data);

        let count = 0;
    
        while(count<self.radarLimit){

            let currentId = data.beerID[count];
    
            let baseData = [];
            self.cats.forEach(function(cat){

                let val = 0;

                if(self.beersData[currentId][cat]){
                    console.log("VA PALLA",self.beersData[currentId][cat]);
                    val = self.beersData[currentId][cat];
                }
                baseData.push({"group":"Base", "area":cat, "value":val, "description":""})

            })
    
            let id = "recom-chart-"+count
            console.log("ADSAQDSA RECOM",baseData,id);
            d3.select("#recom-charts").append("div").attr("id",id);
            RadarChart.draw("#"+id,[baseData],{})
            count += 1;
 
        }

    })

}

self.drawRecomBtn = function(){

    console.log("ASASAS BTN");
    let recom_html = '<span id="recom-btn">Similares</span>';

    d3.select("#recomend-container").html(recom_html);

    d3.select("#recom-btn").on("click",function(d){

        console.log("CLICK",d,this);
        self.drawRecomCharts();

    })

}

self.initBaseRadar = function(){

    let baseData = [];//{"group":"Base", "axis":"", "value":"", "description":""}]

    self.cats.forEach(function(cat){

        let val = 0;

        if(self.beersData[self.referenceId][cat]){
            console.log("VA PALLA",self.beersData[self.referenceId][cat]);
            val = self.beersData[self.referenceId][cat];
        }
        else{
            console.log("AAAAAA -1")
        }
        baseData.push({"group":"Base", "area":cat, "value":val, "description":""})

    })

    console.log("ADSAQDSA",baseData);
    self.radarBase = RadarChart.draw("#chart",[baseData],{})

    self.drawRecomBtn();
}

self.loadBeersData = function(){

    self.matrix = [];

    d3.csv('dataset-datathon.csv',function(beers){
        console.log("BEERS",beers)
        self.beersData = beers;
        beers.forEach(function(beer){
            let aux = [];
            self.cats.forEach(function(cat){
                aux.push(beer[cat]);
            })
            self.matrix.push(aux);
        })
    })
}


self.init = function(){
    self.loadBeersData();
    self.drawSelector();
}

window.onload = self.init;


