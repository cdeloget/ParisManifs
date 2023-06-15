/////////////////////////////////////////////////////////////////
//---------------- Création de la carte avec d3js ---------------
///////////////////////////////////////////////////////////////////


//------------------ SVG + GeoPATH -------------------

//couleurs utilisées pour date trajet

var color_date_debut = "red";
var color_date_fin = "purple";

//dimensions de la carte
const mapwidth = window.innerWidth * 0.9, mapheight = window.innerHeight * 0.95;

//définition d'un objet géographique (geoPath) et d'une projection

const map = d3.geoPath();

//utilisation d'une projection de Mercator
 //const proj = d3.geoMercator()
 //   .center([2.28, 48.88])
 //	.scale(300000);

//Affichage sans projection : utilisation des valeurs coords du geojson directement comme coordonnées SVG. ici, la couche est déja pré-projetée en 2154
var proj = d3.geoIdentity()
.reflectY(true) //inversion des valeurs y (en svg, le pt 0 est en haut à gauche, et les valeurs y sont donc négatives)
.fitSize([mapwidth, mapheight], basemapparis);

map.projection(proj); //assignation de la projection définie à l'objet geographique map


//ajout d'un groupe svg à la div qui doit contenir la carte

const svg = d3.select('#carto').append("svg")
  .attr("id", "svgcarte")
  .attr("width", mapwidth) //dimensions définies plus haut
  .attr("height", mapheight);


//Div pour affichage info carte

var tooltip = d3.select("#tooltip").text("Passer la souris sur un parcours").style("color", "white")

//--------------------------Ajout des couches de données---------------------

    // O) Ajout d'un groupe svg contenant le fond de carte Paris
    const paris = svg.append('g');

    paris.selectAll("path")
        .data(basemapparis.features)
        .enter()
        .append("path")
        .attr("d", map)
        // Sémiologie (par défaut) des objets
        .style("fill", "#363939")
        .style("stroke-width", 2);



    // I) Ajout du parcours des cortèges intersyndicaux

        //variation de couleurs en fonction de la date
        // var myColor = d3.scaleTime().domain(d3.extent())
        //     .range(["white", "blue"]);

        const parcours = svg.append('g'); //ajout d'un groupe contenant les lignes des parcours




        //______a) Flèches _____________

        const arrowviewboxsize = 7.5 //taille de la zone où est affichée la tete de fleche (width et height)
        const arrowsize = arrowviewboxsize / 2 //taille de la tete de fleche (height et width)
        const arrowposition = arrowviewboxsize / 2 //position de la tete de fleche dans sa viewbox
        const arrowPoints = [[0, 0], [0, arrowviewboxsize], [arrowviewboxsize, arrowviewboxsize/2]]; //cordonnées d'un triangle qui fera office de tete de fleche

        parcours
            .append('defs') //ajout d'un élément defs. Flèches
            .append('marker')
            .attr('id', 'arrow')
            .attr('viewBox', [0, 0, arrowviewboxsize, arrowviewboxsize])
            .attr('refX',arrowposition)
            .attr('refY', arrowposition)
            .attr('markerWidth', arrowsize)
            .attr('markerHeight', arrowsize)
            .attr('orient', 'auto-start-reverse')
            .append('path')
            .attr('d', d3.line()(arrowPoints)) //création d'une ligne depuis les points définis plus haut
            .attr('fill', 'red');





        //______b) Variation de couleurs selon les dates de manifs____

        //récupération d'un array contenant les dates des manifs
        var dates = parcoursmanifs.features.map(element => {
            return new Date(element.properties.Date).getTime(); //. getTime permet de récup, à partir d'un timestamp, le nb de secondes écoulées sous forme de nombre entier
        });
        console.log(dates);
        console.log(d3.extent(dates))

        //création d'une échelle de couleurs
        var mypal = d3.scaleLinear() //palette de couleur
            .domain(d3.extent(dates)) //fourchette des dates
            .range([color_date_debut, color_date_fin]); //fourchette de couleurs

        function colorpath (feature){ //fonction qui renvoie la couleur pour le champ date d'une entité, selon la palette definie plus haut
            return mypal(new Date(feature.properties.Date)
                .getTime());
        }




        //_____c) Affichage du linéaire des parcours _______________

        var parcours_affiche = parcours.selectAll("path")
            .data(parcoursmanifs.features) //selection d'un jeu de données
            .enter()
            .append("path") //ajout d'un path au groupe svg parcours
            .attr("d", map)
            .attr('marker-end', 'url(#arrow)') //marker end qui renvoie vers le defs arrows (par défaut invisible)
            .style("stroke", d => colorpath(d) ) //la couleur de la ligne est retournée avec la fonction colorpath (voir plus haut)
            //.style("stroke", (d)=>{return myColor(d)})
            .style("stroke-width", "5px")
            .style("fill", "none")
            .on("mouseover", (d) => { // au survol, au affiche le marker end
                d3.select('#arrow').style("visibility", "visible");
                d3.select(d.target).style("stroke", "orange").style("stroke-width", "10px");
                console.log(d);
                tooltip.text(d.target.__data__.properties.Lieu_depart + ' --> ' + d.target.__data__.properties.Lieu_arrivee + '. Journée du '+ d.target.__data__.properties.Date.toString())
            })
            .on("mouseout", (d) => {
                //d3.select("#arrow").style("visibility", "hidden");
                d3.select(d.target).style("stroke", d => colorpath(d)).style("stroke-width", "5px");
                setTimeout(
                        (d)=>{
                        tooltip.text("---")},
                    4000) 
                }
                );

            


    // II) Ajout de certains toponymes d'interet (figuré ponctuel)
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


    // III) Creation de la légende

    // div et svg

    var legend = d3.select('#legend') //selection de la div qui va contenir la légende
        .append("svg") //ajout d'une balise svg
        .attr("id", "svglegend")
        .attr("height", window.innerHeight*0.03)
        .attr("width", "100%")


    // gradient de couleurs

    var legend_gradient = legend
                //.append("defs")
                .append("linearGradient")
                .attr("id", "gradient")
                //position des débuts et fin du gradient
                .attr("x1", "0%")
                .attr("y1", "50%")
                .attr("x2", "100%")
                .attr("y2", "50%")
                //.attr("spreadMethod", "pad");

        //___Ajout de "stops" de couleurs
        // couleur 1
        legend_gradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", color_date_debut)
                .attr("stop-opacity", 1)
        // couleur 2
        legend_gradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", color_date_fin)
                .attr("stop-opacity", 1);


    // ajout du gradient comme remplissage d'un rectangle
    
    var legrect = legend.append("rect") //ajout d'un rectangle
        .attr("x", 5)
        .attr("y", 5)
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("fill", "url(#gradient)")


    // ajout texte dates

    legend.append("text").attr("class", "date_leg").attr("id", "date_min").attr("x", "5%").attr("y", "80%").attr("text-anchor", "start").text("19 janv")

    legend.append("text").attr("class", "date_leg").attr("id", "date_max").attr("x", "95%").attr("y", "80%").attr("text-anchor", "end").text("6 juin")
