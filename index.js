(function () {
    const availableColors = "yellow lime aqua";

    const data = [];
    let newCardIndex = 0;

    function getCardId(e) {
        return parseInt($(e).closest('.card-template').attr('id'), 10);
    }

    function saveCard(idx, card) {
        data[idx].title = card.find('.card-title').text();
        data[idx].text = card.find('.card-text').text();
        data[idx].color = card.find('.card-body').attr('class').replace('card-body ', '');
        //console.log('saved', data[idx]);
    }

    function loadCard(id, newCard) {
        //console.log('loadCard', id, newCard);
        newCard = newCard || document.getElementById('card-template').cloneNode(true);
        newCard.setAttribute('id', id);

        newCard = $(newCard);
        newCard.find('.card-title').text(data[id].title);
        newCard.find('.card-text').text(data[id].text);
        newCard.find('.card-body').removeClass(availableColors).addClass(data[id].color);

        if (newCard.closest('.container-fluid').length) {
            return;
        }
        console.log('newCard', newCard);

        if (newCardIndex % 2 == 0) {
            const newRow = $(document.createElement("div"));
            newRow.addClass(["card-columns", "row"]);
            newRow.append(newCard);
            $('.container-fluid').append(newRow);
        } else {
            $('.container-fluid .row').last().append(newCard);
        }
    }

    // SAVE
    const saveOnBlur  = function() {
        //console.log('focusout', this);
        card = $(this).closest('.card');
        const idx = getCardId(this);
        saveCard(idx, card);
        //console.log('save', data);
    };

    $('.container-fluid').on('focusout', '.card-body', saveOnBlur);

    $('.container-fluid').on('click', 'button.save-btn', function() {
        card = $(this).closest('.card');
        const idx = getCardId(this);
        saveCard(idx, card);

        $('.alert').slideDown()
                   .delay(2500)
                   .slideUp();
    });

    // DELETE
    $('.container-fluid').on('click', '.close-icon', function() {
        $('.container-fluid').off('focusout', '.card-body', saveOnBlur);
        const idx = getCardId(this);

        //console.log('beforeLoop', data);
        for(let i = idx + 1 ; i < newCardIndex ; i++) {
            //document.getElementById(parseInt(i, 10).toString()).setAttribute('id', i - 1);
            //console.log(i);
            data[i - 1] = data[i];
            data[i - 1].id = i - 1;
        }
        data.pop();
        //console.log('afterLoop', data);

        const card = $(this).closest('.card');
        card.fadeOut('slow', function () {
            card.show();

            for(let i = idx; i < data.length ; i++) {
                loadCard(i, document.getElementById(i));
            }

            newCardIndex -= 1;
            document.getElementById(parseInt(newCardIndex, 10).toString()).remove();
            $('.container-fluid').on('focusout', '.card-body', saveOnBlur);
        });
    })

    $('.container-fluid').on("click", "a.color-picker", function() {
        const color = this.innerText.toLowerCase();
        //console.log('color ' + color + ' clicked', this);
        $(this).closest('.card-body').removeClass(availableColors).addClass(color);
    });

    // CREATE
    $('#new-btn').click( function() {
        //console.log('+ clicked');
        data.push({
            'id': newCardIndex,
            'title': 'New Note',
            'text': '',
            'color': 'yellow'
        });
        //console.log(data);
        loadCard(newCardIndex);
        newCardIndex += 1;
    });
})();