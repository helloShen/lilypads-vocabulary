import { dictionary } from "./dictionary.js";

import mustache from "../node_modules/mustache/mustache.mjs";

const template = 
`
            <div class="vocabulary">
                <i class="learned material-icons">check_circle</i>
                <div class="card">
                    <div class="text">
                        <details>
                            <summary class="word">{{word}}</summary>
                            <div class="pronounce">{{pronounce}}</div>
                            {{#meanings}}
                            <div class="meaning">{{.}}</div>
                            {{/meanings}}
                        </details>
                        <hr>
                        {{#sentences}}
                        <div class="sentence">"{{.}}"</div>
                        {{/sentences}}
                    </div>
                    <div class="ctrls">
                        <i class="important material-icons">star</i>
                        <i class="delete material-icons">delete</i>
                    </div>
                </div>
            </div>
`;

function clear() {
    const cards = document.querySelectorAll('.vocabulary');
    cards.forEach((card) => card.remove());
}

function display() {
    clear();
    const mid = document.querySelector('.mid');
    dictionary.vocabularies.forEach((v) => {
        const card = mustache.render(template, v);
        mid.insertAdjacentHTML('beforeend', card);
    });
}

/* Test */
display();