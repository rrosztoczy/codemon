//Event Listener for our player movement
//Need to refractor code!
var MonsterIcon = L.Icon.extend({
    options: {
        iconSize:     [50, 50]
    }
});

// var greenIcon = new LeafIcon({iconUrl: 'leaf-green.png'}),
//     redIcon = new LeafIcon({iconUrl: 'leaf-red.png'}),
//     orangeIcon = new LeafIcon({iconUrl: 'leaf-orange.png'});


(async () => {
    monstersFromAPI = await monsterAdapter.getAll();
    // Create monsters
    wildMonsters = [...monstersFromAPI]
    console.table(wildMonsters)
    // Render monsters
    monstersFromAPI.forEach(renderMonster);
    })();



    // Create monster icon(marker) and add to the map
    function renderMonster(monster) {
      // randomly generate monster location
      const monsterLatitude = parseFloat((Math.random() * (51.51000 - 51.50245) + 51.50245).toFixed(7));
      const monsterLongitude = parseFloat((Math.random() * (-0.15621 + 0.18758) - 0.18758).toFixed(7));
      const monsterLocation = [monsterLatitude, monsterLongitude];
      const monsterBoundary = new L.Circle(monsterLocation, 75, {color: 'red', opacity: 0.001}).addTo(map)
      monsterBoundaries.push(monsterBoundary)
      monster.monsterBorder = monsterBoundary
      // console.log(monster.image)
      const monsterIcon = new MonsterIcon({iconUrl: monster.image});
      // console.log(monsterIcon)
      const newMonsterMarker = L.marker(monsterLocation, {icon: monsterIcon}).addTo(map).bindPopup(monster.name + ": " + monster.phrase)

      monster.marker = newMonsterMarker

    };
