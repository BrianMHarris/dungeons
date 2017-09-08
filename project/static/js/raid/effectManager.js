var tempEffectList = [
  {
    name: 'OrangeSword',
    img: 'orange_sword.png',
    imgUrl: `/static/img/raid/orange_sword.png`
  },
  {
    name: 'BlueSword',
    img: 'blue_sword.png',
    imgUrl: `/static/img/raid/blue_sword.png`
  }
];

function effectManager() {
  this.effects = null;
  this.firstNode = null;
  this.lastNode = null;
}

function updateEffects() {

}

// The effect node object for the linked list of effects
function EffectNode(imageName) {
  this.next = null;
  this.img = null;
}
