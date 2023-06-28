///////////////////////////////////////////////////////////////////////////////
///---------------------Gestion de la superposition des linéaires------------
///////////////////////////////////////////////////////////////////////////////
// variable distance de décalage
var step = 20;
var items = [4 * -step, 3 * -step, 2 * -step, -step, step, 2*step, 3*step, 4*step]
//console.log(items[Math.floor(Math.random()*items.length)])

function pathoffset (dataset){


    let dep_na = false, arr_na = false, full_na = false;
    // 1) on regarde si les champs Lieu_depart et Lieu_arrivee sont remplis
    dataset.features.forEach((elem) => {
        if(elem.properties.Lieu_depart == ""){
            console.log("une valeur vide")
            dep_na = true
        }
        if(elem.properties.Lieu_arrivee == ""){
            console.log("une valeur vide")
            arr_na = true
        }
        if(dep_na == true | arr_na == true){
            full_na = true;
        }
    })




    if(full_na == true){ //si c'est le cas, on travaille avec les trajet
        
        dataset.forEach((feature, index)=>{
            let dep, arr
            feature.geometry.coordinates.forEach((point)=>{
            })
        })


    } else { //sinon on décale les points de chaque feature avec une valeur random
        // Récupérationd des x et des y dans deux arrays
        var xx = Array(); //un pour les x...
        var yy = Array(); //...l'autre pour les y
        dataset.features.forEach(feature => { //pour chaque feature 
            feature.geometry.coordinates.forEach(elem => { //on vient ajouter dans un array ses coords x et y
                xx.push(elem[0]); //on ajoute la coord x dans l'array correspondant
                yy.push(elem[1]);
            });
        });
    
    
        console.log(dataset.features[0].geometry.coordinates[0]);
    
        // Pour chaque points de chaque features, on vient comparer les valeurs x et y avec toutes les autres
        // s'il y a des égalités, on ajoute une valeur random à la feature pour décaler
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

    }



    return newdataset
}


