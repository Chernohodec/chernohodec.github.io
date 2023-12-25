document.addEventListener("DOMContentLoaded", ()=>{
    const pageHamburger = document.querySelector('.page-hamburger')
    const userHamburger = document.querySelector('.user-hamburger')
    const headerOverlay = document.querySelector('.header-overlay')
    const headerBar = document.querySelector('.header-bar')

    if(pageHamburger){
        pageHamburger.addEventListener('click', function(){
            pageHamburger.classList.toggle('is-active')
            headerOverlay.classList.toggle('header-overlay_is-active')
            headerBar.classList.toggle('header-bar_is-active')
        })
    }

    if(userHamburger){
        userHamburger.addEventListener('click', function(){
            userHamburger.classList.toggle('is-active')
            document.querySelector('.account-links').classList.toggle('account-links_is-active')
        })
    }

    const collapseTriggers = document.querySelectorAll('.condition-item__trigger')
    if(collapseTriggers){
        collapseTriggers.forEach(trigger=>{
            trigger.addEventListener('click', (e)=>{
                e.preventDefault()
                trigger.classList.toggle('condition-item__trigger_is-active')
                trigger.closest('.condition-item').querySelector('.condition-item__text-block').classList.toggle('condition-item__text-block_is-active')
            })
        })
    }

    // registry place copy
    const registryFieldCopyInput = document.querySelector('#registry-adress-copy')
    const livingAdress = document.querySelector('#living-adress')

    if(registryFieldCopyInput){
        registryFieldCopyInput.addEventListener('change', function(e){
            const registryFieldText = document.querySelector('#registry-adress').value

            if(e.target.checked){
                livingAdress.value = registryFieldText
            } else {
                livingAdress.value = ''
            }
        })
    }

    // subeducation

    const formsCounter = document.querySelector('#id_form-TOTAL_FORMS')
    const formsMax = document.querySelector('#id_form-MAX_NUM_FORMS')
    const addButton = document.querySelector('#add_education_button')
    const itemGroups = document.querySelectorAll('.expirience-wrapper__input-group')
    const lastItemGroup = itemGroups[itemGroups.length-1]

    if(addButton){
        addButton.addEventListener('click', (e)=>{
            e.preventDefault()
            if(+formsCounter.value < +formsMax.value){
                formsCounter.value = +formsCounter.value+1
                lastItemGroup.insertAdjacentHTML(
                    'afterend',
                    `
                    <div class="expirience-wrapper__input-group expirience-wrapper__input-group_type_education">
                    <input type="text" name="form-${formsCounter.value}-organization" id="id_form-${formsCounter.value}-organization" class="input-block" placeholder="Наименование вуза">
                    <input type="text" name="form-${formsCounter.value}-faculty" id="id_form-${formsCounter.value}-faculty" class="input-block" placeholder="Факультет">
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
    }


    // scroll to next

    const scrollItem = document.querySelector('.scroll-to-next')
    document.addEventListener("scroll", (event) => {
        lastKnownScrollPosition = window.scrollY;

        console.log(lastKnownScrollPosition)

        if (lastKnownScrollPosition > 40) {
            scrollItem.classList.add('scroll-to-next_hidden')
        } else {
            scrollItem.classList.remove('scroll-to-next_hidden')
        }
      });

});

