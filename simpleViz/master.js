
    
self = {};

self.radars = [];

self.radarLimit = 3;

self.beersNumber = 1000;

self.referenceId = -1;

self.cats = ['graduacion','lupulo_afrutado_citrico','lupulo_floral_herbal','amargor','color','maltoso','licoroso','afrutado','especias','acidez']

self.drawSelector = function(){

    let selectorHtml = '<select id="selector">';//<option>1</option><option>2</option><option>3</option></select>';
    
    let count = 0;

    while(count<self.beersNumber){
        selectorHtml += '<option>'+count+'</option>';
        count += 1;
    }

    selectorHtml += '</select>';

    d3.select("#selector-container")
        .html(selectorHtml)
        .on("change",function(d){
            console.log("CHANGE",this,d);
            var sel = document.getElementById('selector');
            self.referenceId = sel.options[sel.selectedIndex].value
            self.initBaseRadar();
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
    d3.csv('dataset-datathon.csv',function(beers){
        console.log("BEERS",beers)
        self.beersData = beers;
    })
}


self.init = function(){
    self.loadBeersData();
    self.drawSelector();
}

window.onload = self.init;


