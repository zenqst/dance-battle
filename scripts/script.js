window.onload = function () {
	let data = getWinsFromLocalStorage();

	balance.innerHTML = `${data} 🏆`;
};

// --- ФУНКЦИИ ---

function wait(seconds) {
	return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

function saveWinsToLocalStorage(data) {
	localStorage.setItem('wins', JSON.stringify(data));
}

function getWinsFromLocalStorage() {
	const data = JSON.parse(localStorage.getItem('wins'));

	if (!data) {
		return 0;
	}

	return data;
}

function setWins(amount) {
	let data = getWinsFromLocalStorage();
	data += amount;

	balance.innerHTML = `${data} 🏆`;
	saveWinsToLocalStorage(data);
}

function displayPlayerHero(hero) {
	document.getElementById('playerHeroClass').innerHTML = gameClasses[hero.constructor.name];
	document.getElementById('playerHeroName').innerHTML = hero.name;
	document.getElementById('playerHeroLevel').innerHTML = hero.level;
	document.getElementById('playerHeroHp').innerHTML = hero.healthPoints;
	document.getElementById('playerHeroStrength').innerHTML = hero.stats.str;
	document.getElementById('playerHeroIntelligence').innerHTML = hero.stats.int;
	document.getElementById('playerHeroAgility').innerHTML = hero.stats.agi;

	hero.displayHero();
}

function displayEnemyHero(hero) {
	document.getElementById('enemyHeroClass').innerHTML = gameClasses[hero.constructor.name];
	document.getElementById('enemyHeroName').innerHTML = hero.name;
	document.getElementById('enemyHeroLevel').innerHTML = hero.level;
	document.getElementById('enemyHeroHp').innerHTML = hero.healthPoints;
	document.getElementById('enemyHeroStrength').innerHTML = hero.stats.str;
	document.getElementById('enemyHeroIntelligence').innerHTML = hero.stats.int;
	document.getElementById('enemyHeroAgility').innerHTML = hero.stats.agi;

	hero.displayHero();
}

function countStatsSum(hero) {
	let statsSum = 0;

	statsSum += hero.stats.str;
	statsSum += hero.stats.int;
	statsSum += hero.stats.agi;
	statsSum += hero.healthPoints;

	if (hero.universalPower == true) {
		statsSum += 50;
		console.log('Дополнительные 50 очков');
	}

	if (hero === playerHero) {
		const wins = getWinsFromLocalStorage();

		statsSum += wins;
	}

	return statsSum;
}

function clearCards() {
	playerHero = null;
	enemyHero = null;

	document.getElementById('playerHeroClass').innerHTML = 'Класс';
	document.getElementById('playerHeroName').innerHTML = 'Имя героя';

	document.getElementById('enemyHeroClass').innerHTML = 'Класс';
	document.getElementById('enemyHeroName').innerHTML = 'Имя героя';

	const elements = document.querySelectorAll(
		'#playerHeroLevel, #playerHeroHp, #playerHeroStrength, #playerHeroIntelligence, #playerHeroAgility, ' +
			'#enemyHeroLevel, #enemyHeroHp, #enemyHeroStrength, #enemyHeroIntelligence, #enemyHeroAgility'
	);

	for (const element of elements) {
		element.innerHTML = '--';
	}
}

async function arena(playerHero, enemyHero) {
	heading.innerHTML = `🕺 Проходит баттл между ${playerHero.name} и ${enemyHero.name}!`;

	startBattleButton.setAttribute('disabled', 'disabled');
	getEnemyButton.setAttribute('disabled', 'disabled');
	doSkillButton.setAttribute('disabled', 'disabled');

	startBattleButton.innerHTML = '🕓 Ждём результаты...';

	await wait(5);

	let winner = null;

	let playerHeroSum = countStatsSum(playerHero);
	let enemyHeroSum = countStatsSum(enemyHero);

	console.log(`Сумма значений параметров ${playerHero.name}: `, playerHeroSum);
	console.log(`Сумма значений параметров ${enemyHero.name}: `, enemyHeroSum);

	if (playerHeroSum > enemyHeroSum) {
		winner = playerHero;
		setWins(1);
	} else if (playerHeroSum < enemyHeroSum) {
		winner = enemyHero;
	}

	if (winner) {
		console.log(`Ритмично чествуем победителя: ${winner.name}`);
		heading.innerHTML = `🏆 Ритмично чествуем победителя: ${winner.name}`;
	} else {
		console.log('В танцевальном баттле победила дружба!');
		heading.innerHTML = `🤝 В танцевальном баттле победила дружба!`;
	}

	startBattleButton.innerHTML = '👀 Смотрим результаты';

	await wait(10);

	heading.innerHTML = `Heroes Dance Battle 💃`;

	startBattleButton.innerHTML = 'Начать баттл!';
	clearCards();
}

async function doSkill(hero, heroClass) {
	if (heroClass == 'Маг') {
		hero.healHero(hero);
	} else if (heroClass == 'Рыцарь') {
		hero.gainAgility(hero);
	} else {
		console.log('Класс не найден');
	}

	await wait(3);
	heading.innerHTML = 'Heroes Dance Battle 💃';
}

function validationNumbers(num, max) {
	if (num > max) {
		heading.innerHTML = '⚠️ Некоторые ваши параметры были выбраны рандомно';

		let randomNum = Math.round(Math.random() * max);

		return randomNum;
	}

	return num;
}

// --- ФУНКЦИИ ---
// --- РЕАКЦИИ НА КЛИК ---

sendToBattleButton.onclick = async () => {
	const heroName = document.getElementById('name').value.trim();
	if (heroName !== '') {
		const heroClass = document.querySelector('input[name="class"]:checked').value;
		let heroLevel = document.getElementById('level').value;
		const heroStats = {};
		const additionalAbility = document.querySelector('input[name="additionalAbility"]:checked').value;
		const additionalStat = document.getElementById('additionalStat').value;

		heroLevel = Number(heroLevel);
		heroStats.str = Number(document.getElementById('strength').value);
		heroStats.int = Number(document.getElementById('intelligence').value);
		heroStats.agi = Number(document.getElementById('agility').value);

		heroLevel = validationNumbers(heroLevel, gameParameters.MAX_LEVEL);
		heroStats.str = validationNumbers(heroStats.str, gameParameters.MAX_STAT);
		heroStats.int = validationNumbers(heroStats.int, gameParameters.MAX_STAT);
		heroStats.agi = validationNumbers(heroStats.agi, gameParameters.MAX_STAT);

		if (heroClass === 'Mage') {
			playerHero = new Mage(heroName, heroLevel, 100, heroStats, additionalAbility, additionalStat);
		} else if (heroClass === 'Knight') {
			playerHero = new Knight(heroName, heroLevel, 100, heroStats, additionalAbility, additionalStat);
		} else {
			console.error('Упс! Произошла какая-то ошибка!');
			return;
		}

		sendToBattleButton.innerHTML = '🕓 Отправляем...';
		sendToBattleButton.setAttribute('disabled', 'disabled');

		await wait(2);
		displayPlayerHero(playerHero);

		sendToBattleButton.innerHTML = 'Отправить на танцпол';
		sendToBattleButton.removeAttribute('disabled');
		getEnemyButton.removeAttribute('disabled');
		doSkillButton.removeAttribute('disabled');
	} else {
		alert('Добавьте герою имя!');
	}
};

getEnemyButton.onclick = () => {
	getEnemyButton.setAttribute('disabled', 'disabled');
	getEnemyButton.innerHTML = '🕓 Загрузка...';

	fetch(`https://api-code.practicum-team.ru/heroes`)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			let randomEnemy = data[Math.floor(Math.random() * data.length)];
			console.log(randomEnemy);
			enemyHero = new Hero(randomEnemy.title, Math.floor(Math.random() * 10) + 1, randomEnemy.hp, {
				str: randomEnemy.str,
				int: randomEnemy.int,
				agi: randomEnemy.agi
			});

			displayEnemyHero(enemyHero);
			getEnemyButton.removeAttribute('disabled');
			getEnemyButton.innerHTML = 'Получить героя';

			if (playerHero) {
				startBattleButton.removeAttribute('disabled');
			}
		})
		.catch((error) => console.error('Ошибка:', error));
};

startBattleButton.onclick = () => {
	arena(playerHero, enemyHero);
};

doSkillButton.onclick = () => {
	doSkill(playerHero, gameClasses[playerHero.constructor.name]);
};

// --- РЕАКЦИИ НА КЛИК ---
