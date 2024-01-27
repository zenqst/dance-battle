const gameParameters = {
	MAX_LEVEL: 15, //Максимальный уровень героя
	MAX_STAT: 100, //Минимальный уровень параметра героя
	MIN_STAT: 50 //Минимальный уровень параметра для умения
};

const gameClasses = {
	Mage: 'Маг',
	Knight: 'Рыцарь',
	Hero: 'Герой'
};

let playerHero = null;
let enemyHero = null;

const sendToBattleButton = document.getElementById('sendToBattleButton');
const getEnemyButton = document.getElementById('getEnemyButton');
const doSkillButton = document.getElementById('doSkillButton');
const startBattleButton = document.getElementById('startBattleButton');
const heading = document.querySelector('.page-heading');
const balance = document.querySelector('.page-subheading');
