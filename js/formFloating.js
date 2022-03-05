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

/* Bind listener for form-floating element. 
 * The argument "floating" is the element marked with "form-floating" class */
function formFloatingInit(floating) {
    const control = floating.querySelector('.form-control');
    checkEmpty(control);
    control.addEventListener('blur', () => {
        checkEmpty(control);
    }, false);
}

/* init every single form-floating element in given target */
function initAll(target) {
    const floatings = target.querySelectorAll('.form-floating');
    floatings.forEach((floating) => {
        formFloatingInit(floating);
    });
}

export const formFloating = {
    init: formFloatingInit,
    initAll: initAll
};