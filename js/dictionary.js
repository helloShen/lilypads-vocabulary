function Dictionary() {
    this.vocabularies = [];
}

Dictionary.prototype.add = function(v) {
    this.vocabularies.push(v);
}

function Vocabulary(word, pronounce, meaning, sentence) {
    this.id = this.getId();
    this.word = word;
    this.pronounce = pronounce;
    this.meanings = [];
    this.sentences = [];
    if (meaning) {
        if (Array.isArray(meaning)) {
            this.meanings = meaning;
        } else {
            this.meanings.push(meaning);
        }
    }
    if (sentence) {
        if (Array.isArray(sentence)) {
            this.sentences = sentence;
        } else {
            this.sentences.push(sentence);
        }
    }
    this.learned = false;
    this.important = false;
}

Vocabulary.prototype.getId = function() {
    const millis = Date.now();
    const randomInt = Math.floor(Math.random() * 1000);
    return millis * 1000 + randomInt;
};


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

const abashed = new Vocabulary('abashed', '', ['embarrassed, disconcerted, or ashamed.'], ['she was not abashed at being caught']);

export const dictionary = new Dictionary();
dictionary.add(abandon);
dictionary.add(abashed);
console.log(dictionary);


