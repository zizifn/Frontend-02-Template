class Dog {
    // 用一个中间变量把dog和human的关系解耦出来。
    bite() {
        return Math.floor((Math.random() * 2));
    }
}

class Human {
    constructor() {
        this.isHeart = false;
    }

    // 用一个中间变量把dog和human的关系解耦出来。
    heart(damage) {
        if (damage) {
            this.isHeart = true;
            console.log('heart!!')
        }
    }
}

const dog = new Dog();
const human = new Human();
human.heart(dog.bite())