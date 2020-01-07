class Storage {
    constructor(notesKey) {
        this.notesKey = notesKey || 'notesapp.notes';
        this.load();
    }

    push(item) {
        this.data.push(item);
    }

    pop() {
        this.data.pop();
    }

    save() {
        localStorage.setItem(this.notesKey, JSON.stringify(this.data));
    }

    load() {
        this.data = JSON.parse(localStorage.getItem(this.notesKey)) || [];
    }
}

class Note {
    constructor(options) {
        options = options || {};
        this.id = options.id || Note.newNoteIndex;
        this.title = options.title || "New Note";
        this.text = options.text || "";
        this.color = options.color || Note.selectedColor;
    }
}
Note.selectedColor = "yellow";
Note.availableColors = "yellow lime aqua black purple blue";

(function () {

    const storage = new Storage('notesapp.notes');
    for (let i = 0 ; i < storage.data.length; i++) {
        loadCard(i);
    }
    
    function getCardId(cardChild) {
        return parseInt($(cardChild).closest('.card-template').attr('id'), 10);
    }

    function getCard(cardChild) {
        return $(cardChild).closest('.card');
    }

    function saveCard(idx, card) {
        storage.data[idx].title = card.find('.card-title').text();
        storage.data[idx].text = card.find('.card-text').text();
        storage.data[idx].color = card.find('.card-body').attr('class').replace('card-body ', '');
        storage.save();
    }

    function loadCardData(id, card) {
        card.find('.card-title').text(storage.data[id].title);
        card.find('.card-text').text(storage.data[id].text);
        card.find('.card-title').removeClass(Note.availableColors).addClass(storage.data[id].color);
        card.find('.card-body').removeClass(Note.availableColors).addClass(storage.data[id].color);
        card.find('.close-icon').removeClass(Note.availableColors).addClass(storage.data[id].color);
        card.find('.palette-icon').removeClass(Note.availableColors).addClass(storage.data[id].color);
        card.find('.dropdown .fa-palette').removeClass(Note.availableColors).addClass(storage.data[id].color);
    }

    function loadCard(id, card) {
        card = card || $('#card-template').clone();
        card.attr('id', id);

        loadCardData(id, card);

        if (card.closest('.container-fluid').length) {
            return;
        }

        if (id % 2 == 0) {
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

    // DELETE
    $('.container-fluid').on('click', '.close-icon', function() {
        $('.container-fluid').off('focusout', '.card-body', saveOnBlur);
        const idx = getCardId(this);

        for(let i = idx + 1 ; i < storage.data.length ; i++) {
            storage.data[i - 1] = storage.data[i];
            storage.data[i - 1].id = i - 1;
        }
        storage.pop();

        const card = getCard(this);
        card.fadeOut('slow', function () {
            card.show();

            for(let i = idx; i < storage.data.length ; i++) {
                loadCard(i, $('#' + i));
            }

            $('#' + storage.data.length).remove();
            $('.container-fluid').on('focusout', '.card-body', saveOnBlur);
        });
    })

    $('.container-fluid').on("click", "a.color-picker", function() {
        Note.selectedColor = this.innerText.toLowerCase();
        const id = getCardId(this);
        storage.data[id].color = Note.selectedColor;
        loadCardData(id, getCard(this));
    });

    // CREATE
    $('#new-btn').click( function() {
        storage.push(new Note());
        loadCard(storage.data.length - 1);
    });
})();