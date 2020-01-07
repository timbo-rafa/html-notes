(function () {
    const availableColors = "yellow lime aqua black purple blue";

    const data = [];
    let newCardIndex = 0;

    function getCardId(cardChild) {
        return parseInt($(cardChild).closest('.card-template').attr('id'), 10);
    }

    function getCard(cardChild) {
        return $(cardChild).closest('.card');
    }

    function saveCard(idx, card) {
        data[idx].title = card.find('.card-title').text();
        data[idx].text = card.find('.card-text').text();
        data[idx].color = card.find('.card-body').attr('class').replace('card-body ', '');
    }

    function loadCardData(id, card) {
        card.find('.card-title').text(data[id].title);
        card.find('.card-text').text(data[id].text);
        card.find('.card-title').removeClass(availableColors).addClass(data[id].color);
        card.find('.card-body').removeClass(availableColors).addClass(data[id].color);
        card.find('.close-icon').removeClass(availableColors).addClass(data[id].color);
        card.find('.palette-icon').removeClass(availableColors).addClass(data[id].color);
        card.find('.dropdown .fa-palette').removeClass(availableColors).addClass(data[id].color);
    }

    function loadCard(id, card) {
        card = card || $('#card-template').clone();
        card.attr('id', id);

        loadCardData(id, card);

        if (card.closest('.container-fluid').length) {
            return;
        }

        if (newCardIndex % 2 == 0) {
            const newRow = $("<div></div>");
            newRow.addClass(["card-columns", "row"]);
            newRow.append(card);
            $('.container-fluid').append(newRow);
        } else {
            $('.container-fluid .row').last().append(card);
        }
    }

    // SAVE
    const saveOnBlur  = function() {
        card = getCard(this);
        const idx = getCardId(this);
        saveCard(idx, card);
    };

    $('.container-fluid').on('focusout', '.card-body', saveOnBlur);

    $('.container-fluid').on('click', 'button.save-btn', function() {
        card = getCard(this);
        const idx = getCardId(this);
        saveCard(idx, card);
    });

    // DELETE
    $('.container-fluid').on('click', '.close-icon', function() {
        $('.container-fluid').off('focusout', '.card-body', saveOnBlur);
        const idx = getCardId(this);

        for(let i = idx + 1 ; i < newCardIndex ; i++) {
            data[i - 1] = data[i];
            data[i - 1].id = i - 1;
        }
        data.pop();

        const card = getCard(this);
        card.fadeOut('slow', function () {
            card.show();

            for(let i = idx; i < data.length ; i++) {
                loadCard(i, $('#' + i));
            }

            newCardIndex -= 1;
            $('#' + newCardIndex).remove();
            $('.container-fluid').on('focusout', '.card-body', saveOnBlur);
        });
    })

    $('.container-fluid').on("click", "a.color-picker", function() {
        const color = this.innerText.toLowerCase();
        const id = getCardId(this);
        data[id].color = color;
        loadCardData(id, getCard(this));
    });

    // CREATE
    $('#new-btn').click( function() {
        data.push({
            'id': newCardIndex,
            'title': 'New Note',
            'text': '',
            'color': 'yellow'
        });
        loadCard(newCardIndex);
        newCardIndex += 1;
    });
})();