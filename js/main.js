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
                        <i data-vid="{{vid}}" class="remove material-icons">delete</i>
                    </div>
                </div>
            </div>
`;

const templateEditCard =
`
        <div data-vid="{{vid}}" class="formCard editVocabularyCard hidden">
            <form class="editVocabularyForm">
                <div class="form-floating">
                    <input type="text" name="word" class="form-control" value="{{word}}" required>
                    <label>word</label>
                </div>
                <div class="form-floating">
                    <input type="text" name="pronounce" class="form-control" value="{{pronounce}}"></input>
                    <label>pronounce</label>
                </div>
                {{#meanings}}
                    <div data-id="{{mid}}" class="form-floating wrapper">
                        <input type="text" name="meaning" class="form-control" value="{{value}}"> 
                        <label>meaning</label>
                        <i data-id="{{mid}}" class="remove material-icons">remove_circle</i>
                    </div>
                {{/meanings}}
                <div class="moreMeaning"><i class="material-icons">add_circle</i>Add Meaning</div>
                {{#sentences}}
                    <div data-id="{{sid}}" class="wrapper form-floating">
                        <input type="text" name="sentence" class="form-control" value="{{value}}">
                        <label>sentence</label>
                        <i data-id="{{sid}}" class="remove material-icons">remove_circle</i>
                    </div>
                {{/sentences}}
                <div class="moreSentence"><i class="material-icons">add_circle</i>Add Sentence</div>
                <div class="btns">
                    <button class="submitEditVocabularyForm">Save</button>
                    <button class="cancelEditVocabularyForm">Cancel</button>
                </div>
            </form>
        </div>
`;

const addFormHtml =
`
<div class="formCard addVocabularyCard">
    <form data-serial="2" class="addVocabularyForm">
        <div class="form-floating">
            <input type="text" name="word" class="form-control" required>
            <label>word</label>
        </div>
        <div class="form-floating">
            <input type="text" name="pronounce" class="form-control">
            <label>pronounce</label>
        </div>
        <div data-id="1" class="wrapper form-floating">
            <input type="text" name="meaning" class="form-control"> 
            <label>meaning</label>
            <i data-id="1" class="remove material-icons">remove_circle</i>
        </div>
        <div class="moreMeaning"><i class="material-icons">add_circle</i>Add Meaning</div>
        <div data-id="2" class="wrapper form-floating">
            <input type="text" name="sentence" class="form-control">
            <label>sentence</label>
            <i data-id="2" class="remove material-icons">remove_circle</i>
        </div>
        <div class="moreSentence"><i class="material-icons">add_circle</i>Add Sentence</div>
        <div class="btns">
            <button class="submitAddVocabularyForm">Save</button>
            <button class="cancelAddVocabularyForm">Cancel</button>
        </div>
    </form>
</div>
`;

function clear() {
    const cards = document.querySelectorAll('.vocabulary');
    const editCards = document.querySelectorAll('.editVocabularyCard');
    cards.forEach((card) => card.remove());
    editCards.forEach((card) => card.remove());
}

function displayAllVocabulariesAfter(previous) {
    clear();
    dictionary.vocabularies.forEach((v) => {
        previous = displaySingleVocabularyAfter(previous, v);
    });
}

/* render and insert the vocabulary card after the previous element, and return the inserted element. */
function displaySingleVocabularyAfter(previous, v) {
    const content = mustache.render(templateCard + templateEditCard, v);
    previous.insertAdjacentHTML('afterend', content);
    const vocabCard = document.querySelector(`.vocabulary[data-vid="${v.vid}"]`);
    const editVocabularyCard = document.querySelector(`.editVocabularyCard[data-vid="${v.vid}"]`);
    initVocabularyControls(vocabCard);
    return editVocabularyCard;
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
    const addDiv = document.querySelector('.addVocabulary');
    const addBtn = addDiv.querySelector('i');
    addBtn.addEventListener('click', () => {
        addDiv.insertAdjacentHTML('beforebegin', addFormHtml);
        addDiv.classList.add('hidden');
        const card = document.querySelector('.addVocabularyCard');
        const form = card.querySelector('.addVocabularyForm');
        /* submit and cancel add vocabulary form */
        const submit = form.querySelector('button.submitAddVocabularyForm');
        const cancel = form.querySelector('button.cancelAddVocabularyForm');
        submit.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const newVocabulary = parseVocabulary(form);
            const previous = addDiv;
            displaySingleVocabularyAfter(previous, newVocabulary);
            card.remove();
            addDiv.classList.remove('hidden');
        }, false);
        cancel.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            card.remove();
            addDiv.classList.remove('hidden');
        }, false);
        /* floating input style */
        const floatings = card.querySelectorAll('.form-floating');
        floatings.forEach((floating) => {
            floatingInputInit(floating);
        });
        /* add more meanings and sentences */
        meaningSentenceControls(form);
    });
}

/* works in both addVocabularyForm and editVocabularyForm */
function meaningSentenceControls(form) {
    const vocab = dictionary.getVocabulary(form.parentNode.dataset.vid);
    const moreMeaningBtn = form.querySelector('.moreMeaning');
    moreMeaningBtn.addEventListener('click', () => {
        let newMid = '';
        if (vocab) {
            newMid = vocab.nextSerial();
        } else {
            form.dataset.serial += 1;
            newMid = form.dataset.serial;
        }
        const meaningInput = 
        `
        <div data-id="${newMid}" class="wrapper form-floating">
            <input type="text" name="meaning" class="form-control"> 
            <label>meaning</label>
            <i data-id="${newMid}" class="remove material-icons">remove_circle</i>
        </div>
        `;
        moreMeaningBtn.insertAdjacentHTML('beforebegin', meaningInput);
        const removeBtn = form.querySelector(`i.remove[data-id="${newMid}"`);
        const newInput = form.querySelector(`.wrapper[data-id="${newMid}"]`);
        removeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            newInput.remove();
            removeBtn.remove();
        }, false);
        floatingInputInit(newInput);
    });
    const moreSentenceBtn = form.querySelector('.moreSentence');
    
    moreSentenceBtn.addEventListener('click', () => {
        let newSid = '';
        if (vocab) {
            newSid = vocab.nextSerial();
        } else {
            form.dataset.serial += 1;
            newSid = form.dataset.serial;
        }
        const sentenceInput = 
        `
        <div data-id="${newSid}" class="wrapper form-floating">
            <input type="text" name="sentence" class="form-control">
            <label>sentence</label>
            <i data-id="${newSid}" class="remove material-icons">remove_circle</i>
        </div>
        `;
        moreSentenceBtn.insertAdjacentHTML('beforebegin', sentenceInput);
        const removeBtn = form.querySelector(`i.remove[data-id="${newSid}"`);
        const newInput = form.querySelector(`.wrapper[data-id="${newSid}"]`);
        removeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            newInput.remove();
            removeBtn.remove();
        }, false);
        floatingInputInit(newInput);
    });

    /* bind existing remove button */
    const existingRemoves = form.querySelectorAll("i.remove");
    existingRemoves.forEach((btn) => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            let control = form.querySelector(`.wrapper[data-id="${id}"]`);
            control.remove();
            btn.remove();
        }, false);
    });
}

function editVocabularyControlInit(vocabCard) {
    const vid = vocabCard.dataset.vid;
    const vocab = dictionary.getVocabulary(vid);
    const vocabEditCard = document.querySelector(`.editVocabularyCard[data-vid="${vid}"`);
    const control = vocabCard.querySelector('.ctrls > .edit');
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
            const mark = document.createElement("div.mark");
            vocabCard.insertAdjacentElement('beforebegin', mark);
            vocabCard.remove();
            vocabEditCard.remove();
            displaySingleVocabularyAfter(mark, vocab);
            mark.remove();
        }, false);
        cancel.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            vocabCard.classList.remove('hidden');
            vocabEditForm.reset();
            vocabEditCard.classList.add('hidden');
        }, false);
        /* floating input style */
        const floatings = vocabEditCard.querySelectorAll('.form-floating');
        floatings.forEach((floating) => {
            floatingInputInit(floating);
        });
        /* add more meanings and sentences */
        meaningSentenceControls(vocabEditForm);
    });
}

function importantControlInit(vocabCard) {
    const vid = vocabCard.dataset.vid;
    const vocab = dictionary.getVocabulary(vid);
    const control = vocabCard.querySelector('.ctrls > .important');
    if (vocab.getImportant()) control.classList.add('highlight'); 
    control.addEventListener('click', () => {
        control.classList.toggle('highlight');
        vocab.toggleImportant();
    }, false);
}

function removeControlInit(vocabCard) {
    const vid = vocabCard.dataset.vid;
    const control = vocabCard.querySelector('.ctrls > .remove');
    control.addEventListener('click', () => {
        dictionary.removeVocabulary(vid);
        vocabCard.remove();
        const editVocabCard = document.querySelector(`.editVocabularyCard[data-vid="${vid}"]`);
        editVocabCard.remove();
    }, false);
}

function learnedControlInit(vocabCard) {
    const vid = vocabCard.dataset.vid;
    const vocab = dictionary.getVocabulary(vid); 
    const control = vocabCard.querySelector('.learned');
    if (vocab.getLearned()) control.classList.add('highlight');
    control.addEventListener('click', () => {
        control.classList.toggle('highlight');
        vocab.toggleLearned();
    }, false);
}

function initVocabularyControls(vocabCard) {
    editVocabularyControlInit(vocabCard);
    importantControlInit(vocabCard);
    removeControlInit(vocabCard);
    learnedControlInit(vocabCard);
}

/* Check if the form-control element is empty before losing focus (user switch to another section). 
 * If not empty, keep the floating style. */
function checkEmpty(control) {
    const content = control.value;
    if (content) {
        control.classList.add('notEmpty');
    } else {
        control.classList.remove('notEmpty');
    }
}

/* Bind listener for form-floating element. */
function floatingInputInit(floating) {
    const control = floating.querySelector('.form-control');
    checkEmpty(control);
    control.addEventListener('blur', () => {
        checkEmpty(control);
    }, false);
}


/* main */
addVocabularyInit();
displayAllVocabulariesAfter(document.querySelector('.addVocabulary'));