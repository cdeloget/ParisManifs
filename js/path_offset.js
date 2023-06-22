//////////////////////////////////////////////////////////////:
///---------------------Gestion de la superposition des linéaires
//////////////////////////////////////////////////////////::
var step = 30;
var items = [5 * -step, 4 * -step, 3 * -step, 2 * -step, -step, step, 2*step, 3*step, 4*step, 5*step]
//console.log(items[Math.floor(Math.random()*items.length)])

function pathoffset (dataset){
    console.log(dataset.features)

    // Récupérationd des x et des y dans deux arrays
    var xx = Array();
    var yy = Array();
    dataset.features.forEach(feature => { //pour chaque feature 
        feature.geometry.coordinates.forEach(elem => { //on vient ajouter dans un array ses coords x et y
            xx.push(elem[0]);
            yy.push(elem[1]);
        });
    });


    console.log(dataset.features[0].geometry.coordinates[0]);

    // Pour chaque points de chaque features, on vient comparer les valeurs x et y avec toutes les autres
    var newdataset = dataset
    newdataset.features.forEach((feature, index) => {
        var randx = items[Math.floor(Math.random()*items.length)];
        var randy = items[Math.floor(Math.random()*items.length)];
        feature.geometry.coordinates.forEach((elem, index) => {
            if(xx.includes(feature.geometry.coordinates[index][0]) | yy.includes(feature.geometry.coordinates[index][1])){
                feature.geometry.coordinates[index][0] = feature.geometry.coordinates[index][0] + randx;
                feature.geometry.coordinates[index][1] = feature.geometry.coordinates[index][1] - randy;
                    }
        })
    })


    console.log(dataset.features[0].geometry.coordinates[0]);



    return newdataset
}


