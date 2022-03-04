import { Vocabulary } from "./dictionary.js";
import { dictionary } from "./dictionary.js";

import mustache from "../node_modules/mustache/mustache.mjs";

const templateCard = 
`
            <div data-vid="{{vid}}" class="vocabulary">
                <i class="learned material-icons">check_circle</i>
                <div class="card">
                    <div class="text">
                        <details class="addable">
                            <summary class="word">{{word}}</summary>
                            <div data-vid="{{vid}} class="pronounce editable">{{pronounce}}</div>
                            {{#meanings}}
                            <div data-vid="{{vid}}" data-id="{{mid}}" class="meaning editable removeable">
                                <i class="material-icons remove">remove_circle</i>
                                {{value}}
                                <i class="material-icons edit">create</i>
                            </div>
                            {{/meanings}}
                        </details>
                        <hr>
                        <div class="sentences addable">
                        {{#sentences}}
                        <div data-vid="{{vid}}" data-id="{{sid}}" class="sentence removeable editable">
                            <i class="material-icons remove">remove_circle</i>
                            {{value}}
                            <i class="material-icons edit">create</i>
                        </div>
                        {{/sentences}}
                        </div>
                    </div>
                    <div class="ctrls">
                        <i data-vid="{{vid}}" class="edit material-icons">edit</i>
                        <i data-vid="{{vid}}" class="important material-icons">star</i>
                        <i data-vid="{{vid}}" class="delete material-icons">delete</i>
                    </div>
                </div>
            </div>
`;

const templateEditCard =
`
            <div data-vid="{{vid}}" class="card editVocabularyCard hidden">
                <form class="editVocabularyForm">
                    <label>word</label>
                    <input type="text" name="word" value="{{word}}" required>
                    <label>pronounce</label>
                    <input type="text" name="pronounce" value="{{pronounce}}"></input>
                    {{#meanings}}
                        <label>meaning</label>
                        <input type="text" name="meaning" value="{{value}}"> 
                    {{/meanings}}
                    <div class="moreMeaning"><i class="material-icons">add_circle</i></div>
                    {{#sentences}}
                        <label>sentence</label>
                        <input type="text" name="sentence" value="{{value}}">
                    {{/sentences}}
                    <div class="moreSentence"><i class="material-icons">add_circle</i></div>
                    <button class="submitEditVocabularyForm">Save</button>
                    <button class="cancelEditVocabularyForm">Cancel</button>
                </form>
            </div>
`;

function clear() {
    const cards = document.querySelectorAll('.vocabulary');
    const editCards = document.querySelectorAll('.editVocabularyCard');
    cards.forEach((card) => card.remove());
    editCards.forEach((card) => card.remove());
}

function displayAllVocabularies() {
    clear();
    const addVocab = document.querySelector('.addVocabulary');
    dictionary.vocabularies.forEach((v) => {
        displaySingleVocabularyAfter(addVocab, v);
    });
}

function displaySingleVocabularyAfter(previous, v) {
    const content = mustache.render(templateCard + templateEditCard, v);
    previous.insertAdjacentHTML('afterend', content);
    const vocabCard = document.querySelector(`.vocabulary[data-vid="${v.vid}"]`);
    initVocabularyControls(vocabCard);
}



/* if argument >= 2, update the original vocabulary.
 * otherwise, create a new vocabulary, and insert it into the dictionary. */
function parseVocabulary(form, vocabulary) {
    const word = form.querySelector(`input[name='word']`).value;
    const pronounce = form.querySelector(`input[name='pronounce']`).value;
    const meaningInputs = form.querySelectorAll(`input[name='meaning']`);
    const meanings = [];
    meaningInputs.forEach((mi) => {
        if (mi.value) meanings.push(mi.value);
    });
    const sentenceInputs = form.querySelectorAll(`input[name='sentence']`);
    const sentences = [];
    sentenceInputs.forEach((si) => {
        if(si.value) sentences.push(si.value);
    });
    if (arguments.length < 2) {
        const newVocabulary = new Vocabulary(word, pronounce, meanings, sentences)
        dictionary.add(newVocabulary);
        return newVocabulary;
    } else {
        vocabulary.setWord(word);
        vocabulary.setPronounce(pronounce);
        vocabulary.setMeanings(meanings);
        vocabulary.setSentences(sentences);
        return vocabulary;
    }
}

function addVocabularyInit() {
    /* toggle add vocabulary form */
    const addBtn = document.querySelector('.addVocabulary > i');
    const form = document.querySelector('form.addVocabularyForm');
    addBtn.addEventListener('click', () => {
        form.reset();
        form.classList.remove('hidden');
    });
    /* submit and cancel add vocabulary form */
    const submit = document.querySelector('button.submitAddVocabularyForm');
    const cancel = document.querySelector('button.cancelAddVocabularyForm');
    submit.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const newVocabulary = parseVocabulary(form);
        const previous = document.querySelector('.addVocabulary');
        displaySingleVocabularyAfter(previous, newVocabulary);
        form.reset();
        form.classList.add('hidden');
    }, false);
    cancel.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        form.reset();
        form.classList.add('hidden');
    }, false);
    /* add more meanings and sentences */
    moreMeaningMoreSentence(form);
}

/* works in both addVocabularyForm and editVocabularyForm */
function moreMeaningMoreSentence(form) {
    const moreMeaningBtn = form.querySelector('.moreMeaning');
    const meaningInput = 
    `
    <label>meaning</label>
    <input type="text" name="meaning">
    `;
    moreMeaningBtn.addEventListener('click', () => {
        moreMeaningBtn.insertAdjacentHTML('beforebegin', meaningInput);
    });
    const moreSentenceBtn = form.querySelector('.moreSentence');
    const sentenceInput = 
    `
    <label>sentence</label>
    <input type="text" name="sentence"></input>
    `;
    moreSentenceBtn.addEventListener('click', () => {
        moreSentenceBtn.insertAdjacentHTML('beforebegin', sentenceInput);
    });
}

function editVocabularyControlInit(control) {
    const vid = control.dataset.vid;
    const vocab = dictionary.getVocabulary(vid);
    const vocabCard = document.querySelector(`.vocabulary[data-vid="${vid}"]`);
    const vocabEditCard = document.querySelector(`.editVocabularyCard[data-vid="${vid}"`);
    const previous = vocabCard.previousElementSibling;
    control.addEventListener('click', () => {
        /* generate vocabulary editing form */
        vocabCard.classList.add('hidden');
        vocabEditCard.classList.remove('hidden');
        /* activate submit and cancel button */
        const vocabEditForm = vocabEditCard.querySelector(`.editVocabularyForm`)
        const submit = vocabEditForm.querySelector('button.submitEditVocabularyForm');
        const cancel = vocabEditForm.querySelector('button.cancelEditVocabularyForm');
        submit.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            parseVocabulary(vocabEditForm, vocab);
            vocabCard.remove();
            vocabEditCard.remove();
            displaySingleVocabularyAfter(previous, vocab);
        }, false);
        cancel.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            vocabCard.classList.remove('hidden');
            vocabEditForm.reset();
            vocabEditCard.classList.add('hidden');
        }, false);
        /* add more meanings and sentences */
        moreMeaningMoreSentence(vocabEditForm);
    });
}

function initVocabularyControls(vocabularyCard) {
    const editControl = vocabularyCard.querySelector('.card > .ctrls > .edit');
    const importantControl = vocabularyCard.querySelector('.card > .ctrls > .important');
    const removeControl = vocabularyCard.querySelector('.card > .ctrls > .remove');
    editVocabularyControlInit(editControl);
}



/* main */
addVocabularyInit();
displayAllVocabularies();