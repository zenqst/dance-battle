class Hero {
	constructor(name, level, healthPoints, stats) {
		this.name = name;
		this.level = level;
		this.healthPoints = healthPoints;
		this.stats = stats;
	}

	displayHero() {
		const heroInfo =
			`Имя: ${this.name}` +
			`\nУровень: ${this.level}` +
			`\nЖизненные силы: ${this.healthPoints}` +
			`\nСила: ${this.stats.str}` +
			`\nИнтеллект: ${this.stats.int}` +
			`\nЛовкость: ${this.stats.agi}`;
		console.log(heroInfo);
	}
}

class Knight extends Hero {
	constructor(name, level, healthPoints, stats, universalPower, energy) {
		super(name, level, healthPoints, stats);
		this.universalPower = universalPower;
		this.energy = energy;
	}

	displayHero() {
		super.displayHero();
		console.log(`Энергия: ${this.energy}`);

		if (this.universalPower) {
			console.log('Доступен навык танца танго на коне!');
		} else {
			console.log('Слишком мало навыков для танца на коне!');
		}
	}

	async gainAgility(hero) {
		if (this.energy >= gameParameters.MIN_STAT) {
			const gainAmount = Math.round((this.level * this.energy) / 30);

			if (this.stats.agi + gainAmount < gameParameters.MAX_STAT) {
				this.stats.agi += gainAmount;

				heading.innerHTML = `💪 ${this.name} увеличивает ловкость на ${gainAmount}`;
			} else {
				this.stats.agi = gameParameters.MAX_STAT;
			}

			const energyAmount = (gainAmount * 10) / this.level;
			if (this.energy - energyAmount > gameParameters.MIN_STAT) {
				this.energy -= energyAmount;
			} else {
				this.energy = gameParameters.MIN_STAT;
			}

			displayPlayerHero(hero);
		} else {
			heading.innerHTML = '😓 Слишком мало энергии...';
		}
	}
}

class Mage extends Hero {
	constructor(name, level, healthPoints, stats, universalPower, mana) {
		super(name, level, healthPoints, stats);
		this.universalPower = universalPower;
		this.mana = mana;
	}

	displayHero() {
		super.displayHero();
		console.log(`Мана: ${this.mana}`);

		if (this.universalPower) {
			console.log('Ты можешь танцевать ещё круче!');
		} else {
			console.log('Эх, маны не хватило...');
		}
	}

	healHero(hero) {
		if (this.mana >= gameParameters.MIN_STAT) {
			const healAmount = this.level * 10;

			this.healthPoints += healAmount;
			heading.innerHTML = `👌 ${this.name} увеличивает ХП на ${healAmount}`;

			this.mana -= healAmount * (10 / this.level) - this.level;
			displayPlayerHero(hero);
		} else {
			heading.innerHTML = '😓 Слишком мало маны...';
		}
	}
}
