// subeducation

const formsCounter = document.querySelector('#id_form-TOTAL_FORMS')
const formsMax = document.querySelector('#id_form-MAX_NUM_FORMS')
const addButton = document.querySelector('#add_education_button')
const itemGroups = document.querySelectorAll('.expirience-wrapper__input-group')
const lastItemGroup = itemGroups[itemGroups.length-1]

addButton.addEventListener('click', (e)=>{
    e.preventDefault()
    if(+formsCounter.value < +formsMax.value){
        formsCounter.value = +formsCounter.value+1
        lastItemGroup.insertAdjacentHTML(
            'afterend',
            `
            <div class="expirience-wrapper__input-group expirience-wrapper__input-group_type_education">
            <input type="text" name="form-${formsCounter.value}-organization" id="id_form-${formsCounter.value}-organization" class="input-block" placeholder="Наименование компании">
            <input type="text" name="form-${formsCounter.value}-faculty" id="id_form-${formsCounter.value}-faculty" class="input-block" placeholder="Должность">
            <input type="text" name="form-${formsCounter.value}-start_year" id="id_form-${formsCounter.value}-start_year" class="input-block" placeholder="Год начала">
            <input type="text" name="form-${formsCounter.value}-end_year" id="id_form-${formsCounter.value}-end_year" class="input-block" placeholder="Год выпуска">
            </div>
            `,
        );
    }

    if(+formsCounter.value === +formsMax.value){
        addButton.disabled = true
    }

})