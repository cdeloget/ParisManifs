/////////////////////////////////////////////////////////////////
//---------------- Création de la carte avec d3js ---------------
///////////////////////////////////////////////////////////////////

//dimensions de la carte
const mapwidth = window.innerWidth * 0.9, mapheight = window.innerHeight * 0.95;

//définition d'un objet géographique (geoPath) et d'une projection

const map = d3.geoPath();
const proj = d3.geoMercator()
    .center([2.28, 48.88])
	.scale(400000);
map.projection(proj);

//ajout d'un groupe svg à la div qui doit contenir la carte

const svg = d3.select('#carto').append("svg")
  .attr("id", "svgcarte")
  .attr("width", mapwidth)
  .attr("height", mapheight);


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

    //Idem pourr ajouter certains toponymes (figuré ponctuel)
    const localites = svg.append('g');

    localites.selectAll("path")
        .data(lieuxmanifs.features)
        .enter()
        .append("path")
        .attr("d", map)
        .style("fill", "gray");




    // AJout du parcours des cortèges intersyndicaux

    const parcours = svg.append('g')

    parcours.selectAll("path")
        .data(parcoursmanifs.features)
        .enter()
        .append("path")
        .attr("d", map)
        .style("stroke", "red")
        .style("stroke-width", "2px")
        .style("fill", "none")


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

    console.log(lieuxmanifs.features[1].geometry.coordinates[0])


