// Fetch monsters from API and render them to the page
(async () => {
  monstersFromAPI = await monsterAdapter.getAll();
  wildMonsters = [...monstersFromAPI];
  monstersFromAPI.forEach(renderMonster);
})();

let MonsterIcon = L.Icon.extend({
    options: {
        iconSize:     [50, 50]
    }
});

function renderMonster(monster) {
  const monsterLocation = generateMonsterLocation()
  generateMonsterBoundaries(monster, monsterLocation);
  createMonsterIcon(monster, monsterLocation);
};

function generateMonsterBoundaries(monster, monsterLocation) {
  const monsterBoundary = new L.Circle(monsterLocation, 75, {color: 'red', opacity: 0.001}).addTo(map);
  monsterBoundaries.push(monsterBoundary)
  monster.monsterBorder = monsterBoundary
}

function createMonsterIcon(monster, monsterLocation) {
  const monsterIcon = new MonsterIcon({iconUrl: monster.image})
  , newMonsterMarker = L.marker(monsterLocation, {icon: monsterIcon}).addTo(map).bindPopup(monster.name + ": " + monster.phrase);
  monster.marker = newMonsterMarker;
}

function generateMonsterLocation () {
  const monsterLatitude = parseFloat((Math.random() * (51.51000 - 51.50245) + 51.50245).toFixed(7))
  , monsterLongitude = parseFloat((Math.random() * (-0.15621 + 0.18758) - 0.18758).toFixed(7))
  , monsterLocation = [monsterLatitude, monsterLongitude];
  return monsterLocation
}


