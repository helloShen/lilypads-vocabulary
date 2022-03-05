import { Vocabulary } from "./dictionary.js";
import { dictionary } from "./dictionary.js";
import { formFloating } from "./formFloating.js";

// import mustache from "../node_modules/mustache/mustache.mjs";
import mustache from "./mustache.mjs";

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
        <div data-vid="{{vid}}" class="formCard editVocabularyCard">
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

function displayAllVocabulariesAfter(marker) {
    clear();
    dictionary.vocabularies.forEach((v) => {
        marker = displaySingleVocabularyAfter(marker, v);
    });
}

/* render and insert the vocabulary card right before the mark element, and return the inserted element. */
function displaySingleVocabularyBefore(marker, v) {
    const content = mustache.render(templateCard, v);
    marker.insertAdjacentHTML('beforebegin', content);
    const vocabCard = document.querySelector(`.vocabulary[data-vid="${v.vid}"]`);
    initVocabularyControls(vocabCard);
    return vocabCard;
}

/* render and insert the vocabulary card after the marker element, and return the inserted element. */
function displaySingleVocabularyAfter(marker, v) {
    const content = mustache.render(templateCard, v);
    marker.insertAdjacentHTML('afterend', content);
    const vocabCard = document.querySelector(`.vocabulary[data-vid="${v.vid}"]`);
    initVocabularyControls(vocabCard);
    return vocabCard;
}

/* render and insert the vocabulary edit card right before the mark element, and return the inserted element. */
function displayVocabularyEditCardBefore(marker, v) {
    const content = mustache.render(templateEditCard, v);
    marker.insertAdjacentHTML('beforebegin', content);
    const editVocabCard = document.querySelector(`.editVocabularyCard[data-vid="${v.vid}"]`);
    return editVocabCard;
}

/* render and insert the vocabulary edit card after the marker element, and return the inserted element. */
function displayVocabularyEditCardAfter(marker, v) {
    const content = mustache.render(templateEditCard, v);
    marker.insertAdjacentHTML('afterend', content);
    const editVocabCard = document.querySelector(`.editVocabularyCard[data-vid="${v.vid}"]`);
    return editVocabCard;
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
        /* generating the add vocabulary form by template */
        addDiv.classList.add('hidden');
        addDiv.insertAdjacentHTML('beforebegin', addFormHtml);
        const card = document.querySelector('.addVocabularyCard');
        /* floating input style */
        formFloating.initAll(card);
        /* bind remove buttons */
        bindExistingRemoveBtn(card);
        /* add more meanings and sentences */
        meaningSentenceControls(card);
        /* submit and cancel add vocabulary form */
        const submit = card.querySelector('button.submitAddVocabularyForm');
        const cancel = card.querySelector('button.cancelAddVocabularyForm');
        submit.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const newVocabulary = parseVocabulary(card);
            displaySingleVocabularyAfter(addDiv, newVocabulary);
            card.remove();
            addDiv.classList.remove('hidden');
        }, false);
        cancel.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            card.remove();
            addDiv.classList.remove('hidden');
        }, false);
    });
}

const meaningInputTemplate = 
`
<div data-id="{{id}}" class="wrapper form-floating">
    <input type="text" name="meaning" class="form-control"> 
    <label>meaning</label>
    <i data-id="{{id}}" class="remove material-icons">remove_circle</i>
</div>
`;

const sentenceInputTemplate = 
`
<div data-id="{{id}}" class="wrapper form-floating">
    <input type="text" name="sentence" class="form-control">
    <label>sentence</label>
    <i data-id="{{id}}" class="remove material-icons">remove_circle</i>
</div>
`;

/* the "form" argument can be the form itself or its wrapper card div */
function getIdFromForm(form) {
    /* if a vocabulary is bind to this form, use the serial in the vocabulary object. */
    let vid = form.dataset.vid;
    if (!vid) vid = form.parentNode.dataset.vid;
    const vocab = dictionary.getVocabulary(vid);
    if (vocab) return vocab.nextSerial();
    /* otherwise, use the "data-serial" attribute of the form */
    if (form.dataset.serial) return ++form.dataset.serial;
    return ++form.children[0].dataset.serial;
}

/* add event listener to a single remove button */
function bindRemoveBtn(removeBtn, inputForm) {
    removeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        inputForm.remove();
        removeBtn.remove();
    }, false);
}

/* bind all existing remove button in certain form */
function bindExistingRemoveBtn(form) {
    const existingRemoves = form.querySelectorAll("i.remove");
    existingRemoves.forEach((btn) => {
        const id = btn.dataset.id;
        let control = form.querySelector(`.wrapper[data-id="${id}"]`);
        bindRemoveBtn(btn, control);
    });
}

/* create an form input control and insert it before the marker */
function createInput(form, template, marker) {
    /* genereate element from template */
    const data = {id: getIdFromForm(form)};
    const inputContent = mustache.render(template, data);
    marker.insertAdjacentHTML('beforebegin', inputContent);
    /* binding event listeners to remove button */
    const removeBtn = form.querySelector(`i.remove[data-id="${data.id}"`);
    const newInput = form.querySelector(`.wrapper[data-id="${data.id}"]`);
    bindRemoveBtn(removeBtn, newInput);
    /* initialize floating sytle */
    formFloating.init(newInput);
}

/* add more meaning and sentence 
 * works in both addVocabularyForm and editVocabularyForm */
function meaningSentenceControls(form) {
    /* one more meaning */
    const moreMeaningBtn = form.querySelector('.moreMeaning');
    moreMeaningBtn.addEventListener('click', () => createInput(form, meaningInputTemplate, moreMeaningBtn));
    /* one more sentence */
    const moreSentenceBtn = form.querySelector('.moreSentence');
    moreSentenceBtn.addEventListener('click', () => createInput(form, sentenceInputTemplate, moreSentenceBtn));
}

function editVocabularyControlInit(vocabCard) {
    const vid = vocabCard.dataset.vid;
    const vocab = dictionary.getVocabulary(vid);
    const control = vocabCard.querySelector('.ctrls > .edit');
    control.addEventListener('click', () => {
        vocabCard.classList.add('hidden');
        /* generate vocabulary editing form */
        const vocabEditCard = displayVocabularyEditCardAfter(vocabCard, vocab);
        /* floating input style */
        formFloating.initAll(vocabEditCard);
        /* bind remove buttons */
        bindExistingRemoveBtn(vocabEditCard);
        /* add more meanings and sentences */
        meaningSentenceControls(vocabEditCard);
        /* activate submit and cancel button */
        const submit = vocabEditCard.querySelector('button.submitEditVocabularyForm');
        const cancel = vocabEditCard.querySelector('button.cancelEditVocabularyForm');
        submit.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            parseVocabulary(vocabEditCard, vocab);
            displaySingleVocabularyBefore(vocabCard, vocab);
            vocabCard.remove();
            vocabEditCard.remove();
        }, false);
        cancel.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            vocabCard.classList.remove('hidden');
            vocabEditCard.remove();
        }, false);
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


/* main */
addVocabularyInit();
displayAllVocabulariesAfter(document.querySelector('.addVocabulary'));