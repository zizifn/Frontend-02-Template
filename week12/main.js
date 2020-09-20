import { Component, createElement } from "./framework"

class Carousal extends Component {
    constructor() {
        super();
        this.attributes = Object.create(null);
    }

    setAttribute(name, value) {
        this.attributes[name] = value;
    }

    render() {
        console.log(this.attributes["src"])
        this.root = document.createElement("div");
        this.root.classList.add("carousal");
        for (let url of this.attributes["src"]) {
            let div = document.createElement("div")
            div.style.backgroundImage = `url(${url})`;
            // div.style.display = "none";
            this.root.appendChild(div);
        }

        let currentIndex = 0;
        setInterval(() => {
            /**@type {HTMLElement[]} */
            let children = this.root.children;
            let nextIndex = (currentIndex + 1) % children.length;

            let current = children[currentIndex];
            let next = children[nextIndex];

            next.style.transition = "none";
            current.style.transform = `translateX(${100 - nextIndex * 100}%)`;

            setTimeout(
                () => {
                    next.style.transition = "";
                    current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
                    next.style.transform = `translateX(${-nextIndex * 100}%)`;

                    currentIndex = nextIndex;
                },
                16
            )
        }, 3000);
        return this.root;
    }

    mountTo(parent) {
        parent.appendChild(this.render())
    }

}

// 一定要定义前面，但是js是不需要的，可能是webpack，哪里有点问题
let urls = [
    "https://static001.geekbang.org/resource/image/73/2a/737fb9f94c18a26a875c27169222b82a.jpg",
    "https://static001.geekbang.org/resource/image/b1/5b/b18298c4377d44724a80dff70dc5ff5b.jpg",
    "https://static001.geekbang.org/resource/image/13/c7/13b7877ec262155ae5e7e20340a46ac7.jpg",
    "https://static001.geekbang.org/resource/image/fb/c0/fb4e210a483a7892433331082f5f09c0.jpg"

]

let a = <Carousal id="a" src={urls}>
</Carousal>

// document.body.appendChild(a);

a.mountTo(document.body);
