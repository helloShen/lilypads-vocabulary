function Dictionary() {
    this.vocabularies = [];
}

Dictionary.prototype.add = function(v) {
    this.vocabularies.push(v);
}

Dictionary.prototype.getVocabulary = function(vid) {
    return this.vocabularies.find((v) => v.vid == vid);
}

Dictionary.prototype.removeVocabulary = function(vid) {
    const idx = this.vocabularies.findIndex((v) => v.vid == vid);
    if (idx !== -1) {
        this.vocabularies.splice(idx);
    }
}

export function Vocabulary(word, pronounce, meanings, sentences) {
    this.vid = this.getVid();
    this.serial = 0;
    this.learned = false;
    this.important = false;
    this.setWord(word);
    this.setPronounce(pronounce);
    this.setMeanings(meanings);
    this.setSentences(sentences);
}

Vocabulary.prototype.getVid = function() {
    const millis = Date.now();
    const randomInt = Math.floor(Math.random() * 1000000);
    return millis * 1000000 + randomInt;
};

Vocabulary.prototype.nextSerial = function() {
    this.serial += 1;
    return this.serial;
}

Vocabulary.prototype.getWord = function() {
    return this.word;
}

Vocabulary.prototype.setWord = function(word) {
    this.word = word;
}

Vocabulary.prototype.getPronounce = function() {
    return this.pronounce;
}

Vocabulary.prototype.setPronounce = function(pronounce) {
    this.pronounce = pronounce;
}

Vocabulary.prototype.getMeanings = function() {
    return this.meanings;
}

/* meanings must be an array */
Vocabulary.prototype.setMeanings = function(meanings) {
    this.meanings = [];
    if (meanings && Array.isArray(meanings)) {
        meanings.forEach((meaning) => {
            this.meanings.push({mid: this.nextSerial(), value: meaning});
        });
    }
}

Vocabulary.prototype.getSentence = function() {
    return this.sentences;
}

/* sentences must be an array */
Vocabulary.prototype.setSentences = function(sentences) {
    this.sentences = [];
    if (sentences && Array.isArray(sentences)) {
        sentences.forEach((sentence) => {
            this.sentences.push({sid: this.nextSerial(), value: sentence});
        });
    }
}

Vocabulary.prototype.toggleLearned = function() {
    this.learned = !this.learned;
}

Vocabulary.prototype.getLearned = function() {
    return this.learned;
}

Vocabulary.prototype.toggleImportant = function() {
    this.important = !this.important;
}

Vocabulary.prototype.getImportant = function() {
    return this.important;
}

export const dictionary = new Dictionary();



/* Test */
/*
abandon           [ə'bændən]            vt.  放弃,沉溺n.  放任
abashed           [ə'bæʃt]              adj.  1  (在人前) 感觉羞愧的,局促不安的,困窘的; 2. [因…]局促不安的
abate             [ə'beit]              vt.  缓和,减弱,减少,废除vi.  缓和,减弱,减少
abdicate          [æbdi'keit]           vt.  放弃vi.  逊位
abduct            [æb'dʌkt]             vt.  诱拐,绑走
abhor             [əb'hɔ:]              vt.  憎恶,痛恨
abhorrent         [əb'hɔrənt]           a.  令人憎恨的,可恶的,不一致的,相反的,厌恶的
ability           [ə'biliti]            n.  能力,才干
ablaze            [ə'bleiz]             a.  着火的,闪亮的,激昂的ad.  着火,闪耀
abnormal          [æb'nɔ:məl]           a.  不正常
*/
const abandon = new Vocabulary('abandon', "[ə'bændən]", ['cease to support or look after (someone); desert.', 'give up completely (a course of action, a practice, or a way of thinking).', 'complete lack of inhibition or restraint.'], ['her natural mother had abandoned her at an early age', 'he had clearly abandoned all pretense of trying to succeed', 'she sings and sways with total abandon']);
console.log(abandon);

const abashed = new Vocabulary('abashed', "[əˈbaSHt]", ['embarrassed, disconcerted, or ashamed.'], ['she was not abashed at being caught']);

const abate = new Vocabulary('abate', "[ə'beit]", [`
(of something perceived as hostile, threatening, or negative) become less intense or widespread`], [`
this action would not have been sufficient to abate the odor nuisance`]);

const abdicate = new Vocabulary('abdicate', "[æbdi'keit]", [`(of a monarch) renounce one's throne.`, `fail to fulfill or undertake (a responsibility or duty).`], [`in 1918 Kaiser Wilhelm abdicated as German emperor`, `the secretary of state should not abdicate from leadership on educational issues`]);

const abduct = new Vocabulary('abduct', "[æb'dʌkt]", [`take (someone) away illegally by force or deception; kidnap.`, `(of a muscle) move (a limb or part) away from the midline of the body or from another part.`], [`the millionaire who disappeared may have been abducted
`, `the posterior rectus muscle, which abducts the eye`]);

dictionary.add(abandon);
dictionary.add(abashed);
dictionary.add(abate);
dictionary.add(abdicate);
dictionary.add(abduct);
// console.log(dictionary);


