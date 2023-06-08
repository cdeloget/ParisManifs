/////////////////////////////////////////////////////////////////
//---------------- Création de la carte avec d3js ---------------
///////////////////////////////////////////////////////////////////

//dimensions de la carte
const mapwidth = window.innerWidth * 0.9, mapheight = window.innerHeight * 0.95;

//définition d'un objet géographique (geoPath) et d'une projection

const map = d3.geoPath();

//utilisation d'une projection de Mercator
 //const proj = d3.geoMercator()
 //   .center([2.28, 48.88])
 //	.scale(300000);

//Affichage sans projection : utilisation des valeurs coords du geojson comme coordonnées SVG
var proj = d3.geoIdentity()
.reflectY(true) //inversion des valeurs y (en svg, le pt 0 est en haut à gauche, et les valeurs y sont donc négatives)
.fitSize([mapwidth, mapheight], basemapparis);

map.projection(proj); //assignation de la projection définie à l'objet geographique map


//ajout d'un groupe svg à la div qui doit contenir la carte

const svg = d3.select('#carto').append("svg")
  .attr("id", "svgcarte")
  .attr("width", mapwidth)
  .attr("height", mapheight);


//Div pour affichage info carte

var tooltip = d3.select("#tooltip").text("Passer la souris sur un parcours").style("color", "white")

//Ajout des couches de données

    //ajout d'un groupe svg contenant le fond de carte Paris
    const paris = svg.append('g');

    paris.selectAll("path")
        .data(basemapparis.features)
        .enter()
        .append("path")
        .attr("d", map)
        // Sémiologie (par défaut) des objets
        .style("fill", "#363939")
        .style("stroke-width", 2);


    // AJout du parcours des cortèges intersyndicaux

        //variation de couleurs en fonction de la date
        // var myColor = d3.scaleLinear().domain([d3.min(parcoursmanifs, d=>d.properties.Date), d3.max(parcoursmanifs, d=>d.properties.Date)])
        //     .range(["white", "blue"]);

    const parcours = svg.append('g');

    parcours.selectAll("path")
        .data(parcoursmanifs.features)
        .enter()
        .append("path")
        .attr("d", map)
        .attr("fake", (d)=>{
            console.log(d);
        })
        .style("stroke", "red")
        //.style("stroke", (d)=>{return myColor(d)})
        .style("stroke-width", "5px")
        .style("fill", "none")
        .on("mouseover", (d) => {
            //console.log(d.target)
            d3.select(d.target).style("stroke", "orange").style("stroke-width", "10px");
            tooltip.text(d.target.__data__.properties.Lieu_depart + ' --> ' + d.target.__data__.properties.Lieu_arrivee + '. Journée du '+ d.target.__data__.properties.Date.toString())
        }).on("mouseout", (d) => {
            d3.select(d.target).style("stroke", "red").style("stroke-width", "5px");
            setTimeout(
                    (d)=>{
                    tooltip.text("---")},
                1200) 
            }
            );


    //Ajout de certains toponymes d'interet (figuré ponctuel)
    const localites = svg.append('g');

    localites.selectAll("path")
        .data(lieuxmanifs.features)
        .enter()
        .append("path")
        .attr("d", map)
        .style("fill", "gray");

        
    //Placement du texte des toponymes
    const labels = svg.append('g');

    labels.selectAll(".place-label")
        .data(lieuxmanifs.features)
        .enter()
        .append("text")
        .attr("class", "labelmap")
        .attr("x", (d)=>{return map.centroid(d)[0] + 5} )
        .attr("y", (d)=>{return map.centroid(d)[1] - 15} )
        .text((d)=>{return d.properties.toponyme;} );

